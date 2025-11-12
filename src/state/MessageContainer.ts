import { audioPlayerQueue } from "services/AudioPlayerQueueService"

//TODO: Consider impementing method to convert Message to prop
export class Message {
    key: string
    timestamp: Date
    response: number
    sequence: number
    speaker?: 'User' | 'Assistant'
    text?: string
    audio?: HTMLAudioElement
    hasPlayed: boolean

    constructor(response: number, sequence: number) {
        this.key = 'r' + response + 's' + sequence + '' + Math.random()
        this.timestamp = new Date()
        this.response = response
        this.sequence = sequence
        this.hasPlayed = false
    }

    play(): void {
        if (!this.audio) {
            return
        }
        audioPlayerQueue.add(this.audio)
    }
}

export class MessageContainer {

    private messages: Map<string, Message> = new Map<string, Message>()
    private responseLengths: number[] = []

    setSpeaker(response: number, sequence: number, speaker: 'User' | 'Assistant'): void {
        this.checkAndCreateMessage(response, sequence)
        const message = this.messages.get(this.makeKey(response, sequence))
        if (!message) {
            throw new Error('checkAndCreateMessage didnt work.')
        }
        message.speaker = speaker
    }

    setText(response: number, sequence: number, text:string, ): void {
        this.checkAndCreateMessage(response, sequence)
        const message = this.messages.get(this.makeKey(response, sequence))
        if (!message) {
            throw new Error('checkAndCreateMessage didnt work.')
        }
        message.text = text
    }

    setAudio(response: number, sequence: number, audio: HTMLAudioElement): void {
        this.checkAndCreateMessage(response, sequence)
        const message = this.messages.get(this.makeKey(response, sequence))
        if (!message) {
            throw new Error('checkAndCreateMessage didnt work.')
        }
        message.audio = audio

        audio.addEventListener('ended', () => this.audioFinished(response, sequence))
        const previous = this.previousIndex(response, sequence)
        const previousMessage = this.messages.get(this.makeKey(previous.response, previous.sequence))
        if (
            (previousMessage && previousMessage.hasPlayed) || 
            (previousMessage && previousMessage.speaker === 'User')
            ) {
            audioPlayerQueue.add(audio)
        }
    }

    get(response: number, sequence: number): Message {
        const result = this.messages.get(this.makeKey(response, sequence))
        if (!result) {
            throw new Error('Invalid response and sequence number')
        }
        return result
    }

    nextResponseNumber(): number {
        return this.responseLengths.length
    }

    toArray(): Message[] {
        const result = []
        for (let i = 0; i < this.responseLengths.length; i++) {
            for (let j = 0; j <= this.responseLengths[i]; j++) {
                const message = this.messages.get(this.makeKey(i, j))
                if (message) {
                    result.push(message)
                }
            }
        }
        return result
    }

    audioFinished(response: number, sequence: number): void {
        const message = this.messages.get(this.makeKey(response, sequence))
        if (message) {
            message.hasPlayed = true
        }
        const next = this.nextIndex(response, sequence)
        const nextMessage = this.messages.get(this.makeKey(next.response, next.sequence))
        if (nextMessage && nextMessage.audio && !nextMessage.hasPlayed) {
            nextMessage.play()
        }
    }

    private checkAndCreateMessage(response: number, sequence: number): void {
        if (this.messages.get(this.makeKey(response, sequence))) {
            return
        }
        this.messages.set(this.makeKey(response, sequence), new Message(response, sequence))
        while (this.responseLengths.length <= response) {
            this.responseLengths.push(0)
        }
        if (this.responseLengths[response] < sequence) {
            this.responseLengths[response] = sequence
        }
    }

    private makeKey(response: number, sequence: number): string {
        return 'r' + response + 's' + sequence
    }

    private previousIndex(response: number, sequence: number): {response: number, sequence: number} {
        if (sequence > 0) {
            return {response, sequence: sequence - 1}
        }
        else if (response > 0) {
            return {response: response - 1, sequence: this.responseLengths[response - 1]}
        }
        else {
            return {response: -1, sequence: -1}
        }
    }

    private nextIndex(response: number, sequence: number): {response: number, sequence: number} {
        if (sequence < this.responseLengths[response]) {
            return {response, sequence: sequence + 1}
        }
        else if (response < this.responseLengths.length) {
            return {response: response + 1, sequence: 0}
        }
        else {
            return {response: -1, sequence: -1}
        }
    }
    
}