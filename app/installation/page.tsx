'use client';

import { useState } from 'react';
import { useData } from '@/app/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, MapPin, Building2, Clock, X } from 'lucide-react';
import { Installation as InstallationType } from '@/app/context/DataContext';

export default function InstallationPage() {
  const { installations, addInstallation, updateInstallation, deleteInstallation } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    project: '',
    company: '',
    dateTime: '',
    location: '',
    devices: [] as string[],
  });

  const [newDevice, setNewDevice] = useState('');

  const resetForm = () => {
    setFormData({ project: '', company: '', dateTime: '', location: '', devices: [] });
    setNewDevice('');
    setEditingId(null);
  };

  const handleOpenDialog = (installation?: InstallationType) => {
    if (installation) {
      setFormData({
        project: installation.project,
        company: installation.company,
        dateTime: installation.dateTime,
        location: installation.location,
        devices: installation.devices || [],
      });
      setEditingId(installation.id);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleAddDevice = () => {
    if (newDevice.trim() && !formData.devices.includes(newDevice.trim())) {
      setFormData({
        ...formData,
        devices: [...formData.devices, newDevice.trim()],
      });
      setNewDevice('');
    }
  };

  const handleRemoveDevice = (device: string) => {
    setFormData({
      ...formData,
      devices: formData.devices.filter(d => d !== device),
    });
  };

  const handleSave = () => {
    if (!formData.project || !formData.company || !formData.dateTime || !formData.location) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      updateInstallation(editingId, formData);
    } else {
      addInstallation(formData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteInstallation(deleteId);
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const formatDateTime = (dateTime: string) => {
    try {
      const date = new Date(dateTime);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dateTime;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Installation Management</h1>
          <p className="text-muted-foreground mt-2">Track and manage installation projects</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={20} />
          Add Installation
        </Button>
      </div>

      {installations.length === 0 ? (
        <Card>
          <CardContent className="pt-12">
            <div className="text-center">
              <p className="text-muted-foreground">No installations yet. Add your first installation!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {installations.map((installation) => (
            <Card key={installation.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <CardTitle className="text-lg">{installation.project}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Building2 size={16} />
                  {installation.company}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Clock size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Date & Time</p>
                      <p className="text-sm font-medium">{formatDateTime(installation.dateTime)}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <MapPin size={18} className="text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs text-muted-foreground">Location</p>
                      <p className="text-sm font-medium">{installation.location}</p>
                    </div>
                  </div>

                  {installation.devices && installation.devices.length > 0 && (
                    <div>
                      <p className="text-xs text-muted-foreground">Devices</p>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {installation.devices.map((device) => (
                          <span key={device} className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                            {device}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(installation)}
                    className="flex-1 gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDeleteId(installation.id);
                      setIsDeleteOpen(true);
                    }}
                    className="flex-1 gap-2"
                  >
                    <Trash2 size={16} />
                    Delete
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Installation' : 'Add New Installation'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the installation details' : 'Create a new installation record'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="project">Project Name *</Label>
              <Input
                id="project"
                placeholder="Project name"
                value={formData.project}
                onChange={(e) => setFormData({ ...formData, project: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="company">Company *</Label>
              <Input
                id="company"
                placeholder="Company name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="dateTime">Date & Time *</Label>
              <Input
                id="dateTime"
                type="datetime-local"
                value={formData.dateTime}
                onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                placeholder="Installation location address"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="devices">Devices Being Installed</Label>
              <div className="flex gap-2 mb-3">
                <Input
                  id="devices"
                  placeholder="e.g., Router, Access Point"
                  value={newDevice}
                  onChange={(e) => setNewDevice(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddDevice();
                    }
                  }}
                />
                <Button
                  type="button"
                  onClick={handleAddDevice}
                  className="flex-shrink-0 gap-2"
                  variant="outline"
                >
                  <Plus size={16} />
                  Add
                </Button>
              </div>

              {formData.devices.length > 0 && (
                <div className="space-y-2">
                  {formData.devices.map((device) => (
                    <div key={device} className="flex items-center justify-between bg-blue-50 p-3 rounded-md border border-blue-100">
                      <span className="text-sm font-medium">{device}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveDevice(device)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <X size={16} />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>{editingId ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Installation</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this installation record? This action cannot be undone.
          </AlertDialogDescription>
          <DialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </DialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
