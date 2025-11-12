import { AiFunction } from './AiFunctions'
import Conversation from './Conversation'
import { VoiceSetting } from './Voices/VoiceSetting'

export const GOOGLE_API_URL =
  'https://texttospeech.googleapis.com/v1/text:synthesize'
export const MODEL = 'gpt-4'
export type MOOD = 'happy' | 'sad' | 'angry' | 'neutral' | 'bored' | 'confused'

export enum ServerMessageType {
  AUDIO = 1,
  TEXT = 2,
  TRANSCRIPTION = 4,
}

export enum ClientMessageType {
  PROMPT = 0,
  AUDIO = 1,
}

// Indices in the buffer that each data starts at.
export enum ServerMessageFormat {
  TYPE = 0,
  RESPONSE = 1,
  SEQUENCE = 2,
  DATA = 3,
}

// Indices in the buffer that each data starts at.
export enum ClientMessageFormat {
  TYPE = 0,
  LANG = 1,
  PERSONALITY = 2,
  RESPONSE = 3,
  DATA = 4,
}

export enum Lang {
  EN = 0,
  DE = 1,
  FR = 2,
  ES = 3,
  IT = 4,
  PT = 5,
  RU = 6,
  TR = 7,
  NL = 8,
  PL = 9,
  SV = 10,
  JA = 11,
  KO = 12,
  ZH = 13,
  CMN = 14,
  CMN_TW = 15,
  HI = 16,
  AR = 17,
  HE = 18,
  ID = 19,
  MS = 20,
  TH = 21,
  VI = 22,
  NB = 23,
  DA = 24,
  FI = 25,
  HU = 26,
  CS = 27,
  SK = 28,
  EL = 29,
}

export interface UserData {
  id: string
  convo: Conversation
  voice: VoiceSetting
  functions: AiFunction[]
}
export interface Header {
  messageId: number
  type: ServerMessageType
  sequenceNumber: number
  isFinalSentence: boolean
}

export const MAX_TOKENS = 1500

export enum AudioEncoding {
  AUDIO_ENCODING_UNSPECIFIED = 'AUDIO_ENCODING_UNSPECIFIED',
  LINEAR16 = 'LINEAR16',
  MP3 = 'MP3',
  MP3_64_KBPS = 'MP3_64_KBPS',
  OGG_OPUS = 'OGG_OPUS',
  MULAW = 'MULAW',
  ALAW = 'ALAW',
}

export interface ClientMessage {
  type: ClientMessageType
  payload: {
    message: string
    languageCode: string
  }
}

export const languageNames = (language: string) =>
  new Intl.DisplayNames([language], {
    type: 'language',
  })
export type VoiceOption = {
  languageCodes: string[]
  name: string
  ssmlGender: string
  naturalSampleRateHertz: number
}

export const supportedLanguages = [
  'da',
  'de',
  'en',
  'es',
  'fr',
  'hi',
  'it',
  'ja',
  'ko',
  'pt',
  'pl',
  'vi',
  'cmn',
  'ru',
  'nb',
]

export const voiceOptions = [
  {
    languageCodes: ['cmn-TW'],
    name: 'cmn-TW-Standard-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['pl-PL'],
    name: 'pl-PL-Wavenet-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['da-DK'],
    name: 'da-DK-Neural2-F',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['de-DE'],
    name: 'de-DE-Neural2-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['tr-TR'],
    name: 'tr-TR-Wavenet-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['ru-RU'],
    name: 'ru-RU-Wavenet-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['nb-NO'],
    name: 'nb-NO-Wavenet-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['cmn-CN'],
    name: 'cmn-CN-Wavenet-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['en-US'],
    name: 'en-US-Neural2-I',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['es-US'],
    name: 'es-US-Neural2-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['fil-PH'],
    name: 'fil-ph-Neural2-D',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['fr-CA'],
    name: 'fr-CA-Neural2-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['hi-IN'],
    name: 'hi-IN-Neural2-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['it-IT'],
    name: 'it-IT-Neural2-C',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['ja-JP'],
    name: 'ja-JP-Wavenet-C',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['ko-KR'],
    name: 'ko-KR-Neural2-C',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['pt-BR'],
    name: 'pt-BR-Neural2-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['vi-VN'],
    name: 'vi-VN-Neural2-D',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['en-AU'],
    name: 'en-AU-Neural2-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
]

export const zoeVoiceOptions = [
  {
    languageCodes: ['da-DK'],
    name: 'da-DK-Neural2-D',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['nb-NO'],
    name: 'nb-NO-Wavenet-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['cmn-CN'],
    name: 'cmn-CN-Wavenet-D',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['de-DE'],
    name: 'de-DE-Neural2-C',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['en-AU'],
    name: 'en-AU-Neural2-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['es-ES'],
    name: 'es-ES-Neural2-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['fil-PH'],
    name: 'fil-ph-Neural2-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['fr-CA'],
    name: 'fr-CA-Neural2-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['hi-IN'],
    name: 'hi-IN-Neural2-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['it-IT'],
    name: 'it-IT-Neural2-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['ja-JP'],
    name: 'ja-JP-Neural2-B',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['ko-KR'],
    name: 'ko-KR-Neural2-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['pt-BR'],
    name: 'pt-BR-Neural2-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['vi-VN'],
    name: 'vi-VN-Neural2-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
]

export const personalityVoiceOptions = [
  {
    languageCodes: ['es-US'],
    name: 'es-US-Neural2-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['fr-CA'],
    name: 'fr-CA-Neural2-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['it-IT'],
    name: 'it-IT-Neural2-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['en-AU'],
    name: 'en-AU-Neural2-B',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
]
// [ { languageCodes: [ 'mr-IN' ],
//     name: 'mr-IN-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'pa-IN' ],
//     name: 'pa-IN-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'sv-SE' ],
//     name: 'sv-SE-Standard-D',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'ta-IN' ],
//     name: 'ta-IN-Standard-D',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'yue-HK' ],
//     name: 'yue-HK-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'bn-IN' ],
//     name: 'bn-IN-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'cmn-CN' ],
//     name: 'cmn-CN-Standard-C',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'es-US' ],
//     name: 'es-US-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'gu-IN' ],
//     name: 'gu-IN-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'ja-JP' ],
//     name: 'ja-JP-Standard-C',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'kn-IN' ],
//     name: 'kn-IN-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'ml-IN' ],
//     name: 'ml-IN-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'nl-BE' ],
//     name: 'nl-BE-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'ar-XA' ],
//     name: 'ar-XA-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'da-DK' ],
//     name: 'da-DK-Standard-C',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'de-DE' ],
//     name: 'de-DE-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'en-AU' ],
//     name: 'en-AU-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'fr-CA' ],
//     name: 'fr-CA-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'he-IL' ],
//     name: 'he-IL-Standard-D',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'hi-IN' ],
//     name: 'hi-IN-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'lt-LT' ],
//     name: 'lt-LT-Standard-A',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'lv-LV' ],
//     name: 'lv-LV-Standard-A',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'ms-MY' ],
//     name: 'ms-MY-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'nb-NO' ],
//     name: 'nb-NO-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'pt-BR' ],
//     name: 'pt-BR-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'ru-RU' ],
//     name: 'ru-RU-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'te-IN' ],
//     name: 'te-IN-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'tr-TR' ],
//     name: 'tr-TR-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'fil-PH' ],
//     name: 'fil-PH-Standard-C',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'vi-VN' ],
//     name: 'vi-VN-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'id-ID' ],
//     name: 'id-ID-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'it-IT' ],
//     name: 'it-IT-Standard-C',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'pl-PL' ],
//     name: 'pl-PL-Standard-B',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 },
//   { languageCodes: [ 'ko-KR' ],
//     name: 'ko-KR-Standard-C',
//     ssmlGender: 'MALE',
//     naturalSampleRateHertz: 24000 } ]
