// store.js
import { createStore, useStore } from 'zustand'
import { ReactNode, createContext, useContext, useRef } from 'react'

export enum BotState {
  LOADING = 'LOADING',
  LISTENING = 'LISTENING',
  PENDING = 'PENDING',
  THINKING = 'THINKING',
  RESPONDING = 'RESPONDING',
  INACTIVE = 'INACTIVE',
}

type BotStateShape = {
  botState: BotState
  conversationMode: boolean
}
type BotStateActions = {
  setBotState: (botState: BotState) => void
  setConversationMode: (conversationMode: boolean) => void
}
// Define a store
const createBotStore = () =>
  createStore<BotStateShape & BotStateActions>((set) => {
    return {
      botState: BotState.LOADING,
      conversationMode: true,
      setBotState: (botState: BotState) =>
        set((state) => ({ ...state, botState })),
      setConversationMode: (conversationMode: boolean) =>
        set((state) => ({ ...state, conversationMode })),
    }
  })

type TestStore = ReturnType<typeof createBotStore>

export const BotStateContext = createContext<TestStore | null>(null)

export const ZustandProvider = ({ children }: { children: ReactNode }) => {
  const botStoreRef = useRef<TestStore>()
  if (!botStoreRef.current) {
    botStoreRef.current = createBotStore()
  }
  return (
    <BotStateContext.Provider value={botStoreRef.current}>
      {children}
    </BotStateContext.Provider>
  )
}
