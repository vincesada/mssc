'use client';

import { useState } from 'react';
import { useData } from '@/app/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
import { Plus, Edit2, Trash2 } from 'lucide-react';
import { Schedule as ScheduleType } from '@/app/context/DataContext';

interface ScheduleFormData {
  title: string;
  description: string;
  datetime: string;
  location: string;
  clientType: string;
  company: string;
  contact: string;
  emailOrNumber: string;
}

export default function SchedulePage() {
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState<ScheduleFormData>({
    title: '',
    description: '',
    datetime: '',
    location: '',
    clientType: '',
    company: '',
    contact: '',
    emailOrNumber: '',
  });

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      datetime: '',
      location: '',
      clientType: '',
      company: '',
      contact: '',
      emailOrNumber: '',
    });
    setEditingId(null);
  };

  const handleOpenDialog = (schedule?: ScheduleType) => {
    if (schedule) {
      setFormData({
        title: schedule.title,
        description: schedule.description,
        datetime: schedule.datetime || '',
        location: schedule.location,
        clientType: schedule.clientType || '',
        company: schedule.company || '',
        contact: schedule.contact || '',
        emailOrNumber: schedule.emailOrNumber || '',
      });
      setEditingId(schedule.id);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.datetime) {
      alert('Please fill in all required fields');
      return;
    }

    if (editingId) {
      updateSchedule(editingId, formData);
    } else {
      addSchedule(formData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteSchedule(deleteId);
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schedule Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage your schedules with add, edit, and delete options
          </p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={20} /> Add Schedule
        </Button>
      </div>

      {/* Schedule Cards */}
      {schedules.length === 0 ? (
        <Card>
          <CardContent className="pt-12 text-center">
            <p className="text-muted-foreground">No schedules yet. Create your first schedule!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {schedules.map((schedule) => (
            <Card key={schedule.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-lg">{schedule.title}</CardTitle>
                <CardDescription>{schedule.location}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="text-sm text-muted-foreground">Date & Time</p>
                <p className="font-medium">{schedule.datetime}</p>

                <p className="text-sm text-muted-foreground">Client Type</p>
                <p className="font-medium">{schedule.clientType}</p>

                <p className="text-sm text-muted-foreground">Company</p>
                <p className="font-medium">{schedule.company}</p>

                <p className="text-sm text-muted-foreground">Contact</p>
                <p className="font-medium">{schedule.contact} ({schedule.emailOrNumber})</p>

                <p className="text-sm text-muted-foreground">Description</p>
                <p className="text-sm">{schedule.description}</p>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(schedule)}
                    className="flex-1 gap-2"
                  >
                    <Edit2 size={16} /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDeleteId(schedule.id);
                      setIsDeleteOpen(true);
                    }}
                    className="flex-1 gap-2"
                  >
                    <Trash2 size={16} /> Delete
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
            <DialogTitle>{editingId ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the schedule details' : 'Create a new schedule entry'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                placeholder="Schedule title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="datetime">Date & Time *</Label>
              <Input
                id="datetime"
                type="datetime-local"
                value={formData.datetime}
                onChange={(e) => setFormData({ ...formData, datetime: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="clientType">Client Type *</Label>
              <select
                id="clientType"
                value={formData.clientType}
                onChange={(e) => setFormData({ ...formData, clientType: e.target.value })}
                className="w-full border rounded px-2 py-1"
              >
                <option value="">Select client type</option>
                <option value="underwarranty">Under Warranty</option>
                <option value="newclient">New Client</option>
              </select>
            </div>

            <div>
              <Label htmlFor="company">Company Name</Label>
              <Input
                id="company"
                placeholder="Company Name"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="contact">Contact Person</Label>
              <Input
                id="contact"
                placeholder="Contact Person"
                value={formData.contact}
                onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="emailOrNumber">Email or Number</Label>
              <Input
                id="emailOrNumber"
                placeholder="Email or Phone Number"
                value={formData.emailOrNumber}
                onChange={(e) => setFormData({ ...formData, emailOrNumber: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Location"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Schedule description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="min-h-24"
              />
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
          <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this schedule? This action cannot be undone.
          </AlertDialogDescription>
          <DialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </DialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}