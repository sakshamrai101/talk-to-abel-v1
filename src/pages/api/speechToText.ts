import axios from 'axios'
import FormData from 'form-data'
import { WaveFile } from 'wavefile'

function convertToWav(float32Array: Float32Array): Buffer {
  console.log('converting to wav')
  // Create a new WaveFile object
  const wav = new WaveFile()

  const int16Array = Int16Array.from(float32Array.map((n) => n * 32767))

  wav.fromScratch(1, 16000, '16', int16Array)

  return Buffer.from(wav.toBuffer())
}
export async function handleSpeechToText(
  audioData: Float32Array,
  language?: string,
) {
  const wavData = convertToWav(audioData)

  const formData = new FormData()

  formData.append('file', wavData, {
    filename: 'audio.wav',
    contentType: 'audio/wav',
  })

  formData.append('model', 'whisper-1')
  //TODO: create a prompt for each language.
  console.log('language', language)
  if (language) {
    formData.append('language', language)
  }
  formData.append('prompt', '')
  formData.append('response_format', 'json')
  const apiKey = process.env.OPENAI_API_KEY
  if (!apiKey) {
    throw new Error('Missing OPENAI_API_KEY environment variable')
  }
  const config = {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${apiKey}`,
    },
  }
  try {
    const response = await axios.post(
      'https://api.openai.com/v1/audio/transcriptions',
      formData,
      config,
    )
    // console.log(response.data)
    const transcription = response.data.text
    console.log('TRANSCRIPT', transcription)
    return transcription
  } catch (error) {
    console.error(error)
    return ''
  }
}
