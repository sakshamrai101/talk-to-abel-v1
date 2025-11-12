import { FC } from 'react'
import { Personalities } from '../types'
import { PromptSection } from './PromptSelection'
import { CustomPromptButton } from './CustomPromptButton'

interface AllPromptScrollBoxProps {
  name: string | null
  personalities: Personalities
}

const AllPromptScrollBox: FC<AllPromptScrollBoxProps> = ({
  name,
  personalities,
}) => (
  <div className="allPromptScrollbox">
    <PromptSection
      name="Helpful assistants"
      icon="robot"
      personalities={personalities.helpful}
    />
    <PromptSection
      name="Fun, creative characters"
      icon="palette"
      personalities={personalities.fantasy}
    />
    <PromptSection
      name="Informative guides"
      icon="face"
      personalities={personalities.informative}
    />
    <p className="promptSection"
      style={{
      color: "var(--secondary)",
      }}>
      <span className="material-symbols-outlined">settings</span>
      &nbsp;More options
    </p>
    <div className="inputPanelList">
      <CustomPromptButton name={name} isQuickStart />
      <CustomPromptButton name={name} />
    </div>
  </div>
)

export default AllPromptScrollBox
