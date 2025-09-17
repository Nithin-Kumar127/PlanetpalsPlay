import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useNavigate } from 'react-router-dom'
import { User, LogOut, Award, Leaf, Gamepad2, Trophy, Globe } from 'lucide-react'

export const Header = () => {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/auth')
  }

  const getUserInitials = (email: string) => {
    return email.substring(0, 2).toUpperCase()
  }

  return (
    <header className="bg-white border-b border-border sticky top-0 z-40">
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-gradient-to-br from-nature-primary to-nature-secondary rounded-full flex items-center justify-center">
              <Leaf className="h-4 w-4 text-white" />
            </div>
            <h1 className="text-xl font-bold text-foreground">EcoLearn</h1>
          </div>

          {user && (
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                onClick={() => navigate('/games')}
                className="hidden sm:flex"
              >
                <Gamepad2 className="h-4 w-4 mr-2" />
                Games
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate('/climate-simulator')}
                className="hidden sm:flex"
              >
                <Globe className="h-4 w-4 mr-2" />
                Simulator
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate('/achievements')}
                className="hidden sm:flex"
              >
                <Award className="h-4 w-4 mr-2" />
                Achievements
              </Button>

              <Button
                variant="ghost"
                onClick={() => navigate('/leaderboard')}
                className="hidden sm:flex"
              >
                <Trophy className="h-4 w-4 mr-2" />
                Leaderboard
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarFallback className="bg-nature-primary text-white text-xs">
                        {getUserInitials(user.email || '')}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.user_metadata?.name || 'Climate Learner'}</p>
                      <p className="w-[200px] truncate text-sm text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <DropdownMenuItem onClick={() => navigate('/profile')}>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/games')}>
                    <Gamepad2 className="mr-2 h-4 w-4" />
                    Games
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/climate-simulator')}>
                    <Globe className="mr-2 h-4 w-4" />
                    Climate Simulator
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/achievements')}>
                    <Award className="mr-2 h-4 w-4" />
                    Achievements
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/leaderboard')}>
                    <Trophy className="mr-2 h-4 w-4" />
                    Leaderboard
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
        </div>
      </div>
    </header>
  )
}