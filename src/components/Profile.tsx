import { useState } from 'react'
import { User, StoreLocation } from '@/lib/types'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { formatDate } from '@/lib/helpers'
import { STORE_LOCATIONS } from '@/lib/helpers'
import { Storefront, Check } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface ProfileProps {
  user: User
  onUpdateStoreLocation?: (storeLocation: StoreLocation) => void
}

export function Profile({ user, onUpdateStoreLocation }: ProfileProps) {
  const [isEditingLocation, setIsEditingLocation] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<StoreLocation>(user.storeLocation)

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  const handleSaveLocation = () => {
    if (onUpdateStoreLocation && selectedLocation !== user.storeLocation) {
      onUpdateStoreLocation(selectedLocation)
      toast.success('Store location updated successfully')
    }
    setIsEditingLocation(false)
  }

  const handleCancelEdit = () => {
    setSelectedLocation(user.storeLocation)
    setIsEditingLocation(false)
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Profile</h1>
        <p className="text-muted-foreground">View and manage your account information</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-6">
            <Avatar className="w-20 h-20 border-2 border-accent">
              <AvatarFallback className="bg-accent text-accent-foreground text-2xl font-bold">
                {getInitials(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl mb-2">{user.fullName}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <span>@{user.username}</span>
                <span>•</span>
                <Badge variant="secondary">{user.role}</Badge>
              </CardDescription>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Email</h3>
              <p className="font-medium">{user.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Username</h3>
              <p className="font-medium">@{user.username}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Role</h3>
              <p className="font-medium">{user.role}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-muted-foreground mb-2">Member Since</h3>
              <p className="font-medium">{formatDate(user.createdAt)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="border-accent/20">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Storefront size={24} weight="duotone" className="text-accent" />
            <div>
              <CardTitle className="text-lg">Store Location</CardTitle>
              <CardDescription>Manage which store location this account represents</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isEditingLocation ? (
            <div className="flex items-center justify-between">
              <div>
                <Label className="text-muted-foreground">Current Location</Label>
                <p className="text-2xl font-bold text-accent mt-1">{user.storeLocation}</p>
              </div>
              <Button onClick={() => setIsEditingLocation(true)} variant="outline">
                Change Location
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="store-location-select">Select New Location</Label>
                <Select value={selectedLocation} onValueChange={(value) => setSelectedLocation(value as StoreLocation)}>
                  <SelectTrigger id="store-location-select">
                    <SelectValue />
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
              <div className="flex gap-2">
                <Button onClick={handleSaveLocation} className="bg-accent hover:bg-accent/90">
                  <Check className="mr-2" size={18} weight="bold" />
                  Save Changes
                </Button>
                <Button onClick={handleCancelEdit} variant="outline">
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="bg-muted/50">
        <CardHeader>
          <CardTitle className="text-lg">About RefurbTech</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            RefurbTech is a comprehensive device refurbishing management system designed to help technicians
            efficiently track devices through the repair pipeline, manage parts pricing, and maintain detailed
            records of all refurbishing work across multiple store locations.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
