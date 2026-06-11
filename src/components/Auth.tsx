import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus } from '@phosphor-icons/react'
import { toast } from 'sonner'
import { User, StoreLocation } from '@/lib/types'
import { createUser, STORE_LOCATIONS } from '@/lib/helpers'

interface AuthProps {
  onLogin: (user: User) => void
  existingUsers: User[]
}

export function Auth({ onLogin, existingUsers }: AuthProps) {
  const [loginUsername, setLoginUsername] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [regUsername, setRegUsername] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [regFullName, setRegFullName] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regStoreLocation, setRegStoreLocation] = useState<StoreLocation | ''>('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    
    const user = existingUsers.find(u => u.username === loginUsername)
    
    if (user) {
      onLogin(user)
      toast.success(`Welcome back, ${user.fullName}!`)
    } else {
      toast.error('Invalid username or password')
    }
  }

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (existingUsers.some(u => u.username === regUsername)) {
      toast.error('Username already exists')
      return
    }
    
    if (!regUsername || !regFullName || !regEmail || !regStoreLocation) {
      toast.error('Please fill in all fields')
      return
    }
    
    const newUser = createUser(regUsername, regFullName, regEmail, regStoreLocation as StoreLocation)
    onLogin(newUser)
    toast.success(`Account created! Welcome, ${newUser.fullName}!`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-accent/10 to-black p-4">
      <Card className="w-full max-w-md border-2">
        <CardHeader className="text-center space-y-2">
          <div className="flex justify-center mb-4">
            <div className="relative w-16 h-16 bg-foreground rounded-sm">
              <div className="absolute inset-[4px] bg-accent rounded-sm"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <Plus size={36} weight="bold" className="text-background" />
              </div>
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">RefurbTech</CardTitle>
          <CardDescription className="text-base">
            Device Refurbishing Management System
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="register">Register</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="login-username">Username</Label>
                  <Input
                    id="login-username"
                    type="text"
                    value={loginUsername}
                    onChange={(e) => setLoginUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="login-password">Password</Label>
                  <Input
                    id="login-password"
                    type="password"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Sign In
                </Button>
              </form>
            </TabsContent>
            
            <TabsContent value="register">
              <form onSubmit={handleRegister} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="reg-username">Username</Label>
                  <Input
                    id="reg-username"
                    type="text"
                    value={regUsername}
                    onChange={(e) => setRegUsername(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-fullname">Full Name</Label>
                  <Input
                    id="reg-fullname"
                    type="text"
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-email">Email</Label>
                  <Input
                    id="reg-email"
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-store-location">Store Location</Label>
                  <Select value={regStoreLocation} onValueChange={(value) => setRegStoreLocation(value as StoreLocation)}>
                    <SelectTrigger id="reg-store-location">
                      <SelectValue placeholder="Select your store location" />
                    </SelectTrigger>
                    <SelectContent>
                      {STORE_LOCATIONS.map(location => (
                        <SelectItem key={location} value={location}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="reg-password">Password</Label>
                  <Input
                    id="reg-password"
                    type="password"
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                  />
                </div>
                <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold">
                  Create Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
