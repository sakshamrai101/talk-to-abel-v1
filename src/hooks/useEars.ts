import SpeechRecognition, {
  useSpeechRecognition,
} from 'react-speech-recognition'
import { useCallback, useEffect, useState } from 'react'

export const useEars = () => {
  const [isListening, setIsListening] = useState(false)
  const [languageAccentCode, setLanguageAccentCode] = useState('en-US')
  const isMobileDevice = () => {
    const regex =
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i
    return regex.test(navigator.userAgent)
  }

  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    finalTranscript,
    isMicrophoneAvailable,
  } = useSpeechRecognition()
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      console.error('Browser does not support speech recognition')
    }
    if (!isMicrophoneAvailable) {
      console.error('Microphone is not available')
    }
  }, [browserSupportsSpeechRecognition, isMicrophoneAvailable])

  const startListening = useCallback(() => {
    setIsListening(true)
    console.log('Start listening')
  }, [])

  const stopListening = useCallback(() => {
    setIsListening(false)
    console.log('Abort listening')
  }, [])

  useEffect(() => {
    if (!isListening) {
      SpeechRecognition.abortListening()
    }
    console.log('isListening', isListening)
    console.log('listening', listening)
    if (isListening && !listening) {
      console.log(' SpeechRecognition.startListening')
      SpeechRecognition.startListening({
        continuous: !isMobileDevice(),
        language: languageAccentCode,
      })
    }
    console.log('listening:', listening)
    console.log(transcript)
  }, [transcript, stopListening, isListening, listening, languageAccentCode])

  return {
    transcript,
    finalTranscript,
    browserSupportsSpeechRecognition,
    resetTranscript,
    startListening,
    listening,
    stopListening,
    setLanguageAccentCode,
  }
}
