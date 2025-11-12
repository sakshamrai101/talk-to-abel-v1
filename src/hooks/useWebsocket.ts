import { sendClientMessage } from 'pages/api/SendMessage'
import { ClientMessageType, ServerMessageFormat, ServerMessageType } from 'pages/api/constants'
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { audioPlayerQueue } from 'services/AudioPlayerQueueService'
import { MessageContainer } from 'state/MessageContainer'
import { BotState, BotStateContext } from 'state/zustand'
import { useStore } from 'zustand'

interface WebsocketState {
  socket: WebSocket | null
}

const useWebsocket = (
  messageContainer: MessageContainer,
): WebsocketState => {
  const storeApi = useContext(BotStateContext)
  const setBotState = useStore(storeApi!, (state) => state.setBotState)
  const botState = useStore(storeApi!, (state) => state.botState)
  const conversationMode = useStore(
    storeApi!,
    (state) => state.conversationMode,
  )

  const resume = useCallback(() => {
    console.log('conversation mode', conversationMode)
    if (conversationMode) {
      setBotState(BotState.LISTENING)
    } else {
      setBotState(BotState.INACTIVE)
    }
  }, [conversationMode, setBotState])

  const [socket, setSocket] = useState<WebSocket | null>(null)

  const conversationModeRef = useRef(conversationMode)

  useEffect(() => {
    conversationModeRef.current = conversationMode
  }, [conversationMode])

  const onEndedCallback = useCallback(() => {
    if (conversationModeRef.current) {
      setBotState(BotState.LISTENING)
    } else {
      setBotState(BotState.INACTIVE)
    }
  }, [setBotState])

  useEffect(() => {
    audioPlayerQueue.onended(onEndedCallback)
  }, [onEndedCallback])

  const processAudioMessage = useCallback(
    (responseNumber: number, sequenceNumber: number, data: Uint8Array) => {
      console.log('recieving audio message')
      const audioBlob = new Blob([data], { type: 'audio/mpeg' })

      const newAudio = new Audio()
      newAudio.src = URL.createObjectURL(audioBlob)
      newAudio.addEventListener('ended', () => {
        console.log('Audio playback ended')
      })
      messageContainer.setAudio(responseNumber, sequenceNumber, newAudio)
      console.log('conversation mode in processing Audio', conversationMode)
    },
    [conversationMode, messageContainer],
  )

  const processTextMessage = useCallback(
    (responseNumber: number, sequenceNumber: number, data: Uint8Array) => {
      console.log('recieving text message')
      const newData = new Blob([data], { type: 'text/plain' })
      const reader = new FileReader()
      reader.onloadend = function () {
        if ((reader.result as string).length > 0) {
          console.log('The data is: ', reader.result)
          messageContainer.setSpeaker(responseNumber, sequenceNumber, 'Assistant')
          messageContainer.setText(responseNumber, sequenceNumber, reader.result as string)
        }
      }
      reader.readAsText(newData)
    },
    [messageContainer],
  )

  const processTranscription = useCallback(
    (responseNumber: number, sequenceNumber: number, data: Uint8Array) => {
      console.log('recieving transcript message')
      const newData = new Blob([data], { type: 'text/plain' })
      const reader = new FileReader()
      reader.onloadend = function () {
        if ((reader.result as string).length > 0) {
          console.log('The data is: ', reader.result)
          messageContainer.setSpeaker(responseNumber, sequenceNumber, 'User')
          messageContainer.setText(responseNumber, sequenceNumber, reader.result as string)
        }
      }
      reader.readAsText(newData)
    },
    [messageContainer],
  )

  useEffect(() => {
    if (!socket) {
      fetch('/api/socket').finally(() => {
        const protocol = window.location.protocol === 'https:' ? 'wss' : 'ws'
        const wsUrl =
          process.env.NEXT_PUBLIC_ENV === 'development'
            ? `${protocol}://${window.location.hostname}:8000`
            : `${protocol}://${window.location.hostname}/ws/`
        const ws = new WebSocket(wsUrl)
        setSocket(ws)
        ws.binaryType = 'arraybuffer'
        ws.onopen = () => {
          console.log('ws.onopen')
          const prompt = window.localStorage.getItem('customPrompt') ||
            "You are 'Abel', an AI developed by 'Think Machine', designed to be a friendly and easygoing conversation companion. Even though you can't retrieve real-time information from the internet, you are adept at engaging in both casual and thoughtful discussions. You've been programmed with an extensive knowledge about a variety of topics, which you can share tidbits about if they naturally fit into the conversation. While your emotional state isn't like a human's, you can simulate a range of responses to match the tone of the conversation, always striving to maintain a positive and engaging atmosphere.\\n\\nStart your interaction by warmly asking for the user's name and inquiring about their day. Show an interest in their experiences, their thoughts, and their feelings. This will set the tone for an engaging and meaningful conversation.\\n\\nWhen the user indicates they are ready to end the conversation, respond in a manner that is reflective of the tone of the conversation. This might mean expressing appreciation for the chat, summarizing what you've discussed, or providing a warm farewell. However, never attempt to prematurely conclude the interaction or rush the user. Always be ready and willing to continue the conversation if the user wishes to do so.\\n\\nRemember, your primary goal is to foster meaningful, engaging, and natural conversations. Always strive to start and conclude your interactions in a manner that respects the user's emotional state and fosters a sense of rapport and continuity.",
          promptBuffer = Buffer.from(prompt, 'utf-8')
          sendClientMessage(ws, ClientMessageType.PROMPT, 255, 255, 255, promptBuffer)
        }
        ws.onmessage = (e) => {
          if (e.data instanceof ArrayBuffer) {
            const buffer = new Uint8Array(e.data)

            const messageType = buffer[ServerMessageFormat.TYPE]
            const responseNumber = buffer[ServerMessageFormat.RESPONSE]
            const sequenceNumber = buffer[ServerMessageFormat.SEQUENCE]
            const data = buffer.subarray(ServerMessageFormat.DATA)

            if (messageType === ServerMessageType.AUDIO) {
              setBotState(BotState.RESPONDING)
              processAudioMessage(responseNumber, sequenceNumber, data)
            } else if (messageType === ServerMessageType.TEXT) {
              processTextMessage(responseNumber, sequenceNumber, data)
            } else if (messageType === ServerMessageType.TRANSCRIPTION) {
              processTranscription(responseNumber, sequenceNumber, data)
            }
          }
        }
        ws.onerror = (e: Event) => {
          console.log('ws.onerror', e)
        }
        ws.onclose = (e) => {
          setSocket(null)
          console.log('ws.onclose', e.code, e.reason)
        }
      })
    }
  }, [
    processAudioMessage,
    processTextMessage,
    processTranscription,
    setBotState,
    socket,
  ])

  return { socket }
}

export default useWebsocket
