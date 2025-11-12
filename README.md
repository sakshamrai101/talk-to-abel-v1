
# Talk to Abel

Talk to Abel is a real-time conversational AI web app built for interactive language learning for kids. It blends character-based prompting, live speech-to-text, and streaming responses to deliver playful, accessible interactions for kids and families.

## Key Features
- Character catalog with curated personalities and custom prompt builder
- Live audio capture, Whisper transcription, and Google Cloud speech synthesis
- Moderation and sentiment checks before conversations reach the model
- Canvas-based visualizations and adaptive theming for full-screen experiences
- Persistent chat state backed by Firebase auth and sockets for multi-device sync

## Stack
- Next.js 13, TypeScript, Zustand
- WebRTC + custom websocket gateway for audio events
- OpenAI GPT models for dialogue and Whisper for STT
- Google Cloud Text-to-Speech for voices

## Quick Start
1. Install dependencies: `yarn install`
2. Copy `.env.example` to `.env.local` and fill in the required keys (OpenAI, Google Cloud, Firebase)
3. Run the dev server: `yarn dev`
4. Open `http://localhost:3000`


Ensure secrets are injected at runtime (e.g., managed secrets or platform env vars). For production use HTTPS and provision long-lived OpenAI/Google keys with least privilege.
