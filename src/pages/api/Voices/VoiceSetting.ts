import { AudioEncoding, voiceOptions, zoeVoiceOptions } from '../constants'

interface GoogleVoice {
  languageCode: string
  name: string
  ssmlGender: string
}

export class VoiceSetting {
  language: string
  pitch: number
  gender: string
  voiceMap = new Map<string, GoogleVoice>()
  femaleVoiceMap = new Map<string, GoogleVoice>()
  constructor(language: string, pitch: number) {
    this.language = language
    this.pitch = pitch
    this.gender = 'MALE'
    // replace this with a call to the APIs for different voices.
    this.createMapOfVoices()
    this.createFemaleMapOfVoices()
  }
  createMapOfVoices = () => {
    for (const voice of voiceOptions) {
      const language =
        voice.languageCodes[0] === 'en-AU'
          ? voice.languageCodes[0]
          : voice.languageCodes[0].split('-')[0]
      if (!this.voiceMap.has(language)) {
        this.voiceMap.set(language, {
          languageCode: voice.languageCodes[0],
          name: voice.name,
          ssmlGender: voice.ssmlGender,
        })
      }
    }
  }

  createFemaleMapOfVoices = () => {
    for (const voice of zoeVoiceOptions) {
      const language =
        voice.languageCodes[0] === 'cmn-TW'
          ? voice.languageCodes[0]
          : voice.languageCodes[0].split('-')[0]
      if (!this.femaleVoiceMap.has(language)) {
        this.femaleVoiceMap.set(language, {
          languageCode: voice.languageCodes[0],
          name: voice.name,
          ssmlGender: voice.ssmlGender,
        })
      }
    }
  }

  setLanguage = (language: string) => {
    this.language = language
  }

  setPitch = (pitch: number) => {
    this.pitch = pitch
  }

  setGender = (gender: 'MALE' | 'FEMALE') => {
    this.gender = gender
    if (this.gender === 'MALE') {
      this.setPitch(6)
    } else {
      this.setPitch(0)
    }
  }

  getVoice = (words: string) => {
    const output = {
      input: {
        text: words,
      },
      voice:
        this.gender === 'MALE'
          ? this.voiceMap.get(this.language)
          : this.femaleVoiceMap.get(this.language),
      audioConfig: {
        pitch: this.pitch,
        audioEncoding: AudioEncoding.MP3,
      },
    }
    console.log('voice setting', output)
    return output
  }
}
