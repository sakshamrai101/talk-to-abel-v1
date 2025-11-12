import axios from 'axios'
import { TokenManager } from './TokenManager'
import { GOOGLE_API_URL, ServerMessageFormat, ServerMessageType } from '../constants'
import { VoiceSetting } from './VoiceSetting'
import { sendServerMessage } from '../SendMessage'

export class GoogleTTS {
  tm: TokenManager
  constructor() {
    console.log('****creating new GoogleTTS instance****')
    this.tm = new TokenManager()
  }

  generateAuthorizationHeaders = (token: string) => ({
    Authorization: `Bearer ${token}`,
    'Content-Type': 'application/json; charset=utf-8',
  })

  processSentence = async (
    sentence: string,
    ws: any,
    responseNumber: number,
    sequenceNumber: number,
    voice: VoiceSetting,
  ) => {
    const headers = this.generateAuthorizationHeaders(
      (await this.tm.getToken()) || '',
    )

    try {
      const voiceResponse = await axios.post(
        GOOGLE_API_URL,
        voice.getVoice(sentence),
        {
          headers,
          timeout: 5000, // Timeout after 5 seconds
        },
      )
      const audioBuffer = Buffer.from(voiceResponse.data.audioContent, 'base64')
      sendServerMessage(ws, ServerMessageType.AUDIO, responseNumber, sequenceNumber, audioBuffer)
    } catch (e: any) {
      if (e.code === 'ECONNABORTED') {
        console.error('Timeout error:', e)
        // Handle timeout error as appropriate for your application
      } else if (e.response && e.response.status === 401) {
        // If Unauthorized error
        console.log('Unauthorized error, fetching new token and retrying')
        this.tm.invalidateToken() // Invalidate the old token
        this.processSentence(sentence, ws, responseNumber, sequenceNumber, voice) // Retry with new token
      } else {
        console.log('Error generating voice')
      }
    }
  }
}
