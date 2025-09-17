import { useAuth } from '@/contexts/AuthContext'
import { Navigate, useLocation } from 'react-router-dom'
import { Loader2 } from 'lucide-react'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading } = useAuth()
  const location = useLocation()

  console.log('ProtectedRoute - User:', user?.email, 'Loading:', loading, 'Path:', location.pathname)

  if (loading) {
    console.log('ProtectedRoute: Showing loading spinner')
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-nature-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    console.log('ProtectedRoute: No user, redirecting to auth')
    return <Navigate to="/auth" state={{ from: location }} replace />
  }

  console.log('ProtectedRoute: User authenticated, rendering children')
  return <>{children}</>
}