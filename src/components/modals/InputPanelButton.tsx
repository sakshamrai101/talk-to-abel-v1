import { Personality } from '../types'

interface InputPanelButtonProps {
  personality: Personality
  name: string
}

export const InputPanelButton = ({
  personality,
  name,
}: InputPanelButtonProps) => {
  const handleClick = () => {
    window.localStorage.setItem('customPrompt', personality.prompt)
    window.localStorage.setItem('promptName', personality.name)
    window.localStorage.setItem('promptOneliner', personality.introduction)
    window.localStorage.setItem('personalityCode', `${personality.code}`)
    window.location.reload()
  }

  return (
    <button
      className="inputPanelButton"
      style={{
        backgroundColor: name === personality.name ? 'var(--primary)' : 'white',
        color: name === personality.name ? 'white' : 'black',
      }}
      key={personality.name}
      onClick={handleClick}
    >
      <b>{personality.name}</b>
      <br />
      {personality.description}
    </button>
  )
}
