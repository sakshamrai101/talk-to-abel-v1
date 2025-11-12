export interface Personality {
  name: string
  description: string
  prompt: string
  introduction: string
  code: number
}

export interface Personalities {
  helpful: Personality[]
  fantasy: Personality[]
  informative: Personality[]
}
