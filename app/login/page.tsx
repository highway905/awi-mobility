"use client"

import { useState, useEffect } from "react"
import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ChevronLeft, QrCode } from "lucide-react"
import { useLoginMutation } from "@/lib/redux/api/auth"
import { encryptedMessage } from "@/utils/rsa"
import { getUserCred } from "@/utils/helper"

// Define our form schemas using zod
const loginSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(1, { message: "Password is required" }),
})

const resetPasswordSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
})

// TypeScript type inference from our schemas
type LoginFormValues = z.infer<typeof loginSchema>
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function Login() {
  const router = useRouter()
  const [isResetPassword, setIsResetPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
 
  const [login, { isLoading }] = useLoginMutation()
  
  // Check if user is already logged in
  useEffect(() => {
    const userCred = getUserCred("userCred")
    if (userCred?.token) {
      router.push("/orders")
    }
  }, [router])
  
  // Setup react-hook-form with zod resolver
  const { 
    register, 
    handleSubmit, 
    formState: { errors } 
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  const { 
    register: registerReset, 
    handleSubmit: handleSubmitReset, 
    formState: { errors: resetErrors } 
  } = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  })

  const onSubmit = async (data: LoginFormValues) => {
    setErrorMessage(null)
    
    try {
      const body = {
        username: encryptedMessage(data.email),
        password: encryptedMessage(data.password),
      }
      
      const response = await login(body).unwrap()
      
      if (response?.statusCode === 200) {
        // Successful login - redirect with a slight delay to ensure credentials are saved
        setTimeout(() => {
          router.push("/tasks")
        }, 100)
      } else {
        setErrorMessage("Invalid credentials. Please try again.")
      }
    } catch (error) {
      console.error("Login failed", error)
      setErrorMessage("An error occurred during login. Please try again.")
    }
  }

  const onResetPassword = async (data: ResetPasswordFormValues) => {
    console.log("Reset password for:", data.email)
    alert(`Password reset link sent to ${data.email}`)
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Left side - Hero Image with Branding */}
      <div className="hidden sm:flex md:w-1/2 relative">
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url('/assets/hero.png')`
          }}
        >
          <div className="absolute inset-0 bg-black/60"></div>
        </div>
        
        <div className="relative z-10 flex flex-col justify-center p-12 text-white w-full text-center">
          <div className="flex items-center mb-8">
            <svg width="94" height="66" viewBox="0 0 74 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-4">
              <path d="M35.7157 55.4458L0 49.3753V13.8063L35.7157 1.66449V55.4458Z" fill="#FBBF24"/>
              <path d="M2.05981 47.8717L35.7157 53.5917V2.62272L2.05981 14.0642V47.8717ZM36.7456 55.9995C36.6921 55.9995 36.6385 55.9951 36.5849 55.9862L0.869238 49.9157C0.368705 49.8299 0 49.3662 0 48.8198V13.2507C0 12.7671 0.291119 12.3389 0.719559 12.1926L36.4352 0.0515018C36.7483 -0.0549855 37.0896 0.00565356 37.3546 0.214931C37.6196 0.423469 37.7755 0.756241 37.7755 1.10972V54.8903C37.7755 55.2149 37.6437 55.5233 37.415 55.7333C37.2269 55.9064 36.9893 55.9995 36.7456 55.9995Z" fill="#393536"/>
              <path d="M72.461 48.8195L36.7454 54.8901V1.10876L72.461 13.2506V48.8195Z" fill="#D48519"/>
              <path d="M37.7754 2.62322V53.5922L71.4312 47.8722V14.0639L37.7754 2.62322ZM36.7455 56C36.5018 56 36.2642 55.9068 36.076 55.7338C35.8474 55.523 35.7155 55.2147 35.7155 54.8907V1.10947C35.7155 0.755992 35.8714 0.423959 36.1365 0.214682C36.4008 0.00614414 36.7427 -0.0537559 37.0558 0.0519919L72.7715 12.193C73.2 12.3387 73.4911 12.7676 73.4911 13.2512V48.8203C73.4911 49.366 73.1223 49.8304 72.6218 49.9154L36.9061 55.986C36.8526 55.9956 36.799 56 36.7455 56Z" fill="#393536"/>
              <path d="M12.5504 18.3917L23.1989 15.765V29.1432L12.5504 30.2073V18.3917Z" fill="#393536"/>
              <path d="M12.5504 34.3387L23.1989 33.622V52.6626L12.5504 50.6149V34.3387Z" fill="#393536"/>
              <path d="M47.4433 4.65265V41.3205L52.8352 40.4908V6.84969L47.4433 4.65265Z" fill="#393536"/>
              <path d="M61.2253 9.11353V39.7013L65.2969 39.3041V10.8158L61.2253 9.11353Z" fill="#393536"/>
            </svg>
            <div className="flex flex-col gap-2">
              <div className="text-xl font-medium tracking-small text-[#FBCB5C]">ADVANCED</div>
              <div className="text-xl font-medium tracking-small">WAREHOUSE</div>
            </div>
          </div>

          <div className="flex flex-col items-start">
            <h1 className="text-3xl font-bold mb-2 leading-tight">
              Empowering Excellence
            </h1>
            <p className="text-sm text-gray-200 leading-relaxed">
              Secure access to real-time warehouse operations - anytime, anywhere, on the go.
            </p>
          </div>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile logo for small screens */}
          <div className="md:hidden flex items-center justify-center mb-8">
            <svg width="48" height="36" viewBox="0 0 74 56" fill="none" xmlns="http://www.w3.org/2000/svg" className="mr-3">
              <path d="M35.7157 55.4458L0 49.3753V13.8063L35.7157 1.66449V55.4458Z" fill="#FBBF24"/>
              <path d="M2.05981 47.8717L35.7157 53.5917V2.62272L2.05981 14.0642V47.8717ZM36.7456 55.9995C36.6921 55.9995 36.6385 55.9951 36.5849 55.9862L0.869238 49.9157C0.368705 49.8299 0 49.3662 0 48.8198V13.2507C0 12.7671 0.291119 12.3389 0.719559 12.1926L36.4352 0.0515018C36.7483 -0.0549855 37.0896 0.00565356 37.3546 0.214931C37.6196 0.423469 37.7755 0.756241 37.7755 1.10972V54.8903C37.7755 55.2149 37.6437 55.5233 37.415 55.7333C37.2269 55.9064 36.9893 55.9995 36.7456 55.9995Z" fill="#393536"/>
              <path d="M72.461 48.8195L36.7454 54.8901V1.10876L72.461 13.2506V48.8195Z" fill="#D48519"/>
              <path d="M37.7754 2.62322V53.5922L71.4312 47.8722V14.0639L37.7754 2.62322ZM36.7455 56C36.5018 56 36.2642 55.9068 36.076 55.7338C35.8474 55.523 35.7155 55.2147 35.7155 54.8907V1.10947C35.7155 0.755992 35.8714 0.423959 36.1365 0.214682C36.4008 0.00614414 36.7427 -0.0537559 37.0558 0.0519919L72.7715 12.193C73.2 12.3387 73.4911 12.7676 73.4911 13.2512V48.8203C73.4911 49.366 73.1223 49.8304 72.6218 49.9154L36.9061 55.986C36.8526 55.9956 36.799 56 36.7455 56Z" fill="#393536"/>
              <path d="M12.5504 18.3917L23.1989 15.765V29.1432L12.5504 30.2073V18.3917Z" fill="#393536"/>
              <path d="M12.5504 34.3387L23.1989 33.622V52.6626L12.5504 50.6149V34.3387Z" fill="#393536"/>
              <path d="M47.4433 4.65265V41.3205L52.8352 40.4908V6.84969L47.4433 4.65265Z" fill="#393536"/>
              <path d="M61.2253 9.11353V39.7013L65.2969 39.3041V10.8158L61.2253 9.11353Z" fill="#393536"/>
            </svg>
            <div className="text-lg font-bold text-gray-800">
              ADVANCED WAREHOUSE
            </div>
          </div>

          {errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
              {errorMessage}
            </div>
          )}
          
          {isResetPassword ? (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Forgot Your Password?</h2>
              <p className="text-gray-600 mb-8">
                Please enter the email address associated with your account and we will email you a link to reset your
                password.
              </p>

              <form onSubmit={handleSubmitReset(onResetPassword)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="reset-email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input 
                    id="reset-email" 
                    placeholder="m@example.com" 
                    type="email"
                    className="h-12 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                    {...registerReset("email")} 
                  />
                  {resetErrors.email && (
                    <p className="text-sm text-red-500 mt-1">{resetErrors.email.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-12 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-medium"
                >
                  Send Request
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
                  onClick={() => setIsResetPassword(false)}
                >
                  <ChevronLeft className="h-4 w-4" />
                  Back to Sign In
                </Button>
              </form>
            </>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Sign In to AWI - WMS</h2>
              <p className="text-gray-600 mb-8">Enter your email below to login to your account</p>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700">Email</Label>
                  <Input 
                    id="email" 
                    placeholder="m@example.com" 
                    type="email"
                    className="h-9 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                    {...register("email")} 
                  />
                  {errors.email && (
                    <p className="text-sm text-red-500 mt-1">{errors.email.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium text-gray-700">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    className="h-9 border-gray-300 focus:border-orange-400 focus:ring-orange-400"
                    {...register("password")} 
                  />
                  {errors.password && (
                    <p className="text-sm text-red-500 mt-1">{errors.password.message}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full h-9 bg-gradient-to-r from-orange-400 to-amber-500 hover:from-orange-500 hover:to-amber-600 text-white font-medium"
                  disabled={isLoading}
                >
                  {isLoading ? "Logging in..." : "Login"}
                </Button>

                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-9 flex items-center justify-center gap-2 border-gray-300 hover:bg-gray-50"
                >
                  <QrCode className="h-5 w-5" />
                  Scan to Login
                </Button>
              </form>

              <div className="mt-6 text-center">
                <span className="text-gray-500">Forgot your password? </span>
                <Button
                  variant="link"
                  type="button"
                  className="text-orange-500 hover:text-orange-600 font-medium p-0 h-auto"
                  onClick={() => setIsResetPassword(true)}
                >
                  Reset In Trik
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}