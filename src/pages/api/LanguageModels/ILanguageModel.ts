import { IncomingMessage } from 'http'
import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageFunctionCall,
} from 'openai'

export const MAX_RETRIES = 5

export interface ILanguageModel {
  modelName: string
  generateText(
    conversation: (
      | ChatCompletionRequestMessage
      | ChatCompletionRequestMessageFunctionCall
    )[],
    userId: string,
    retries?: number,
    ai_functions?: any[],
  ): Promise<IncomingMessage>
  // handleError(error: any): void
}
export interface ChatChoice {
  delta: {
    role?: string
    content?: string
  }
  index: number
  finish_reason: string | null
}

export interface ChatCompletion {
  id: string
  object: string
  created: number
  model: string
  choices: ChatChoice[]
}
