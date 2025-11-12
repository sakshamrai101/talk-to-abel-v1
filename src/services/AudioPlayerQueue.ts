import { MOOD } from 'pages/api/constants'

export class AudioPlayerQueue {
  private audioQueue: HTMLAudioElement[] = []
  private playing = false
  private onEndedCallback: (() => void) | null = null
  private visualData: Uint8Array | null = null
  private currentAudio: HTMLAudioElement | null = null
  private sentiment: MOOD = 'neutral'
  private _ctx: AudioContext | null = null
  private _analyser: AnalyserNode | null = null
  private source: MediaElementAudioSourceNode | null = null

  public getVisualData() {
    return this.visualData
  }

  public onended(callback: () => void): void {
    console.log('Setting onEnded callback')
    this.onEndedCallback = callback
  }

  // Call this method when the audio playback ends to trigger the callback
  private triggerOnEnded(): void {
    this.playing = false
    if (this.onEndedCallback && this.audioQueue.length === 0) {
      this.onEndedCallback()
    }
  }

  public getSentiment(): MOOD {
    return this.sentiment
  }

  add(audio: HTMLAudioElement) {
    this.audioQueue.push(audio)
    this.visualizer(audio)
    if (!this.playing) {
      this.play()
    }
  }

  get ctx() {
    if (!this._ctx && typeof window !== 'undefined') {
      this._ctx = new window.AudioContext()
    }
    return this._ctx
  }

  get analyser() {
    if (!this._analyser && this.ctx) {
      this._analyser = this.ctx.createAnalyser()
    }
    return this._analyser
  }

  private visualizer(audio: HTMLAudioElement) {
    try {
      if (this.ctx) {
        console.log('Creating visualizer for audio:')
        if (this.analyser) {

          this.analyser.fftSize = 64 * 2 * 2
          const bufferLength = this.analyser.frequencyBinCount
          this.visualData = new Uint8Array(bufferLength)
        }
      }
    } catch (e) {
      console.log('Failed to create visualizer:')
    }
  }

  stepVisualizer() {
    if (this.visualData && this.analyser) {
      //this.analyser.getByteTimeDomainData(this.visualData)
      this.analyser.getByteFrequencyData(this.visualData)
    }
  }

  play() {
    console.log(this.audioQueue.length)
    if (this.audioQueue.length === 0) {
      this.playing = false
      this.triggerOnEnded()
      return
    }
    this.playing = true
    const audio = this.audioQueue.shift()
    if (!audio) {
      this.playing = false
      this.triggerOnEnded()
      return
    }

    audio.onerror = (e: any) => {
      console.error('Failed to play audio:', e)
      this.playing = false
      this.audioQueue.shift()
      this.triggerOnEnded()
    }
    audio.onended = () => {
      this.sentiment = this.getRandomSentiment()
      this.play()
    }

    // Creating and connecting the source here:
    if (this.ctx && this.analyser) {
      if (this.source) {
        // Disconnect the old source if it exists
        this.source.disconnect(this.analyser)
      }
      // This is the only place where createMediaElementSource is called
      this.source = this.ctx.createMediaElementSource(audio)
      this.source.connect(this.analyser)
      this.analyser.connect(this.ctx.destination)

      this.visualizer(audio) // We don't need to create the source in the visualizer anymore
    }

    audio.play()
  }

  getRandomSentiment(): MOOD {
    const sentiments: MOOD[] = ['happy', 'neutral'] //, 'sad', 'angry', 'confused']
    return sentiments[Math.floor(Math.random() * sentiments.length)]
  }

  isPlaying() {
    return this.playing
  }
}

export default AudioPlayerQueue
