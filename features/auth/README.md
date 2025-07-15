# Authentication Feature

This directory contains all authentication-related code, organized into a clean feature-based architecture.

## Structure

```
features/auth/
├── components/          # UI components
│   ├── AuthHero.tsx    # Hero section with branding
│   ├── ErrorAlert.tsx  # Error display component
│   ├── LoginForm.tsx   # Login form component
│   ├── MobileLogo.tsx  # Mobile logo component
│   ├── ResetPasswordForm.tsx # Password reset form
│   └── index.ts        # Component exports
├── hooks/              # Custom hooks
│   ├── useAuthRedirect.ts # Handles automatic redirect for logged-in users
│   ├── useLogin.ts     # Login logic and state management
│   ├── useResetPassword.ts # Password reset logic
│   └── index.ts        # Hook exports
├── types/              # TypeScript types
│   └── auth.types.ts   # API and form types
├── utils/              # Utility functions
│   └── auth.utils.ts   # Authentication helper functions
├── validation/         # Form validation
│   └── auth.validation.ts # Zod schemas for forms
└── index.ts           # Main feature exports
```

## Key Features

### API Compliance
- Handles the correct API response format with `statusCode: 0` for success
- Properly parses validation errors from the API response
- Supports the full login response schema including user details, tokens, and permissions

### Security Features
- Input validation and sanitization
- Proper form handling with React Hook Form and Zod
- Encrypted message transmission using RSA
- Secure password visibility toggle
- Form security attributes (noValidate, autoComplete, etc.)

### Error Handling
- Comprehensive error handling for different API response types
- User-friendly error messages
- Validation error parsing and display
- Network error handling

### User Experience
- Clean, modern UI consistent with the application design
- Loading states and proper feedback
- Accessibility features (ARIA labels, roles, etc.)
- Responsive design for mobile and desktop
- Smooth transitions and redirects

## Usage

```tsx
import { 
  useLogin, 
  LoginForm, 
  type LoginFormValues 
} from "@/features/auth"

// In your component
const { login, isLoading, error } = useLogin()

const handleLogin = async (data: LoginFormValues) => {
  await login(data)
}

return (
  <LoginForm 
    onSubmit={handleLogin}
    isLoading={isLoading}
    onForgotPassword={() => setIsResetPassword(true)}
  />
)
```

## API Schema

The feature is designed to work with the following API response formats:

### Success Response
```json
{
  "statusCode": 0,
  "response": {
    "id": "string",
    "customerId": "string", 
    "firstName": "string",
    "lastName": "string",
    "userName": "string",
    "email": "string",
    "role": "string",
    "roleId": "string",
    "token": "string",
    "refreshToken": "string",
    "expiresInMinutes": 0,
    "changePasswordOnLogin": true,
    "roleClaims": ["string"],
    "expiryDate": "2025-07-15T08:31:01.482Z",
    "securityStamp": "string",
    "warehouseIds": [{"id": "string"}]
  },
  "traceId": "string",
  "message": "string"
}
```

### Error Response
```json
{
  "statusCode": 0,
  "response": {
    "message": "string",
    "validationFailed": true,
    "validationErrors": [
      {
        "key": "string",
        "value": "string"
      }
    ]
  },
  "traceId": "string", 
  "message": "string"
}
```
