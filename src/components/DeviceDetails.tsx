import { Device, DeviceStatus, TechnicianNote } from '@/lib/types'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { ArrowLeft, Pencil, Plus, Check, X, Trash, Camera } from '@phosphor-icons/react'
import { formatDateTime, getStatusLabel, getStatusVariant, getDeviceTypeLabel, compressImage } from '@/lib/helpers'
import { useState } from 'react'
import { toast } from 'sonner'

interface DeviceDetailsProps {
  device: Device
  onBack: () => void
  onEdit: (device: Device) => void
  onDelete: (deviceId: string) => void
  onUpdateStatus: (deviceId: string, newStatus: DeviceStatus) => void
  onAddNote: (deviceId: string, note: string) => void
  onEditNote: (deviceId: string, noteId: string, updatedNote: string) => void
  onAddPhotos: (deviceId: string, photos: string[]) => void
  currentUserName: string
  currentUserId: string
}

export function DeviceDetails({ device, onBack, onEdit, onDelete, onUpdateStatus, onAddNote, onEditNote, onAddPhotos, currentUserName, currentUserId }: DeviceDetailsProps) {
  const [status, setStatus] = useState<DeviceStatus>(device.status)
  const [newNote, setNewNote] = useState('')
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null)
  const [editNoteText, setEditNoteText] = useState('')
  const [localPhotos, setLocalPhotos] = useState<string[]>(device.photos || [])
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)

  const handleStatusChange = (newStatus: string) => {
    const deviceStatus = newStatus as DeviceStatus
    setStatus(deviceStatus)
    onUpdateStatus(device.id, deviceStatus)
    toast.success(`Status updated to ${getStatusLabel(deviceStatus)}`)
  }

  const handleAddNote = () => {
    if (!newNote.trim()) {
      toast.error('Please enter a note')
      return
    }
    onAddNote(device.id, newNote.trim())
    setNewNote('')
    toast.success('Note added successfully')
  }

  const handleStartEdit = (note: TechnicianNote) => {
    setEditingNoteId(note.id)
    setEditNoteText(note.note)
  }

  const handleCancelEdit = () => {
    setEditingNoteId(null)
    setEditNoteText('')
  }

  const handleSaveEdit = (noteId: string) => {
    if (!editNoteText.trim()) {
      toast.error('Note cannot be empty')
      return
    }
    onEditNote(device.id, noteId, editNoteText.trim())
    setEditingNoteId(null)
    setEditNoteText('')
    toast.success('Note updated successfully')
  }

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).filter(f => f.type.startsWith('image/'))
    if (files.length === 0) return
    Promise.all(files.map(f => compressImage(f))).then(newPhotos => {
      const updated = [...localPhotos, ...newPhotos]
      setLocalPhotos(updated)
      onAddPhotos(device.id, updated)
      toast.success(`${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''} added`)
    })
    e.target.value = ''
  }

  const handleRemovePhoto = (index: number) => {
    const updated = localPhotos.filter((_, i) => i !== index)
    setLocalPhotos(updated)
    onAddPhotos(device.id, updated)
    toast.success('Photo removed')
  }

  const sortedNotes = [...(device.technicianNotes || [])].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="mr-2" size={18} />
          Back to Dashboard
        </Button>
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" className="text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground">
                <Trash className="mr-2" size={18} />
                Delete
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Delete Device</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to delete this device ({device.brand} {device.model})? This action cannot be undone and all associated data including technician notes will be permanently removed.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction
                  onClick={() => onDelete(device.id)}
                  className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                >
                  Delete Device
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          <Button onClick={() => onEdit(device)} className="bg-accent hover:bg-accent/90">
            <Pencil className="mr-2" size={18} />
            Edit Device
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-2xl mb-2">
                {device.brand} {device.model}
              </CardTitle>
              <p className="text-muted-foreground">{getDeviceTypeLabel(device.type)}</p>
            </div>
            <Badge variant={getStatusVariant(status)} className="text-sm px-4 py-2">
              {getStatusLabel(status)}
            </Badge>
          </div>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="info" className="w-full">
            <TabsList className="grid w-full grid-cols-6 mb-6">
              <TabsTrigger value="info">Info</TabsTrigger>
              <TabsTrigger value="condition">Condition</TabsTrigger>
              <TabsTrigger value="repairs">Repairs</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
              <TabsTrigger value="photos">Photos</TabsTrigger>
              <TabsTrigger value="customer">Customer</TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label className="text-muted-foreground">Device Type</Label>
                  <p className="font-medium mt-1">{getDeviceTypeLabel(device.type)}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Status</Label>
                  <Select value={status} onValueChange={handleStatusChange}>
                    <SelectTrigger className="mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
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
                <div>
                  <Label className="text-muted-foreground">Brand</Label>
                  <p className="font-medium mt-1">{device.brand}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Model</Label>
                  <p className="font-medium mt-1">{device.model}</p>
                </div>
                {device.serialNumber && (
                  <div>
                    <Label className="text-muted-foreground">Serial Number</Label>
                    <p className="font-medium font-mono mt-1">{device.serialNumber}</p>
                  </div>
                )}
                {device.imei && (
                  <div>
                    <Label className="text-muted-foreground">IMEI</Label>
                    <p className="font-medium font-mono mt-1">{device.imei}</p>
                  </div>
                )}
                <div>
                  <Label className="text-muted-foreground">Technician</Label>
                  <p className="font-medium mt-1">{device.technicianName}</p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Created</Label>
                  <p className="font-medium mt-1">{formatDateTime(device.createdAt)}</p>
                </div>
                {device.purchasePrice !== undefined && (
                  <div>
                    <Label className="text-muted-foreground">Purchase Price</Label>
                    <p className="font-medium mt-1">${device.purchasePrice.toFixed(2)}</p>
                  </div>
                )}
                {device.marketValue !== undefined && (
                  <div>
                    <Label className="text-muted-foreground">Market Value</Label>
                    <p className="font-medium mt-1">${device.marketValue.toFixed(2)}</p>
                  </div>
                )}
                {device.purchasePrice !== undefined && device.marketValue !== undefined && (
                  <div>
                    <Label className="text-muted-foreground">Potential Profit</Label>
                    <p className={`font-medium mt-1 ${device.marketValue - device.purchasePrice >= 0 ? 'text-green-600 dark:text-green-400' : 'text-destructive'}`}>
                      ${(device.marketValue - device.purchasePrice).toFixed(2)}
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="condition" className="space-y-6">
              <div>
                <Label className="text-muted-foreground">Overall Condition</Label>
                <p className="font-medium mt-1 capitalize">{device.condition}</p>
              </div>
              <div>
                <Label className="text-muted-foreground">Issues Reported</Label>
                <p className="mt-1 whitespace-pre-wrap">{device.issuesReported}</p>
              </div>
              {device.notes && (
                <div>
                  <Label className="text-muted-foreground">Additional Notes</Label>
                  <p className="mt-1 whitespace-pre-wrap">{device.notes}</p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="repairs" className="space-y-6">
              <div>
                <Label className="text-muted-foreground mb-3 block">Repairs Needed</Label>
                <div className="flex flex-wrap gap-2">
                  {device.repairsNeeded.map(repair => (
                    <Badge key={repair} variant="outline" className="px-3 py-1.5">
                      {repair}
                    </Badge>
                  ))}
                </div>
              </div>

              {device.partsUsed.length > 0 && (
                <div>
                  <Label className="text-muted-foreground mb-3 block">Parts Used</Label>
                  <div className="space-y-2">
                    {device.partsUsed.map(part => (
                      <div key={part.id} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                        <div>
                          <p className="font-medium">{part.partName}</p>
                          {part.partNumber && (
                            <p className="text-sm text-muted-foreground font-mono">{part.partNumber}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <p className="font-medium">Qty: {part.quantity}</p>
                          {part.supplier && (
                            <p className="text-sm text-muted-foreground capitalize">{part.supplier}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-6">
              <div className="space-y-4">
                <div className="flex flex-col gap-3">
                  <Label>Add New Note</Label>
                  <Textarea
                    id="new-note"
                    placeholder="Enter technician notes here..."
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    rows={4}
                    className="resize-none"
                  />
                  <Button 
                    onClick={handleAddNote}
                    className="self-end bg-accent hover:bg-accent/90"
                  >
                    <Plus className="mr-2" size={18} weight="bold" />
                    Add Note
                  </Button>
                </div>

                <div className="border-t pt-6">
                  <Label className="text-muted-foreground mb-4 block">
                    Note History ({sortedNotes.length})
                  </Label>
                  {sortedNotes.length > 0 ? (
                    <div className="space-y-3">
                      {sortedNotes.map((note) => (
                        <div key={note.id} className="p-4 bg-muted rounded-lg space-y-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex-1">
                              <p className="text-sm font-medium">{note.technicianName}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDateTime(note.createdAt)}
                              </p>
                            </div>
                            {note.technicianId === currentUserId && editingNoteId !== note.id && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => handleStartEdit(note)}
                                className="h-8 px-2"
                              >
                                <Pencil size={16} />
                              </Button>
                            )}
                          </div>
                          {editingNoteId === note.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editNoteText}
                                onChange={(e) => setEditNoteText(e.target.value)}
                                rows={4}
                                className="resize-none"
                              />
                              <div className="flex gap-2 justify-end">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={handleCancelEdit}
                                >
                                  <X className="mr-1.5" size={16} />
                                  Cancel
                                </Button>
                                <Button
                                  size="sm"
                                  onClick={() => handleSaveEdit(note.id)}
                                  className="bg-accent hover:bg-accent/90"
                                >
                                  <Check className="mr-1.5" size={16} />
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <p className="text-sm whitespace-pre-wrap">{note.note}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No technician notes yet
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="photos" className="space-y-4">
              {localPhotos.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {localPhotos.map((src, i) => (
                    <div key={i} className="relative group">
                      <img
                        src={src}
                        alt={`Device photo ${i + 1}`}
                        className="w-full h-40 object-cover rounded-lg border cursor-zoom-in"
                        onClick={() => setLightboxIndex(i)}
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(i)}
                        className="absolute top-2 right-2 bg-background/80 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No photos attached to this device
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

              {/* Lightbox */}
              {lightboxIndex !== null && (
                <div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
                  onClick={() => setLightboxIndex(null)}
                >
                  <div
                    className="relative max-w-4xl max-h-[90vh] w-full mx-4"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <img
                      src={localPhotos[lightboxIndex]}
                      alt={`Device photo ${lightboxIndex + 1}`}
                      className="w-full h-full object-contain rounded-lg max-h-[85vh]"
                    />
                    <button
                      type="button"
                      onClick={() => setLightboxIndex(null)}
                      className="absolute top-2 right-2 bg-background/80 rounded-full p-1.5 hover:bg-background transition-colors"
                    >
                      <X size={20} />
                    </button>
                    {localPhotos.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={() => setLightboxIndex((lightboxIndex - 1 + localPhotos.length) % localPhotos.length)}
                          className="absolute left-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2 hover:bg-background transition-colors"
                        >
                          &#8249;
                        </button>
                        <button
                          type="button"
                          onClick={() => setLightboxIndex((lightboxIndex + 1) % localPhotos.length)}
                          className="absolute right-2 top-1/2 -translate-y-1/2 bg-background/80 rounded-full p-2 hover:bg-background transition-colors"
                        >
                          &#8250;
                        </button>
                        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-background/80 rounded-full px-3 py-1 text-sm">
                          {lightboxIndex + 1} / {localPhotos.length}
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="customer" className="space-y-6">
              {device.customerName || device.customerContact ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {device.customerName && (
                    <div>
                      <Label className="text-muted-foreground">Customer Name</Label>
                      <p className="font-medium mt-1">{device.customerName}</p>
                    </div>
                  )}
                  {device.customerContact && (
                    <div>
                      <Label className="text-muted-foreground">Contact Information</Label>
                      <p className="font-medium mt-1">{device.customerContact}</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  No customer information recorded
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}
