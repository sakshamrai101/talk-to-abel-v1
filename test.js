const data = [
  {
    languageCodes: ['da-DK'],
    name: 'da-DK-Neural2-F',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['da-DK'],
    name: 'da-DK-Neural2-D',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['de-DE'],
    name: 'de-DE-Neural2-B',
    ssmlGender: 'MALE',
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
    name: 'en-AU-Neural2-B',
    ssmlGender: 'MALE',
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
    name: 'es-ES-Neural2-B',
    ssmlGender: 'MALE',
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
    name: 'fil-ph-Neural2-D',
    ssmlGender: 'MALE',
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
    name: 'fr-CA-Neural2-B',
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
    languageCodes: ['hi-IN'],
    name: 'hi-IN-Neural2-B',
    ssmlGender: 'MALE',
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
    name: 'it-IT-Neural2-C',
    ssmlGender: 'MALE',
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
    name: 'ja-JP-Neural2-C',
    ssmlGender: 'MALE',
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
    name: 'ko-KR-Neural2-C',
    ssmlGender: 'MALE',
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
    name: 'pt-BR-Neural2-B',
    ssmlGender: 'MALE',
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
    name: 'vi-VN-Neural2-D',
    ssmlGender: 'MALE',
    naturalSampleRateHertz: 24000,
  },
  {
    languageCodes: ['vi-VN'],
    name: 'vi-VN-Neural2-A',
    ssmlGender: 'FEMALE',
    naturalSampleRateHertz: 24000,
  },
]
const voiceMap = new Map()

for (const voice of voices) {
  const language = voice.languageCodes[0].split('-')[0]
  if (!voiceMap.has(language)) {
    voiceMap.set(language, new Map())
  }
  const genderMap = voiceMap.get(language)
  if (!genderMap.has(voice.ssmlGender)) {
    genderMap.set(voice.ssmlGender, voice)
  }
}
console.log(voiceMap)
// Generate a new list with only unique voices
const uniqueVoices = []
for (const genderMap of voiceMap.values()) {
  if (genderMap.has('MALE') && genderMap.has('FEMALE')) {
    uniqueVoices.push(genderMap.get('FEMALE'))
  }
}
console.log(uniqueVoices)

export const filteredVoices = uniqueVoices
