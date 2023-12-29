export interface LoginResponseDTO {
  session: string
  mfa?: MfaDTO
  logedIn: boolean
}

export interface MfaDTO {
  username: string
  totp_two_factor_on: boolean
  two_factor_identifier: string
}

export interface MfaResponseDTO {
  session: string
}
