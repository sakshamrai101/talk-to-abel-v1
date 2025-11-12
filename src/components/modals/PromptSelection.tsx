import { InputPanelButton } from './InputPanelButton'
import { Personality } from '../types'

export interface PromptSectionProps {
  name: string
  icon: string
  personalities: Personality[]
}

export const PromptSection = ({
  name,
  icon,
  personalities,
}: PromptSectionProps) => (
  <div>
    <p className="promptSection" 
    style={{
      color: "var(--secondary)"
    }}>
      <span className="material-symbols-outlined">{icon}</span>
      &nbsp;{name}
    </p>
    <div className="inputPanelList">
      {personalities.map((personality: Personality) => (
        <InputPanelButton
          key={personality.name}
          personality={personality}
          name={name}
        />
      ))}
    </div>
  </div>
)
