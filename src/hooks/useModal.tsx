import { useState } from 'react'
export type ModalType =
  | 'LangSelectModal'
  | 'ThemeSelectModal'
  | 'ChatSettingsModal'
  | 'AboutModal'
  | 'LoginModal'

export const useModal = () => {
  const [showModal, setShowModal] = useState<ModalType | null>(null)

  const openModal = (modalName: ModalType) => setShowModal(modalName)

  const closeModal = (modalName: ModalType) => {
    if (showModal === modalName) {
      setShowModal(null)
    }
  }

  return {
    showModal,
    openModal,
    closeModal,
  }
}
