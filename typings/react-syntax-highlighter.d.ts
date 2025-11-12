declare module 'react-syntax-highlighter' {
  import { ComponentType } from 'react'

  export interface SyntaxHighlighterProps {
    style?: object
    children: React.ReactNode
    PreTag?: string | React.ComponentType<any>
  }

  export const Prism: ComponentType<SyntaxHighlighterProps>
}
