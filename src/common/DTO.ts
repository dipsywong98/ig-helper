export interface LoginResponseDTO {
  session: IgSession
  mfa?: MfaDTO
}

export interface MfaDTO {
  username: string
  totp_two_factor_on: boolean
  two_factor_identifier: string
}

export interface MfaResponseDTO {
  session: IgSession
}

export type IgSession = Record<string, unknown>;
