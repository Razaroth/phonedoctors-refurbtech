import { useState } from 'react'
import { Device, DeviceType, User } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { CaretLeft, CaretRight, CheckCircle, Camera, X } from '@phosphor-icons/react'
import { generateId, compressImage } from '@/lib/helpers'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'

interface DeviceIntakeProps {
  currentUser: User
  onSubmit: (device: Device) => void
  onCancel: () => void
  existingDevice?: Device
}

const repairOptions = [
  'Screen Replacement',
  'Battery Replacement',
  'Camera Repair',
  'Speaker Repair',
  'Microphone Repair',
  'Charging Port Repair',
  'Water Damage Repair',
  'Software Issues',
  'Data Recovery',
  'Back Cover Replacement',
  'Button Repair',
  'Other'
]

export function DeviceIntake({ currentUser, onSubmit, onCancel, existingDevice }: DeviceIntakeProps) {
  const [currentStep, setCurrentStep] = useState(1)
  const [deviceType, setDeviceType] = useState<DeviceType>(existingDevice?.type || 'mobile')
  const [brand, setBrand] = useState(existingDevice?.brand || '')
  const [model, setModel] = useState(existingDevice?.model || '')
  const [serialNumber, setSerialNumber] = useState(existingDevice?.serialNumber || '')
  const [imei, setImei] = useState(existingDevice?.imei || '')
  const [condition, setCondition] = useState(existingDevice?.condition || '')
  const [issuesReported, setIssuesReported] = useState(existingDevice?.issuesReported || '')
  const [repairsNeeded, setRepairsNeeded] = useState<string[]>(existingDevice?.repairsNeeded || [])
  const [customerName, setCustomerName] = useState(existingDevice?.customerName || '')
  const [customerContact, setCustomerContact] = useState(existingDevice?.customerContact || '')
  const [notes, setNotes] = useState(existingDevice?.notes || '')
  const [photos, setPhotos] = useState<string[]>(existingDevice?.photos || [])

  const totalSteps = 5

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))
    files.forEach(file => {
      compressImage(file).then(compressed => {
        setPhotos(prev => [...prev, compressed])
      })
    })
    e.target.value = ''
  }

  const handleRemovePhoto = (index: number) => {
    setPhotos(prev => prev.filter((_, i) => i !== index))
  }

  const handleRepairToggle = (repair: string) => {
    if (repairsNeeded.includes(repair)) {
      setRepairsNeeded(repairsNeeded.filter(r => r !== repair))
    } else {
      setRepairsNeeded([...repairsNeeded, repair])
    }
  }

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return !!deviceType
      case 2:
        return brand && model
      case 3:
        return condition && issuesReported
      case 4:
        return repairsNeeded.length > 0
      case 5:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (canProceed() && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleSubmit = () => {
    if (!canProceed()) return

    const device: Device = {
      id: existingDevice?.id || generateId(),
      type: deviceType,
      brand,
      model,
      serialNumber,
      imei,
      status: existingDevice?.status || 'intake',
      condition,
      issuesReported,
      repairsNeeded,
      customerName,
      customerContact,
      technicianId: existingDevice?.technicianId || currentUser.id,
      technicianName: existingDevice?.technicianName || currentUser.fullName,
      storeLocation: existingDevice?.storeLocation || currentUser.storeLocation,
      partsUsed: existingDevice?.partsUsed || [],
      notes,
      photos,
      technicianNotes: existingDevice?.technicianNotes || [],
      createdAt: existingDevice?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    onSubmit(device)
    toast.success(existingDevice ? 'Device updated successfully!' : 'Device intake completed!')
  }

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="device-type">Device Type *</Label>
              <Select value={deviceType} onValueChange={(value) => setDeviceType(value as DeviceType)}>
                <SelectTrigger id="device-type" className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile">Mobile Phone</SelectItem>
                  <SelectItem value="tablet">Tablet</SelectItem>
                  <SelectItem value="laptop">Laptop</SelectItem>
                  <SelectItem value="desktop">Desktop Computer</SelectItem>
                  <SelectItem value="other">Other Device</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="e.g., Apple, Samsung, HP"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={model}
                onChange={(e) => setModel(e.target.value)}
                placeholder="e.g., iPhone 13 Pro, Galaxy S21"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="serial-number">Serial Number</Label>
              <Input
                id="serial-number"
                value={serialNumber}
                onChange={(e) => setSerialNumber(e.target.value)}
                placeholder="Device serial number"
                className="mt-2 font-mono"
              />
            </div>
            {(deviceType === 'mobile' || deviceType === 'tablet') && (
              <div>
                <Label htmlFor="imei">IMEI Number</Label>
                <Input
                  id="imei"
                  value={imei}
                  onChange={(e) => setImei(e.target.value)}
                  placeholder="IMEI number"
                  className="mt-2 font-mono"
                />
              </div>
            )}
          </div>
        )

      case 3:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="condition">Overall Condition *</Label>
              <Select value={condition} onValueChange={setCondition}>
                <SelectTrigger id="condition" className="mt-2">
                  <SelectValue placeholder="Select condition" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="excellent">Excellent - Minor wear</SelectItem>
                  <SelectItem value="good">Good - Normal wear</SelectItem>
                  <SelectItem value="fair">Fair - Significant wear</SelectItem>
                  <SelectItem value="poor">Poor - Heavy damage</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="issues">Issues Reported *</Label>
              <Textarea
                id="issues"
                value={issuesReported}
                onChange={(e) => setIssuesReported(e.target.value)}
                placeholder="Describe all visible issues and problems reported by customer"
                className="mt-2 min-h-[120px]"
              />
            </div>
            <div>
              <Label>Device Photos</Label>
              <p className="text-sm text-muted-foreground mt-1 mb-3">
                Attach photos documenting the device condition
              </p>
              {photos.length > 0 && (
                <div className="grid grid-cols-3 gap-2 mb-3">
                  {photos.map((src, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={src}
                        alt={`Device photo ${i + 1}`}
                        className="w-full h-24 object-cover rounded-md border"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(i)}
                        className="absolute top-1 right-1 bg-background/80 rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <label className="flex items-center gap-2 cursor-pointer w-fit border rounded-md px-4 py-2 text-sm hover:bg-muted transition-colors">
                <Camera size={18} />
                Add Photos
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="sr-only"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-4">
            <div>
              <Label>Repairs Needed *</Label>
              <p className="text-sm text-muted-foreground mt-1 mb-4">
                Select all repairs required for this device
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {repairOptions.map(repair => (
                  <div key={repair} className="flex items-center space-x-2">
                    <Checkbox
                      id={`repair-${repair}`}
                      checked={repairsNeeded.includes(repair)}
                      onCheckedChange={() => handleRepairToggle(repair)}
                    />
                    <Label
                      htmlFor={`repair-${repair}`}
                      className="text-sm font-normal cursor-pointer"
                    >
                      {repair}
                    </Label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer-name">Customer Name</Label>
              <Input
                id="customer-name"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Customer full name"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="customer-contact">Customer Contact</Label>
              <Input
                id="customer-contact"
                value={customerContact}
                onChange={(e) => setCustomerContact(e.target.value)}
                placeholder="Phone number or email"
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any additional information or special instructions"
                className="mt-2 min-h-[100px]"
              />
            </div>
          </div>
        )

      default:
        return null
    }
  }

  const getStepTitle = () => {
    const titles = [
      'Device Type',
      'Device Information',
      'Condition Assessment',
      'Repairs Needed',
      'Customer Information'
    ]
    return titles[currentStep - 1]
  }

  const getStepDescription = () => {
    const descriptions = [
      'Select the type of device being refurbished',
      'Enter the device brand, model, and identification numbers',
      'Assess the physical condition and document issues',
      'Select all necessary repairs for this device',
      'Record customer contact details and notes'
    ]
    return descriptions[currentStep - 1]
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between mb-4">
            <CardTitle className="text-2xl">
              {existingDevice ? 'Edit Device' : 'New Device Intake'}
            </CardTitle>
            <div className="text-sm font-medium text-muted-foreground">
              Step {currentStep} of {totalSteps}
            </div>
          </div>
          
          <div className="flex gap-2 mb-4">
            {Array.from({ length: totalSteps }).map((_, index) => (
              <div
                key={index}
                className={`h-2 flex-1 rounded-full transition-colors ${
                  index < currentStep ? 'bg-accent' : 'bg-muted'
                }`}
              />
            ))}
          </div>

          <CardTitle className="text-xl">{getStepTitle()}</CardTitle>
          <CardDescription>{getStepDescription()}</CardDescription>
        </CardHeader>

        <CardContent>
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>

          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {currentStep > 1 ? (
                <Button variant="outline" onClick={handleBack}>
                  <CaretLeft className="mr-2" size={16} />
                  Back
                </Button>
              ) : (
                <Button variant="outline" onClick={onCancel}>
                  Cancel
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceed()}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  Next
                  <CaretRight className="ml-2" size={16} />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canProceed()}
                  className="bg-accent hover:bg-accent/90 text-accent-foreground"
                >
                  <CheckCircle className="mr-2" size={18} weight="bold" />
                  {existingDevice ? 'Update Device' : 'Complete Intake'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
