import { ChatCompletionRequestMessageRoleEnum } from 'openai'
import { WebSocketServer, WebSocket } from 'ws'
import { IncomingMessage } from 'http'
import { ILanguageModel } from './LanguageModels/ILanguageModel'
import Conversation from './Conversation'
import {
  ClientMessageType,
  Lang,
  ServerMessageType,
  UserData,
  languageNames,
  ClientMessageFormat,
  ServerMessageFormat,
} from './constants'
import { v4 as uuidv4 } from 'uuid'
import { isInappropriate, isInappropriateSystemPrompt } from './moderation'
import { MessageHandler } from './MessageHandler'
import { VoiceSetting } from './Voices/VoiceSetting'
import { ai_functions } from './AiFunctions'
import { handleSpeechToText } from './speechToText'
import { sendServerMessage } from './SendMessage'
import OpenAIChatCompletion from './LanguageModels/OpenAIChatCompletion'

export const userMap = new Map<WebSocket, UserData>()

const languageModel: ILanguageModel = new OpenAIChatCompletion('gpt-4')

const SocketHandler = async (req: any, res: any) => {
  if (res.socket.server.wss) {
    console.log('Socket is already running')
  } else {
    const wss = new WebSocketServer({ port: 8000 })
    const server = res.socket.server
    res.socket.server.wss = wss
    server.on('upgrade', (req: any, socket: any, head: any) => {
      if (!req.url.includes('/_next/webpack-hmr')) {
        handleWebSocketServerUpgrade(req, socket, head, wss)
      }
    })
    wss.on('connection', handleWebSocketConnection)
  }
  res.end()
}

const handleWebSocketConnection = async (ws: WebSocket) => {
  ws.on('close', () => {
    console.log('WebSocket closed')
    userMap.delete(ws)
  })

  const userId: string = uuidv4()
  if (!userMap.has(ws)) {
    const conversation = new Conversation(
      languageModel,
      userId,
      'You are an assistant named Abel. You are talking to someone you just met so be polite and ask their name and then address them by their name.',
      ai_functions,
    )
    userMap.set(ws, {
      id: userId,
      convo: conversation,
      voice: new VoiceSetting('en', 6),
      functions: ai_functions,
    })
  }

  ws.on('message', async (dataMessage: Buffer) => {
    const userData = userMap.get(ws)
    if (!userData) {
      return
    }

    const protocol = dataMessage.readUInt8(ClientMessageFormat.TYPE)
    const lang = dataMessage.readUInt8(ClientMessageFormat.LANG)
    const personality = dataMessage.readUInt8(ClientMessageFormat.PERSONALITY)
    let responseNumber = dataMessage.readUInt8(ClientMessageFormat.RESPONSE)
    const data = dataMessage.subarray(ClientMessageFormat.DATA)

    const language = determineLanguage(lang)
    const prefix = determineCharacter(personality, language, userData)

    if (protocol === ClientMessageType.AUDIO) {
      handleAudioMessage(ws, data, responseNumber, language, prefix)
    } else if (protocol === ClientMessageType.PROMPT) {
      handlePromptMessage(ws, data, userId)
    }
  })
}

const handleWebSocketServerUpgrade = (
  req: IncomingMessage,
  socket: any,
  head: any,
  wss: WebSocketServer,
): void => {
  wss.handleUpgrade(req, socket, head, (ws) => {
    console.log('WebSocket server upgrade completed.')
  })
}

const handleAudioMessage = async (
  ws: any, // ws: WebSocket
  data: Buffer, 
  responseNumber: number,
  language: string,
  prefix: string,
  ): Promise<void> => {

  const handler = new MessageHandler(ws)
  const user = userMap.get(ws)
  if (!user) {
    return
  }
  const conversation = user.convo

  const length = Math.floor(data.byteLength / 4)
  const audioData = new Float32Array(new ArrayBuffer(length * 4))
  for (let i = 0; i < length; i++) {
    audioData[i] = data.readFloatLE(i * 4)
  }

  console.log('creating transcript')
  const transcription: string = await handleSpeechToText(
    audioData,
    language,
  )
  console.log('transcript created')

  const sequenceNumber = 0
  const transcriptBuffer = Buffer.from(transcription, 'utf-8')
  sendServerMessage(ws, ServerMessageType.TRANSCRIPTION, responseNumber, sequenceNumber, transcriptBuffer)
  responseNumber++

  // TODO this lack moderation..
  conversation.addMessage(
    prefix + transcription,
    ChatCompletionRequestMessageRoleEnum.User,
  )
  const responseStream: IncomingMessage =
    await conversation.generateResponse()
  handleResponseStream(responseStream, conversation, responseNumber, handler, ws)
}

const handlePromptMessage = async (
  ws: any, // ws: WebSocket
  data: Buffer, 
  userId: string,
  ): Promise<void> => {
    const user = userMap.get(ws)
    if (!user) {
      return
    }
    let prompt = data.toString()
    if (await isInappropriateSystemPrompt(prompt)) {
      prompt = 'Respond to questions as if you are a happy unicorn in love with rainbows.'
    }
    user.convo = new Conversation(
      languageModel,
      userId,
      prompt,
      ai_functions,
    )
}

const handleResponseStream = async (
  strm: IncomingMessage,
  convo: Conversation,
  responseNumber: number,
  handler: MessageHandler,
  ws: WebSocket,
): Promise<void> => {
  strm.on('data', async (chunk: Buffer) => {
    let bufferString: string = chunk.toString('utf-8')
    const lines = bufferString.split('\n\n')

    for (let line of lines) {
      if (line === '') continue
      if (line.includes('[DONE]')) {
        if (handler.func_is_ready) {
          const functions = userMap.get(ws)?.functions
          const func_to_call = functions?.filter(
            (x) => x.description.name === handler.function_call.name,
          )[0]
          const func_result = func_to_call?.function(handler.function_call.args)
          convo.addFunctionRequest(handler.function_call)
          convo.addFunctionResponse(handler.function_call.name, func_result)
          handler.reset()
          const next_strm: IncomingMessage = await convo.generateResponse()
          handleResponseStream(next_strm, convo, responseNumber, handler, ws)
        } else {
          convo.addMessage(
            handler.message,
            ChatCompletionRequestMessageRoleEnum.Assistant,
          )
          //ws.send(Buffer.from([ServerMessageType.END_AUDIO, handler.sequenceNumber]))
          handler.reset()
        }
        break
      }
      handler.handleData(responseNumber, line)
    }
  })
}

const determineLanguage = (langIndex: number): string => {
  let language = ''
  if (Lang[langIndex]) {
    language = Lang[langIndex].toLocaleLowerCase();
  } else {
    language = Lang[0].toLocaleLowerCase()
  }
  if (language.toUpperCase() === 'CMN') {
    language = 'zh'
  }
  return language
}

const determineCharacter = (personalityIndex: number, language: string, user: UserData): string => {
  let prefix = ''
  const charVoice = getCharacterVoice(personalityIndex, language)
  if (user.voice.language !== charVoice.language) {
    prefix = `Let's talk only in ${languageNames('en').of(language)}, `
    console.log(prefix)
    user.voice.setLanguage(charVoice.language)
  }
  const gender = charVoice.gender
  if (user.voice.gender !== gender) {
    user.voice.setGender(gender)
  }
  user.voice.setPitch(charVoice.pitch)
  return prefix
}

interface CharacterVoiceProps {
  gender: 'MALE' | 'FEMALE'
  language: string
  pitch: number
}

const getCharacterVoice = (
  personalityCode: number,
  language: string,
): CharacterVoiceProps => {
  switch (personalityCode) {
    case 0:
      //ABEL
      return {
        gender: 'MALE',
        language: language,
        pitch: 6,
      }
    //ZOE
    case 1:
      return {
        gender: 'FEMALE',
        language: language,
        pitch: 2,
      }
    //MIGUEL
    case 2:
      return {
        gender: 'MALE',
        language: 'es',
        pitch: 6,
      }
    // Amélie
    case 3:
      return {
        gender: 'FEMALE',
        language: 'fr',
        pitch: 6,
      }
    // Pompilio
    case 4:
      return {
        gender: 'MALE',
        language: 'it',
        pitch: 6,
      }
    // Flynn
    case 5:
      return {
        gender: 'MALE',
        language: 'en',
        pitch: 6,
      }
    case 6:
      return {
        gender: 'MALE',
        language: 'en',
        pitch: -10,
      }
    case 7:
      return {
        gender: 'MALE',
        language: 'en-AU',
        pitch: -4,
      }
    default:
      return {
        gender: 'MALE',
        language: language,
        pitch: 6,
      }
  }
}

export default SocketHandler
