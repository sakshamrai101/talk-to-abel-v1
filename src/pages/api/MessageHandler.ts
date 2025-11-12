import { WebSocket } from 'ws'
import { ChatCompletion } from './LanguageModels/ILanguageModel'
import { ServerMessageFormat, ServerMessageType } from './constants'
import { isInappropriate } from './moderation'
import { userMap } from './socket'
import { TTS } from 'pages/api/Voices/GoogleService'
import { sendServerMessage } from './SendMessage'

const DATA_PREFIX = 'data:'

export class MessageHandler {
  sentence: string
  message: string
  sequenceNumber: number
  ws: WebSocket
  function_call: {
    name: string
    args: string
  }
  func_is_ready: boolean
  constructor(ws: WebSocket) {
    this.sentence = ''
    this.sequenceNumber = 0
    this.ws = ws
    this.message = ''
    this.function_call = { name: '', args: '' }
    this.func_is_ready = false
  }

  handleData(responseNumber: number, line: string): void {
    line = line.replaceAll(DATA_PREFIX, '').trim()
    const chat = JSON.parse(line) as ChatCompletion

    const delta = chat.choices[0].delta
    if ('function_call' in delta) {
      if ('name' in (delta.function_call as object)) {
        this.function_call.name = (delta.function_call as { name: string }).name
      }
      if ('arguments' in (delta.function_call as object)) {
        this.function_call.args += (
          delta.function_call as { arguments: string }
        ).arguments
      }
      return
    }
    if (chat.choices[0].finish_reason == 'function_call') {
      this.func_is_ready = true
      return
    }
    if (!chat.choices || !chat.choices[0].delta.content) {
      return
    }

    this.sentence += chat.choices[0].delta.content
    this.sentence = this.removeSpanishInvertedPunctuation(this.sentence)
    if (
      !this.isCompleteStandardSentence(this.sentence) &&
      !this.isCompleteJapaneseSentence(this.sentence) &&
      !this.isCompleteChineseSentence(this.sentence) &&
      !this.isCompleteKoreanSentence(this.sentence) &&
      !this.isCompleteHindiSentence(this.sentence) &&
      !this.isCompleteFrenchRussianSentence(this.sentence)
    ) {
      return
    }

    this.vocalizeSentence(responseNumber, this.sequenceNumber, this.sentence)
    this.sequenceNumber++
    this.message += this.sentence
    this.sentence = ''
  }
  reset(): void {
    this.sentence = ''
    this.message = ''
    this.sequenceNumber = 0
    this.function_call = { name: '', args: '' }
    this.func_is_ready = false
  }

  private isCompleteStandardSentence(sentence: string): boolean {
    return sentence.match(/(\.|\!|\?|:|;)\s*$/) ? true : false
  }

  private isCompleteFrenchRussianSentence(sentence: string): boolean {
    return sentence.match(/(\.|\!|\?|:|;|«|»)\s*$/) ? true : false
  }

  private isCompleteHindiSentence(sentence: string): boolean {
    return sentence.match(/(।|\!|\?|:|;)\s*$/) ? true : false
  }

  private isCompleteJapaneseSentence(sentence: string): boolean {
    return sentence.match(/(。|！|？|か|よ|ね|わ)(\s|$)/) ? true : false
  }

  private isCompleteKoreanSentence(sentence: string): boolean {
    return sentence.match(/(。|！|¿|ᆢ|나|지|의|을|를|이|가)(\s|$)/)
      ? true
      : false
  }

  private isCompleteChineseSentence(sentence: string): boolean {
    return sentence.match(/(。|！|？|吗|吧|呢|了|的)(\s|$)/) ? true : false
  }

  private removeSpanishInvertedPunctuation(sentence: string): string {
    return sentence.replace(/(¿|¡)/g, '')
  }
  private vocalizeSentence = async (
    responseNumber: number,
    sequenceNumber: number,
    sentence: string,
  ): Promise<void> => {
    const userData = userMap.get(this.ws)
    if (!userData) {
      throw new Error('Websocket with no user')
    }
    const convo = userData.convo
    if (await isInappropriate(sentence, convo)) {
      sentence = "I'm having trouble responding."
    }
    const textBuffer = Buffer.from(sentence, 'utf-8')
    sendServerMessage(this.ws, ServerMessageType.TEXT, responseNumber, sequenceNumber, textBuffer)
    TTS.processSentence(sentence, this.ws, responseNumber, sequenceNumber, userData.voice)
  }
}
