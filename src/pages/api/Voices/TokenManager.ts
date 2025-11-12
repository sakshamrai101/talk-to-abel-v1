import { generateJWT, requestAccessToken } from './TokenUtil'

class TokenGenerationError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'TokenGenerationError'
  }
}

export class TokenManager {
  private token: string | null = null
  private tokenExpire: NodeJS.Timeout | null = null
  private tokenPromise: Promise<string | null> | null = null

  public async getToken(): Promise<string | null> {
    if (this.token) {
      return this.token
    }
    if (this.tokenPromise) {
      return await this.tokenPromise
    } else {
      this.tokenPromise = this.generateToken()
      const token = await this.tokenPromise
      this.tokenPromise = null
      if (!token) {
        throw new TokenGenerationError('Failed to generate new token')
      }
      return token
    }
  }

  private async generateToken(): Promise<string | null> {
    try {
      const jwtToken = await generateJWT()
      const newToken = await requestAccessToken(jwtToken)

      this.setTokenExpiry()
      this.token = newToken
      return this.token
    } catch (error: any) {
      this.token = null
      if (error instanceof Error) {
        throw new TokenGenerationError(
          'Failed to generate new token: ' + error.message,
        )
      }
      throw error
    }
  }

  private setTokenExpiry(): void {
    if (this.tokenExpire) {
      clearTimeout(this.tokenExpire)
    }
    this.tokenExpire = setTimeout(async () => {
      await this.generateToken()
    }, 30 * 60 * 1000) // Automatically refresh the token after 30 minutes.
  }

  public invalidateToken(): void {
    if (this.tokenExpire) {
      clearTimeout(this.tokenExpire)
    }
    this.token = null
  }
}
