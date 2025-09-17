import { useState } from 'react'
import { LoginForm } from '@/components/auth/LoginForm'
import { SignupForm } from '@/components/auth/SignupForm'
import { Leaf } from 'lucide-react'

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true)

  console.log('Auth page rendered, isLogin:', isLogin)

  return (
    <div className="min-h-screen bg-gradient-to-br from-nature-primary/10 to-nature-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-nature-primary to-nature-secondary rounded-full mb-4">
            <Leaf className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-foreground">EcoLearn</h1>
          <p className="text-muted-foreground">Gamified Climate Education Platform</p>
        </div>

        {isLogin ? (
          <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
        ) : (
          <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
        )}
      </div>
    </div>
  )
}

export default Auth