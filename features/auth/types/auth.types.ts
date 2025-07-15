export interface LoginRequest {
  username: string
  password: string
}

export interface LoginSuccessResponse {
  statusCode: number
  response: {
    id: string
    customerId: string
    firstName: string
    lastName: string
    userName: string
    email: string
    role: string
    roleId: string
    token: string
    refreshToken: string
    expiresInMinutes: number
    changePasswordOnLogin: boolean
    roleClaims: string[]
    expiryDate: string
    securityStamp: string
    warehouseIds: Array<{
      id: string
    }>
  }
  traceId: string
  message: string
}

export interface LoginErrorResponse {
  statusCode: number
  response: {
    message: string
    validationFailed: boolean
    validationErrors: Array<{
      key: string
      value: string
    }>
  }
  traceId: string
  message: string
}

export interface LoginFormData {
  email: string
  password: string
}
