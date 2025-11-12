import { BotState, BotStateContext } from 'state/zustand'
import '../services/vadit'
import { useState, useEffect, FC, useRef, useContext } from 'react'
import { useStore } from 'zustand'

interface IVad {
  start: () => void
  pause: () => void
  onSpeechEnd: (audio: Float32Array) => any
  listening: boolean
}

declare global {
  interface Window {
    vadit: ((cb: (audio: any) => void) => Promise<IVad>) | undefined
  }
}

const HouseSpeechRecognition = ({
  activate,
  onSpeachEndCB,
}: {
  activate: boolean
  onSpeachEndCB: (audio: any) => Promise<void>
}) => {
  const storeApi = useContext(BotStateContext)
  // if (!storeApi) throw new Error('Missing Provider in the tree')
  const botState = useStore(storeApi!, (state) => state.botState)
  const setBotState = useStore(storeApi!, (state) => state.setBotState)
  const [vad, setVad] = useState<IVad | null>(null)
  const scriptsLoaded = useRef(false) // Add this ref

  useEffect(() => {
    if (vad) {
      if (botState === BotState.LISTENING) {
        console.log('vad start')
        vad.start()
      } else {
        vad.pause()
      }
    }
  }, [botState, vad])

  useEffect(() => {
    if (vad) {
      console.log('vad start')

      if (activate) {
        console.log('vad start active')
        vad.start()
      }
    }
  }, [activate, vad])

  useEffect(() => {
    if (!scriptsLoaded.current) {
      // Only load scripts if they haven't been loaded
      const loadScripts = async () => {
        const ortScript = document.createElement('script')
        ortScript.src =
          'https://cdn.jsdelivr.net/npm/onnxruntime-web/dist/ort.min.js'
        document.body.appendChild(ortScript)
        await new Promise((resolve) => {
          ortScript.onload = resolve
        })
        const vadWebScript = document.createElement('script')
        vadWebScript.src =
          'https://cdn.jsdelivr.net/npm/@ricky0123/vad-web@0.0.7/dist/bundle.min.js'
        document.body.appendChild(vadWebScript)

        await new Promise((resolve) => {
          vadWebScript.onload = () => {
            scriptsLoaded.current = true // Mark scripts as loaded
            resolve(true)
          }
        })
        if (typeof window.vadit === 'function') {
          window.vadit(onSpeachEndCB).then((vad) => {
            setVad(vad)
            setBotState(BotState.INACTIVE)
          })
        }
      }
      loadScripts()
    }
  }, [onSpeachEndCB])

  if (vad === null) {
    console.log('awaiting vad...')
    return <h1 style={{ position: 'fixed', left: '50vw' }}>Loading...</h1>
  }

  return <div></div>
}

export default HouseSpeechRecognition
