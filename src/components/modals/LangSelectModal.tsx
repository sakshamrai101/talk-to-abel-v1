import { FC, useState } from 'react'

interface LanguageData {
  label?: string
  value: string
}

interface LanguageAccentMap {
  [key: string]: string
}

interface LangSelectModalProps {
  name: string | null
  languageData: LanguageData[]
  languageToAccentMap: LanguageAccentMap
  closeModal: () => void
  setLanguageCode: (languageCode: string) => void
  languageCode: string
}

const LangSelectModal: FC<LangSelectModalProps> = ({
  name,
  languageData,
  languageToAccentMap,
  closeModal,
  setLanguageCode,
  languageCode,
}) => {
  const selectLanguage = (language: LanguageData) => {
    window.localStorage.setItem('language', language.value)
    window.localStorage.setItem(
      'languageAccent',
      languageToAccentMap[language.value],
    )
    setLanguageCode(language.value)
  }

  return (
    <div className="modal-container">
      <dialog id="langSelectModal" className="modal" open={true}>
        <h2 className="vertAlignHelper">
          <span className="material-symbols-outlined vertAlignHelper">
            language
          </span>{' '}
          Language
        </h2>
        <h3>What language will you be talking to {name} in?</h3>
        <div className="inputPanelGrid">
          {languageData.map((language) => (
            <button
              key={language.value}
              className="inputPanelButton"
              style={{
                backgroundColor:
                  languageCode === language.value ? 'var(--secondary)' : '#F0F0F0',
                color: languageCode === language.value ? 'white' : 'black',
                width: "145px",
                height: "55px",
              }} 
              onClick={() => {
                selectLanguage(language)
                closeModal()
              }}
            >
              {language.label?.toLocaleLowerCase()}
            </button>
          ))}
        </div>
        <br />
        <span
          className="material-symbols-outlined closePanelButton"
          onClick={closeModal}
        >
          close
        </span>
      </dialog>
    </div>
  )
}

export default LangSelectModal
