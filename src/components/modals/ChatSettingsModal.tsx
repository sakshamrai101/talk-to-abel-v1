import React, { FC } from 'react'
import { Personalities } from '../types'
import AllPromptScrollBox from './AllPromptScrollBox'

interface ChatSettingsModalProps {
  name: string | null
  personalities: Personalities
  closeChatSettingsModal: () => void
}

const ChatSettingsModal: FC<ChatSettingsModalProps> = ({
  name,
  personalities,
  closeChatSettingsModal,
}) => {
  const handleClose = () => {
    closeChatSettingsModal()
  }

  return (
    <div className="modal-container">
      <dialog id="chatSettingsModal" className="modal" open={true}>
        <h2 className="vertAlignHelper">
          <span className="material-symbols-outlined vertAlignHelper">chat</span>{' '}
          Prompt
        </h2>
        <h3>How do you want the AI to act?</h3>
        <br />
        <AllPromptScrollBox name={name} personalities={personalities} />
        <span
          className="material-symbols-outlined closePanelButton"
          onClick={handleClose}
        >
          close
        </span>
      </dialog>
    </div>
  )
}

export default ChatSettingsModal
