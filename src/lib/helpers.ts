import { User, StoreLocation } from './types'

export const STORE_LOCATIONS: StoreLocation[] = [
  'Edmond',
  'Memorial',
  'Norman',
  'E. 41st St.',
  'Broken Arrow',
  'Owasso',
  'Jenks',
  'Bixby',
  'Fayetteville',
  'Fort Smith'
]

export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
}

export const formatDate = (date: string): string => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  })
}

export const formatDateTime = (date: string): string => {
  return new Date(date).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export const getStatusLabel = (status: string): string => {
  const labels: Record<string, string> = {
    'intake': 'Intake',
    'diagnosis': 'Diagnosis',
    'parts-ordered': 'Parts Ordered',
    'in-repair': 'In Repair',
    'testing': 'Testing',
    'complete': 'Complete',
    'ready-for-sale': 'Ready for Sale',
  }
  return labels[status] || status
}

export const getStatusVariant = (status: string): 'default' | 'secondary' | 'destructive' | 'outline' => {
  const variants: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
    'intake': 'secondary',
    'diagnosis': 'outline',
    'parts-ordered': 'outline',
    'in-repair': 'default',
    'testing': 'default',
    'complete': 'default',
    'ready-for-sale': 'default',
  }
  return variants[status] || 'secondary'
}

export const getDeviceTypeLabel = (type: string): string => {
  const labels: Record<string, string> = {
    'mobile': 'Mobile Phone',
    'tablet': 'Tablet',
    'laptop': 'Laptop',
    'desktop': 'Desktop Computer',
    'other': 'Other Device',
  }
  return labels[type] || type
}

export const compressImage = (file: File, maxPx = 1280, quality = 0.8): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image()
    const url = URL.createObjectURL(file)
    img.onload = () => {
      URL.revokeObjectURL(url)
      let { width, height } = img
      if (width > maxPx || height > maxPx) {
        if (width >= height) {
          height = Math.round((height / width) * maxPx)
          width = maxPx
        } else {
          width = Math.round((width / height) * maxPx)
          height = maxPx
        }
      }
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      if (!ctx) { reject(new Error('Canvas not supported')); return }
      ctx.drawImage(img, 0, 0, width, height)
      resolve(canvas.toDataURL('image/jpeg', quality))
    }
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error('Failed to load image')) }
    img.src = url
  })
}

export const createUser = (username: string, fullName: string, email: string, storeLocation: StoreLocation, role: string = 'Technician'): User => {
  return {
    id: generateId(),
    username,
    fullName,
    email,
    role,
    storeLocation,
    createdAt: new Date().toISOString(),
  }
}
