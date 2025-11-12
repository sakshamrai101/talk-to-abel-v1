if (typeof window !== 'undefined') {
  window.vadit = async function vadit(onSpeechEndCB) {
    const myvad = await vad.MicVAD.new({
      startOnLoad: true,
      positiveSpeechThreshold: 0.98,
      negativeSpeechThreshold: 0.9,
      onSpeechStart: () => {
        console.log('onSpeechStart...')
      },
      onSpeechEnd: (audio) => {
        console.log('onSpeechEnd...')
        onSpeechEndCB(audio)
      },
    })

    return myvad
  }
}
