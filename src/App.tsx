import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Toaster } from 'sonner'
import { Device, User, DeviceStatus, StoreLocation } from './lib/types'
import { Auth } from './components/Auth'
import { Dashboard } from './components/Dashboard'
import { DeviceIntake } from './components/DeviceIntake'
import { DeviceDetails } from './components/DeviceDetails'
import { Profile } from './components/Profile'
import { ThemeToggle } from './components/ThemeToggle'
import { Button } from './components/ui/button'
import { Badge } from './components/ui/badge'
import { SquaresFour, Plus, User as UserIcon, SignOut, Storefront } from '@phosphor-icons/react'
import { cn } from './lib/utils'
import { toast } from 'sonner'

type View = 'dashboard' | 'new-intake' | 'device-details' | 'profile'

function App() {
  const [users, setUsers] = useKV<User[]>('users', [])
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [devices, setDevices] = useKV<Device[]>('devices', [])
  const [currentView, setCurrentView] = useState<View>('dashboard')
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [editingDevice, setEditingDevice] = useState<Device | null>(null)

  useEffect(() => {
    const savedUser = localStorage.getItem('current-user')
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser)
        setCurrentUser(user)
      } catch {
        localStorage.removeItem('current-user')
      }
    }
  }, [])

  // Keep a localStorage backup of users so accounts survive dev server restarts
  useEffect(() => {
    if (users && users.length > 0) {
      localStorage.setItem('users-backup', JSON.stringify(users))
    }
  }, [users])

  // Keep a localStorage backup of devices so tickets survive dev server restarts
  useEffect(() => {
    if (devices && devices.length > 0) {
      localStorage.setItem('devices-backup', JSON.stringify(devices))
    }
  }, [devices])

  // When useKV returns empty (server unavailable), fall back to localStorage backup
  const getDeviceList = (currentDevices: Device[] | undefined | null): Device[] => {
    if (currentDevices && currentDevices.length > 0) return currentDevices
    try { return JSON.parse(localStorage.getItem('devices-backup') || '[]') } catch { return [] }
  }

  const allUsers: User[] = (users && users.length > 0)
    ? users
    : (() => {
        try { return JSON.parse(localStorage.getItem('users-backup') || '[]') } catch { return [] }
      })()

  const allDevices: Device[] = (devices && devices.length > 0)
    ? devices
    : (() => {
        try { return JSON.parse(localStorage.getItem('devices-backup') || '[]') } catch { return [] }
      })()

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    localStorage.setItem('current-user', JSON.stringify(user))
    
    setUsers(currentUsers => {
      const userList = currentUsers || []
      const existingIndex = userList.findIndex(u => u.id === user.id)
      if (existingIndex >= 0) {
        return userList
      }
      const updated = [...userList, user]
      localStorage.setItem('users-backup', JSON.stringify(updated))
      return updated
    })
  }

  const handleLogout = () => {
    setCurrentUser(null)
    localStorage.removeItem('current-user')
    setCurrentView('dashboard')
  }

  const handleDeviceSubmit = (device: Device) => {
    setDevices(currentDevices => {
      const deviceList = getDeviceList(currentDevices)
      const existingIndex = deviceList.findIndex(d => d.id === device.id)
      if (existingIndex >= 0) {
        const updated = [...deviceList]
        updated[existingIndex] = device
        return updated
      }
      return [device, ...deviceList]
    })
    setCurrentView('dashboard')
    setEditingDevice(null)
  }

  const handleDeviceClick = (device: Device) => {
    setSelectedDevice(device)
    setCurrentView('device-details')
  }

  const handleEditDevice = (device: Device) => {
    setEditingDevice(device)
    setCurrentView('new-intake')
  }

  const handleUpdateStatus = (deviceId: string, newStatus: DeviceStatus) => {
    setDevices(currentDevices => {
      const deviceList = getDeviceList(currentDevices)
      return deviceList.map(d =>
        d.id === deviceId
          ? { ...d, status: newStatus, updatedAt: new Date().toISOString() }
          : d
      )
    })
    setSelectedDevice(current =>
      current?.id === deviceId
        ? { ...current, status: newStatus, updatedAt: new Date().toISOString() }
        : current
    )
  }

  const handleAddNote = (deviceId: string, noteText: string) => {
    if (!currentUser) return

    const newNote = {
      id: Date.now().toString(),
      technicianName: currentUser.fullName,
      technicianId: currentUser.id,
      note: noteText,
      createdAt: new Date().toISOString()
    }

    setDevices(currentDevices => {
      const deviceList = getDeviceList(currentDevices)
      return deviceList.map(d =>
        d.id === deviceId
          ? { 
              ...d, 
              technicianNotes: [...(d.technicianNotes || []), newNote],
              updatedAt: new Date().toISOString() 
            }
          : d
      )
    })

    setSelectedDevice(current =>
      current?.id === deviceId
        ? { 
            ...current, 
            technicianNotes: [...(current.technicianNotes || []), newNote],
            updatedAt: new Date().toISOString() 
          }
        : current
    )
  }

  const handleEditNote = (deviceId: string, noteId: string, updatedNote: string) => {
    setDevices(currentDevices => {
      const deviceList = getDeviceList(currentDevices)
      return deviceList.map(d =>
        d.id === deviceId
          ? { 
              ...d, 
              technicianNotes: (d.technicianNotes || []).map(note =>
                note.id === noteId
                  ? { ...note, note: updatedNote }
                  : note
              ),
              updatedAt: new Date().toISOString() 
            }
          : d
      )
    })

    setSelectedDevice(current =>
      current?.id === deviceId
        ? { 
            ...current, 
            technicianNotes: (current.technicianNotes || []).map(note =>
              note.id === noteId
                ? { ...note, note: updatedNote }
                : note
            ),
            updatedAt: new Date().toISOString() 
          }
        : current
    )
  }

  const handleAddPhotos = (deviceId: string, photos: string[]) => {
    setDevices(currentDevices => {
      const deviceList = getDeviceList(currentDevices)
      return deviceList.map(d =>
        d.id === deviceId
          ? { ...d, photos, updatedAt: new Date().toISOString() }
          : d
      )
    })
    setSelectedDevice(current =>
      current?.id === deviceId
        ? { ...current, photos, updatedAt: new Date().toISOString() }
        : current
    )
  }

  const handleUpdateParts = (deviceId: string, parts: import('./lib/types').DevicePart[]) => {
    setDevices(currentDevices => {
      const deviceList = getDeviceList(currentDevices)
      return deviceList.map(d =>
        d.id === deviceId
          ? { ...d, partsUsed: parts, updatedAt: new Date().toISOString() }
          : d
      )
    })
    setSelectedDevice(current =>
      current?.id === deviceId
        ? { ...current, partsUsed: parts, updatedAt: new Date().toISOString() }
        : current
    )
  }

  const handleDeleteDevice = (deviceId: string) => {
    setDevices(currentDevices => {
      const deviceList = getDeviceList(currentDevices)
      return deviceList.filter(d => d.id !== deviceId)
    })
    setCurrentView('dashboard')
    setSelectedDevice(null)
    toast.success('Device deleted successfully')
  }

  const handleBackToDashboard = () => {
    setCurrentView('dashboard')
    setSelectedDevice(null)
    setEditingDevice(null)
  }

  const handleUpdateStoreLocation = (storeLocation: StoreLocation) => {
    if (!currentUser) return
    
    const updatedUser = { ...currentUser, storeLocation }
    setCurrentUser(updatedUser)
    localStorage.setItem('current-user', JSON.stringify(updatedUser))
    
    setUsers(currentUsers => {
      const userList = currentUsers || []
      return userList.map(u => 
        u.id === currentUser.id ? updatedUser : u
      )
    })
  }

  if (!currentUser) {
    return (
      <>
        <Auth onLogin={handleLogin} existingUsers={allUsers} />
        <Toaster position="top-right" />
      </>
    )
  }

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <Dashboard
            devices={allDevices}
            currentUser={currentUser}
            onDeviceClick={handleDeviceClick}
          />
        )
      case 'new-intake':
        return (
          <DeviceIntake
            currentUser={currentUser}
            onSubmit={handleDeviceSubmit}
            onCancel={handleBackToDashboard}
            existingDevice={editingDevice || undefined}
          />
        )
      case 'device-details':
        return selectedDevice ? (
          <DeviceDetails
            device={selectedDevice}
            onBack={handleBackToDashboard}
            onEdit={handleEditDevice}
            onDelete={handleDeleteDevice}
            onUpdateStatus={handleUpdateStatus}
            onAddNote={handleAddNote}
            onEditNote={handleEditNote}
            onAddPhotos={handleAddPhotos}
            onUpdateParts={handleUpdateParts}
            currentUserName={currentUser.fullName}
            currentUserId={currentUser.id}
          />
        ) : null
      case 'profile':
        return <Profile user={currentUser} onUpdateStoreLocation={handleUpdateStoreLocation} />
      default:
        return null
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-foreground rounded-sm flex-shrink-0">
                  <div className="absolute inset-[3px] bg-accent rounded-sm"></div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Plus size={24} weight="bold" className="text-background sm:w-7 sm:h-7" />
                  </div>
                </div>
                <div className="flex flex-col">
                  <div className="font-bold text-base sm:text-lg leading-none tracking-tight text-foreground">
                    The Phone Doctors
                  </div>
                  <div className="text-[10px] sm:text-xs font-medium text-muted-foreground tracking-wide mt-0.5">
                    REFURB TECH
                  </div>
                </div>
              </div>
              <Badge variant="outline" className="hidden sm:flex items-center gap-1.5 border-accent/30 text-accent">
                <Storefront size={14} weight="duotone" />
                {currentUser.storeLocation}
              </Badge>
            </div>

            <nav className="hidden md:flex items-center gap-2">
              <Button
                variant={currentView === 'dashboard' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('dashboard')}
                className={cn(
                  currentView === 'dashboard' && 'bg-primary text-primary-foreground'
                )}
              >
                <SquaresFour className="mr-2" size={18} />
                Dashboard
              </Button>
              <Button
                variant="ghost"
                onClick={() => {
                  setEditingDevice(null)
                  setCurrentView('new-intake')
                }}
                className="text-accent hover:text-accent hover:bg-accent/10"
              >
                <Plus className="mr-2" size={18} weight="bold" />
                New Intake
              </Button>
              <Button
                variant={currentView === 'profile' ? 'default' : 'ghost'}
                onClick={() => setCurrentView('profile')}
                className={cn(
                  currentView === 'profile' && 'bg-primary text-primary-foreground'
                )}
              >
                <UserIcon className="mr-2" size={18} />
                Profile
              </Button>
            </nav>

            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button variant="outline" onClick={handleLogout} className="shrink-0">
                <SignOut className="mr-2" size={18} />
                <span className="hidden sm:inline">Sign Out</span>
              </Button>
            </div>
          </div>

          <div className="md:hidden flex items-center gap-2 pb-3 overflow-x-auto">
            <Button
              size="sm"
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('dashboard')}
              className={cn(
                'shrink-0',
                currentView === 'dashboard' && 'bg-primary text-primary-foreground'
              )}
            >
              <SquaresFour className="mr-1.5" size={16} />
              Dashboard
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => {
                setEditingDevice(null)
                setCurrentView('new-intake')
              }}
              className="shrink-0 text-accent hover:text-accent hover:bg-accent/10"
            >
              <Plus className="mr-1.5" size={16} weight="bold" />
              New Intake
            </Button>
            <Button
              size="sm"
              variant={currentView === 'profile' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('profile')}
              className={cn(
                'shrink-0',
                currentView === 'profile' && 'bg-primary text-primary-foreground'
              )}
            >
              <UserIcon className="mr-1.5" size={16} />
              Profile
            </Button>
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {renderView()}
      </main>

      <footer className="border-t py-6 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} RefurbTech by The Phone Doctors. Professional Device Refurbishing Management.</p>
        </div>
      </footer>

      <Toaster position="top-right" />
    </div>
  )
}

export default App
