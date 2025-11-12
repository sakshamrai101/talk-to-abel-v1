import {
  ChatCompletionRequestMessage,
  ChatCompletionRequestMessageFunctionCall,
} from 'openai'
import { IncomingMessage } from 'http'

import { ILanguageModel, MAX_RETRIES } from './ILanguageModel'
import { AxiosInstance } from 'axios'
import { openAiClient } from '../clients'

type Model =
  | 'gpt-3.5-turbo'
  | 'gpt-3.5-turbo-16k'
  | 'gpt-3.5-turbo-0613'
  | 'gpt-4'
  | 'gpt-4-32k'
  | 'gpt-4-32k-0314'

export default class OpenAIChatCompletion implements ILanguageModel {
  modelName: string
  openAiClient: AxiosInstance

  constructor(modelName: Model) {
    this.modelName = modelName
    this.openAiClient = openAiClient
  }

  generateText = async (
    conversation: (
      | ChatCompletionRequestMessage
      | ChatCompletionRequestMessageFunctionCall
    )[],
    userId: string,
    retries = 0,
    ai_functions?: any[],
  ): Promise<IncomingMessage> => {
    try {
      const response = await this.openAiClient.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: this.modelName,
          messages: conversation,
          max_tokens: 100,
          user: userId,
          temperature: 0.8,
          presence_penalty: 0.7,
          frequency_penalty: 0.7,
          stream: true,
          n: 1,
          ...(ai_functions &&
            ai_functions.length != 0 && { functions: ai_functions }),
        },
        {
          responseType: 'stream',
          timeout: 5000, // Add a timeout of 5 seconds
        },
      )
      return response.data as unknown as IncomingMessage
    } catch (e: any) {
      console.error(e)

      if (e.code === 'ECONNABORTED') {
        console.error('Timeout error:', e)
        // Handle timeout error as appropriate for your application
      } else if (e.response.status === 429) {
        if (retries < MAX_RETRIES) {
          // exponential backoff with jitter
          const jitter = Math.random() * 1000
          const waitTime = Math.pow(2, retries) * 1000 + jitter
          console.log(`Retrying in ${waitTime} ms...`)
          await new Promise((resolve) => setTimeout(resolve, waitTime))
          return this.generateText(
            conversation,
            userId,
            retries + 1,
            ai_functions,
          )
        } else {
          throw new Error(
            'Maximum retry attempts exceeded. Failed to create chat completion.',
          )
        }
      }
      throw new Error('Failed to create chat completion.')
    }
  }
}
