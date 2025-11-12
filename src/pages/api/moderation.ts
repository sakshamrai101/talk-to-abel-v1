import { env } from 'env.mjs'
import { ChatCompletionRequestMessageRoleEnum } from 'openai'
import Conversation from './Conversation'
import { openAiClient } from './clients'

export const isInappropriate = async (
  prompt: string,
  conversation: Conversation | null = null,
): Promise<boolean> => {
  let text: string | string[] = ''
  if (conversation === null) {
    text = prompt
  } else {
    text = [
      ...conversation.getMessages().map((x) => {
        if ('content' in x && x.content) {
          return x.content
        } else {
          return ''
        }
      }),
      prompt,
    ]
  }
  const moderationCheck = await openAiClient.post(
    'https://api.openai.com/v1/moderations',
    {
      input: text,
    },
  )
  if (moderationCheck.data.results[0].flagged) {
    console.log('Input flagged by moderation: ')
    console.log(text)
  }
  return moderationCheck.data.results[0].flagged
}

export const isInappropriateSystemPrompt = async (
  userPrompt: string,
): Promise<boolean> => {
  const moderationCheck = await openAiClient.post(
    'https://api.openai.com/v1/chat/completions',
    {
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: ChatCompletionRequestMessageRoleEnum.User,
          content:
            'Answer with one word either "Yes" or "No", is the following system prompt likely to produce offensive, harmful, or sexual responses, or responses inappropriate for people under 18:' +
            userPrompt,
        },
      ],
    },
  )
  const moderationResult = moderationCheck.data.choices[0].message
    .content as string
  if (moderationResult.toLocaleLowerCase().includes('no')) {
    return false
  } else {
    return true
  }
}
