// pages/api/chatCompletion.ts
import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'POST') {
    const { content } = req.body

    const data = {
      model: 'gpt-3.5-turbo-0613',
      messages: [
        {
          role: 'user',
          content: content,
        },
      ],
      functions: [
        {
          name: 'showSentiment',
          description: 'show the emotion of a text',
          parameters: {
            type: 'object',
            properties: {
              emotion: {
                type: 'string',
                enum: ['happy', 'sad', 'confused', 'neutral'],
                description: 'The emotional sentiment state, e.g. sad',
              },
            },
            required: ['emotion'],
          },
        },
      ],
      function_call: {
        name: 'showSentiment',
      },
    }

    try {
      const apiKey = process.env.OPENAI_API_KEY
      if (!apiKey) {
        throw new Error('Missing OPENAI_API_KEY environment variable')
      }

      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        data,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
          timeout: 5000,
        },
      )

      return res.status(200).json(response.data)
    } catch (error: any) {
      return res.status(500).json({ error: error.message })
    }
  } else {
    res.setHeader('Allow', ['POST'])
    res.status(405).end(`Method ${req.method} Not Allowed`)
  }
}
