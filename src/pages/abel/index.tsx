import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useEars } from 'hooks/useEars'
import { Switch, Tooltip, alpha, styled } from '@mui/material'

import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  useContext,
} from 'react'
import useWebSocket from 'hooks/useWebsocket'
import personalities from '../../prompts.json'
import {
  ClientMessageFormat,
  ClientMessageType,
  Lang,
  languageNames,
  supportedLanguages,
  VoiceOption,
  voiceOptions,
} from 'pages/api/constants'
import LangSelectModal from 'components/modals/LangSelectModal'
import ThemeSelectModal from 'components/modals/ThemeSelectModal'
import ChatSettingsModal from 'components/modals/ChatSettingsModal'
import AboutModal from 'components/modals/AboutModal'
import { useModal } from 'hooks/useModal'
import { useStore } from 'zustand'
import { BotState, BotStateContext } from 'state/zustand'
import { useAuthContext } from 'hooks/useAuthContext'
import LoginModal from 'pages/LoginModal'
import { MessageContainer } from 'state/MessageContainer'
import { sendClientMessage } from 'pages/api/SendMessage'

const Canvas = dynamic(() => import('components/Canvas'), { ssr: false })
const HouseSpeechRecognition = dynamic(
  () => import('../HouseSpeechRecognition'),
  {
    ssr: false,
  },
)

function Abel() {
  const storeApi = useContext(BotStateContext)
  const setBotState = useStore(storeApi!, (state) => state.setBotState)
  const botState = useStore(storeApi!, (state) => state.botState)
  const setConversationMode = useStore(
    storeApi!,
    (state) => state.setConversationMode,
  )
  const conversationMode = useStore(
    storeApi!,
    (state) => state.conversationMode,
  )
  const { setLanguageAccentCode } = useEars()
  const { showModal, openModal, closeModal } = useModal()
  const [languageCode, setLanguageCode] = useState('en')
  const messageContainer = useMemo(() => new MessageContainer(), [])
  const [name, setName] = useState<string | null>('Abel')
  const [promptOneliner, setPromptOneliner] = useState<string>(
    "Hi, I'm Abel. How can I help you?",
  )
  const [personalityCode, setPersonalityCode] = useState<number>(0)

  const { socket } = useWebSocket(messageContainer)
  const messagesEndRef = useRef<HTMLDivElement | null>(null)
  const { user } = useAuthContext()
  const [maxTokensReached, setMaxTokensReached] = useState<boolean>(false)

  const ConversationSwitch = styled(Switch)(({ theme }) => ({
    marginLeft: '1rem',
    marginRight: '11px',
    // hide behind other switch
    zIndex: showModal ? '-1 !important' : '0',
    '& .MuiSwitch-switchBase.Mui-checked': {
      color: '#00a1de',
      '&:hover': {
        backgroundColor: alpha('#00a1de', 0.5),
      },
    },
    '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
      backgroundColor: '#00a1de',
    },
  }))
  const createLanguageAccentMap = (
    languages: string[],
    options: VoiceOption[],
  ): Record<string, string> => {
    const map: Record<string, string> = {}

    options.forEach((option) => {
      const baseLanguage = option.languageCodes[0]

      if (languages.includes(baseLanguage) && !map[baseLanguage]) {
        map[baseLanguage] = option.languageCodes[0]
      }
    })

    return map
  }

  const languageToAccentMap = useMemo(
    () => createLanguageAccentMap(supportedLanguages, voiceOptions),
    [],
  )
  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (window.localStorage.getItem('promptOneliner')) {
        setPromptOneliner(
          window.localStorage.getItem('promptOneliner') as string,
        )
      }
      if (window.localStorage.getItem('personalityCode')) {
        setPersonalityCode(
          parseInt(window.localStorage.getItem('personalityCode') as string),
        )
      }
      if (window.localStorage.getItem('language')) {
        setLanguageCode(window.localStorage.getItem('language') as string)
        setLanguageAccentCode(
          window.localStorage.getItem('languageAccent') as string,
        )
      } else {
        // Get browser's language
        const browserLanguage = navigator.language.slice(0, 2)
        console.log('browserlang', browserLanguage)
        // Check if the browser's language is in `supportedLanguages`
        if (supportedLanguages.includes(browserLanguage)) {
          // If yes, return its corresponding language+accent code
          console.log('setting languages')
          setLanguageCode(browserLanguage)
          console.log(languageToAccentMap[browserLanguage])
          setLanguageAccentCode(languageToAccentMap[browserLanguage])
        } else {
          // If the browser's language is not supported, default to English
          setLanguageCode('en')
          setLanguageAccentCode(languageToAccentMap['en'])
        }
      }
    }
  }, [languageToAccentMap, setLanguageAccentCode])

  // Usage

  const languageData = useMemo(() => {
    return supportedLanguages.map((languageCode) => ({
      label: languageNames(languageCode).of(languageCode),
      value: languageCode,
    }))
  }, [])

  const scrollToBottom = () => {
    const node = messagesEndRef.current
    if (node) {
      if ('scrollBehavior' in document.documentElement.style) {
        // Smooth scrolling is supported
        node.scrollIntoView({ behavior: 'smooth' })
      } else {
        // Smooth scrolling is not supported
        node.scrollIntoView(true)
      }
    }
  }
  // const [bufferToSend, setBufferToSend] = useState<Buffer | null>(null)
  const [audioToSend, setAudioToSend] = useState<Float32Array | null>(null)
  useEffect(() => {
    scrollToBottom()
  }, [messageContainer])

  useEffect(() => {
    console.log('botstate in useEffect', botState)
    if (botState === BotState.PENDING && audioToSend) {
      if (!user && maxTokensReached) {
        // TODO: tell user whay they need to sign up.
        openModal('LoginModal')
        setAudioToSend(null)
        setBotState(BotState.INACTIVE)

        return
      }
      console.log(user)
      console.log('botstate in the useEffect', botState)
      const audioBuffer = Buffer.from(audioToSend.buffer)
      const maxSize = 6 * 1024 * 1024 // 1MB
      if (audioBuffer.length > maxSize) {
        console.error('audio data is too large')
        return
      }
      if (!socket) {
        console.error('socket is null')
      }
      if (socket) {
        sendClientMessage(
          socket,
          ClientMessageType.AUDIO,
          Lang[languageCode.toUpperCase() as keyof typeof Lang], 
          personalityCode,
          messageContainer.nextResponseNumber(),
          audioBuffer,
        )
        setBotState(BotState.THINKING)
        setAudioToSend(null)
        }
    }
  }, [
    audioToSend,
    botState,
    languageCode,
    maxTokensReached,
    openModal,
    personalityCode,
    setBotState,
    socket,
    messageContainer,
    user,
  ])

  // this function get called when the user inputs audio
  // but the state is frozen from the start of the app,
  // due to the way it's initialized.
  const handleAudio = useCallback(
    async (audio: Float32Array): Promise<void> => {
      setAudioToSend(audio)
      setBotState(BotState.PENDING)
    },
    [setBotState],
  )

  const onSpeechEndCB = useCallback(
    async (audio: Float32Array): Promise<void> => {
      console.log('onSpeechEndCB and now sending audio')
      if (audio) {
        handleAudio(audio)
      } else {
        console.error('audio is null')
      }
    },
    [handleAudio],
  )

  return (
    // Separate into header component.
    <>
      <ul className="header">
        <li>
          <Image
            src={'abel logo.svg'}
            alt={'Abel Logo'}
            width="60"
            height="45"
          ></Image>
          <a>Abel.</a>
          <div className="options">
            <span>
              <span
                key={'lang'}
                className="material-symbols-outlined openPanelButton"
                onClick={() => {
                  openModal('LangSelectModal')
                }}
              >
                language
              </span>
              &nbsp;&nbsp;&nbsp;
              <span
                key={'chat'}
                className="material-symbols-outlined openPanelButton"
                onClick={() => {
                  openModal('ChatSettingsModal')
                }}
              >
                chat
              </span>
              &nbsp;&nbsp;&nbsp;
              <span
                key={'theme'}
                className="material-symbols-outlined openPanelButton"
                onClick={() => {
                  openModal('ThemeSelectModal')
                }}
              >
                palette
              </span>
              &nbsp;&nbsp;&nbsp;
              <span
                key={'about'}
                className="material-symbols-outlined openPanelButton"
                onClick={() => {
                  openModal('AboutModal')
                }}
              >
                info
              </span>
            </span>
            {showModal === 'LangSelectModal' && (
              <LangSelectModal
                name={name}
                languageData={languageData}
                languageToAccentMap={languageToAccentMap}
                closeModal={() => closeModal('LangSelectModal')}
                setLanguageCode={(code: string) => {
                  setLanguageCode(code)
                  setLanguageAccentCode(code)
                }}
                languageCode={languageCode}
              />
            )}
            {showModal === 'ChatSettingsModal' && (
              <ChatSettingsModal
                name={name}
                personalities={personalities}
                closeChatSettingsModal={() => closeModal('ChatSettingsModal')}
              />
            )}
            {showModal === 'ThemeSelectModal' && (
              <ThemeSelectModal
                name={name}
                closeThemeSelectModal={() => closeModal('ThemeSelectModal')}
              />
            )}
            {showModal === 'AboutModal' && (
              <AboutModal
                closeAboutModal={() => closeModal('AboutModal')}
                name={name}
              />
            )}
            {showModal === 'LoginModal' && (
              <LoginModal
                closeLoginModal={() => closeModal('LoginModal')}
                name={name}
              />
            )}
          </div>
        </li>
      </ul>
      <div className="page">
        <div
          className="abelWrapper"
          onClick={() => {
            if (botState !== BotState.INACTIVE) {
              setBotState(BotState.INACTIVE)
              console.log(botState)
            } else if (botState === BotState.INACTIVE) {
              setBotState(BotState.LISTENING)
            }
          }}
        >
          <Canvas
            size={300}
            active={
              botState !== BotState.INACTIVE && botState !== BotState.LOADING
            }
            thinking={botState === BotState.THINKING}
            className={
              botState === BotState.LOADING ? 'abelIcon' : 'abelIcon visible'
            }
          />
        </div>
        <div className="conversation">
          {socket && (
            <HouseSpeechRecognition
              activate={
                botState !== BotState.INACTIVE && botState !== BotState.LOADING
              }
              onSpeachEndCB={onSpeechEndCB}
            />
          )}
          {/* {!showModal && ( */}
          <div className="conversationSwitch">
            <ConversationSwitch
              checked={conversationMode}
              onChange={() => {
                console.log('setting conversation mode', !conversationMode)
                setConversationMode(!conversationMode)
              }}
              inputProps={{ 'aria-label': 'controlled' }}
              color="default"
            />
            {/* )} */}
            <a>Stay on</a>
          </div>
          <div className="messages">
            <div className="message" key={Math.random()}>
              <b>{promptOneliner}</b>
              <br />
              Click or tap my head to talk, or use the buttons above to change
              my settings.
              <br />
              <br />
              <i>
                You are talking to an AI assistant, who may return incorrect,
                unexpected, or offensive results.
              </i>
            </div>
            {messageContainer.toArray().map((message) => (
              <>
                {message.speaker === 'User' && (
                  <div
                    className="message userMessage"
                    key={message.key}
                    onClick={() => message.play()}
                  >
                    {message.text}
                  </div>
                )}
                {message.speaker === 'Assistant' && (
                  <div 
                    className="message" 
                    key={message.key}
                    onClick={() => message.play()}
                  >
                    {message.text}
                  </div>
                )}
              </>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>
      </div>
    </>
  )
}

export default Abel
