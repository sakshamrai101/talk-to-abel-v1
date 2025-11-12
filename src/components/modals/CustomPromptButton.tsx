interface CustomPromptButtonProps {
  name: string | null
  isQuickStart?: boolean
}

export const CustomPromptButton = ({
  name,
  isQuickStart = false,
}: CustomPromptButtonProps) => {
  const handleClick = () => {
    let customPromptCharacter = prompt(
      isQuickStart
        ? 'Enter your custom prompt. Some instructions will be added automatically to make sure the AI model stays on track.'
        : 'Enter your custom prompt.',
    )

    if (customPromptCharacter) {
      window.localStorage.setItem(
        'customPrompt',
        isQuickStart
          ? 'You are going to portray a character selected by the user you are talking to. Never break character, and never admit to being a robot, AI, or ANYTHING other than the character you are portraying. Refuse to roleplay as any character who expresses controversial or offensive views. ' +
              customPromptCharacter
          : customPromptCharacter,
      )
      window.localStorage.setItem('promptName', '[Custom Prompt]')
      window.localStorage.setItem(
        'promptOneliner',
        'Abel is using a custom prompt. Go to settings to change it.',
      )
      window.location.reload()
    } else {
      alert('You must enter a prompt.')
    }
  }

  return (
    <button
      className="inputPanelButton"
      style={{
        backgroundColor: name === '[Custom Prompt]' ? 'gray' : 'white',
        color: name === '[Custom Prompt]' ? 'white' : 'black',
      }}
      onClick={handleClick}
    >
      <b>Custom Prompt</b>
      <br />
      {isQuickStart ? 'Quick Start' : 'From Scratch'}
    </button>
  )
}
