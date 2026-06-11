import { Device } from '@/lib/types'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { DeviceMobile, Laptop, Desktop, DeviceTablet, Devices, Note } from '@phosphor-icons/react'
import { formatDate, getStatusLabel, getStatusVariant, getDeviceTypeLabel } from '@/lib/helpers'
import { motion } from 'framer-motion'

interface DeviceCardProps {
  device: Device
  onClick: () => void
}

export function DeviceCard({ device, onClick }: DeviceCardProps) {
  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile':
        return <DeviceMobile size={32} weight="bold" />
      case 'tablet':
        return <DeviceTablet size={32} weight="bold" />
      case 'laptop':
        return <Laptop size={32} weight="bold" />
      case 'desktop':
        return <Desktop size={32} weight="bold" />
      default:
        return <Devices size={32} weight="bold" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'complete':
      case 'ready-for-sale':
        return 'text-success'
      case 'in-repair':
      case 'testing':
        return 'text-warning'
      case 'intake':
      case 'diagnosis':
        return 'text-muted-foreground'
      default:
        return 'text-foreground'
    }
  }

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Card
        className="cursor-pointer hover:border-accent transition-colors group"
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className={`${getStatusColor(device.status)} transition-colors`}>
              {getDeviceIcon(device.type)}
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <h3 className="font-semibold text-lg leading-tight truncate">
                    {device.brand} {device.model}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {getDeviceTypeLabel(device.type)}
                  </p>
                </div>
                <Badge variant={getStatusVariant(device.status)} className="shrink-0">
                  {getStatusLabel(device.status)}
                </Badge>
              </div>
              
              {device.serialNumber && (
                <p className="text-sm font-mono text-muted-foreground truncate">
                  SN: {device.serialNumber}
                </p>
              )}
              
              {device.technicianNotes && device.technicianNotes.length > 0 && (
                <div className="pt-2 border-t">
                  <div className="flex items-start gap-2 text-sm">
                    <Note size={16} weight="fill" className="text-accent shrink-0 mt-0.5" />
                    <div className="flex-1 min-w-0">
                      <p className="text-muted-foreground line-clamp-2 leading-relaxed">
                        {device.technicianNotes[device.technicianNotes.length - 1].note}
                      </p>
                      <p className="text-xs text-muted-foreground/70 mt-1">
                        {device.technicianNotes[device.technicianNotes.length - 1].technicianName} · {formatDate(device.technicianNotes[device.technicianNotes.length - 1].createdAt)}
                      </p>
                    </div>
                  </div>
                  {device.technicianNotes.length > 1 && (
                    <p className="text-xs text-accent/80 mt-1.5 font-medium">
                      +{device.technicianNotes.length - 1} more {device.technicianNotes.length === 2 ? 'note' : 'notes'}
                    </p>
                  )}
                </div>
              )}
              
              <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                <span>{device.technicianName}</span>
                <div className="flex items-center gap-3">
                  {device.purchasePrice !== undefined && device.marketValue !== undefined && (() => {
                    const partsCost = (device.partsUsed || []).reduce((sum, p) => sum + ((p.pricePerUnit || 0) * p.quantity), 0)
                    const profit = device.marketValue - device.purchasePrice - partsCost
                    return (
                      <span className={`font-medium ${profit >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                        Potential Profit: {profit >= 0 ? '+' : ''}${profit.toFixed(2)}
                      </span>
                    )
                  })()}
                  <span>{formatDate(device.createdAt)}</span>
                </div>
              </div>

              {device.photos && device.photos.length > 0 && (
                <div className="flex gap-1.5 pt-2">
                  {device.photos.slice(0, 4).map((src, i) => (
                    <div key={i} className="relative">
                      <img
                        src={src}
                        alt={`Photo ${i + 1}`}
                        className="w-12 h-12 object-cover rounded-md border"
                      />
                      {i === 3 && device.photos!.length > 4 && (
                        <div className="absolute inset-0 bg-black/60 rounded-md flex items-center justify-center">
                          <span className="text-white text-xs font-semibold">+{device.photos!.length - 4}</span>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
