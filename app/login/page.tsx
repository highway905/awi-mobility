"use client"

import {
  useLogin,
  useAuthRedirect,
  LoginForm,
  ErrorAlert,
  AuthHero,
  MobileLogo,
  type LoginFormValues,
} from "@/features/auth"

export default function Login() {
  // Custom hooks
  const { isRedirecting } = useAuthRedirect()
  const { login, isLoading: isLoginLoading, error: loginError } = useLogin()

  const handleLogin = async (data: LoginFormValues) => {
    console.log("Entering Login handler")

    await login({
      email: data.email,
      password: data.password
    })
  }

  // Show loading state while redirecting
  if (isRedirecting) {
    return (
      <div className="flex min-h-screen bg-gray-50 items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AuthHero />

      {/* Right side - Form Container */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <MobileLogo />

          {loginError && <ErrorAlert message={loginError} />}

          <LoginForm
            onSubmit={handleLogin}
            isLoading={isLoginLoading}
          />
        </div>
      </div>
    </div>
  )
}
