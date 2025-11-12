import { FC, useState } from 'react'

interface ThemeSelectModalProps {
  name: string | null
  closeThemeSelectModal: () => void
}

const ThemeSelectModal: FC<ThemeSelectModalProps> = ({
  name,
  closeThemeSelectModal,
}) => {
  const setTheme = (hue: number) => {
    window.localStorage.setItem('customTheme', hue.toString() + 'deg')
    window.location.reload()
  }

  return (
    <div className="modal-container">
      <dialog id="themeSelectModal" className="modal" open={true}>
        <h2 className="vertAlignHelper">
          <span className="material-symbols-outlined vertAlignHelper">style</span>{' '}
          Theme
        </h2>
        <h3>What color theme should {name} use?</h3>
        <div className="inputPanelGrid"
          style={{
          // margin: "0 0 0 -1em",
        }}>
          <button
            className="inputPanelButton"
            style={{
              width: "165px",
              height: "55px",
            }}
            onClick={() => setTheme(0)}
          >
            Classic
          </button>
          <button
            className="inputPanelButton"
            style={{
              width: "165px",
              height: "55px",
            }}
            onClick={() => setTheme(50)}
          >
            Subdued Blue
          </button>
          <button
            className="inputPanelButton"
            style={{
              width: "165px",
              height: "55px",
            }}
            onClick={() => setTheme(100)}
          >
            Vibrant Pink
          </button>
          <button
            className="inputPanelButton"
            style={{
              width: "165px",
              height: "55px",
            }}
            onClick={() => setTheme(150)}
          >
            Salmon Orange
          </button>
          <button
            className="inputPanelButton"
            style={{
              width: "165px",
              height: "55px",
            }}
            onClick={() => setTheme(200)}
          >
            Rusted Brown
          </button>
          <button
            className="inputPanelButton"
            style={{
              width: "165px",
              height: "55px",
            }}
            onClick={() => setTheme(250)}
          >
            Verdant Green
          </button>
        </div>
        <br />
        <span
          className="material-symbols-outlined closePanelButton"
          onClick={closeThemeSelectModal}
        >
          close
        </span>
      </dialog>
    </div>
  )
}

export default ThemeSelectModal
