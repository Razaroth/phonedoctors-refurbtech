import { useState } from 'react'
import { Device, User } from '@/lib/types'
import { DeviceCard } from '@/components/DeviceCard'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { MagnifyingGlass } from '@phosphor-icons/react'
import { Card, CardContent } from '@/components/ui/card'

interface DashboardProps {
  devices: Device[]
  currentUser: User
  onDeviceClick: (device: Device) => void
}

export function Dashboard({ devices, currentUser, onDeviceClick }: DashboardProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')

  const filteredDevices = devices.filter(device => {
    const matchesStore = device.storeLocation === currentUser.storeLocation

    const matchesSearch = 
      device.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.serialNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      device.technicianName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus = statusFilter === 'all' || device.status === statusFilter

    return matchesStore && matchesSearch && matchesStatus
  })

  const sortedDevices = [...filteredDevices].sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight mb-2">Device Dashboard</h1>
        <p className="text-muted-foreground">Manage and track all devices in the refurbishing pipeline</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <MagnifyingGlass className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={20} />
          <Input
            id="search-devices"
            placeholder="Search devices, serial numbers, technicians..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger id="status-filter" className="w-full sm:w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="intake">Intake</SelectItem>
            <SelectItem value="diagnosis">Diagnosis</SelectItem>
            <SelectItem value="parts-ordered">Parts Ordered</SelectItem>
            <SelectItem value="in-repair">In Repair</SelectItem>
            <SelectItem value="testing">Testing</SelectItem>
            <SelectItem value="complete">Complete</SelectItem>
            <SelectItem value="ready-for-sale">Ready for Sale</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {sortedDevices.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-16 text-center">
            <p className="text-lg font-medium text-muted-foreground mb-2">
              {searchTerm || statusFilter !== 'all' ? 'No devices match your filters' : `No devices at ${currentUser.storeLocation} yet`}
            </p>
            <p className="text-sm text-muted-foreground">
              {searchTerm || statusFilter !== 'all' 
                ? 'Try adjusting your search or filters' 
                : 'Start by creating a new device intake'}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {sortedDevices.map(device => (
            <DeviceCard
              key={device.id}
              device={device}
              onClick={() => onDeviceClick(device)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
