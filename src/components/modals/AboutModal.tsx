import { FC, useState } from 'react'
import { SocialIcon } from 'react-social-icons'

interface AboutModalProps {
  name: string | null
  closeAboutModal: () => void
}

const AboutModal: FC<AboutModalProps> = ({ name, closeAboutModal }) => {
  const teamMembers = [
    'Keith Groves',
    'Joseph Cox',
    'Rebecca Kim',
    'Samuel Sharp',
    'Max Spirodonov',
  ]

  const handleClose = () => closeAboutModal()

  return (
    <div className="modal-container">
      <dialog id="aboutModal" className="modal" open={true}>
        <h2 className="vertAlignHelper">
          <span className="material-symbols-outlined vertAlignHelper">info</span>{' '}
          About {name}
        </h2>
        <h3>
          © 2022-2023 <a href="https://thinkmachine.io">Think Machine</a>
        </h3>
        <br />
        <h3>{teamMembers.join(', ')}</h3>
        <br />
        <SocialIcon url="https://discord.gg/Bua8Vne9dq" 
          style={{
          width: "53.5px",
          height: "50px",
          }}>
        </SocialIcon>
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

export default AboutModal
