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

export default function SchedulePage() {
  const { schedules, addSchedule, updateSchedule, deleteSchedule } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', date: '', time: '', location: '' });
    setEditingId(null);
  };

  const handleOpenDialog = (schedule?: ScheduleType) => {
    if (schedule) {
      setFormData({
        title: schedule.title,
        description: schedule.description,
        date: schedule.date,
        time: schedule.time,
        location: schedule.location,
      });
      setEditingId(schedule.id);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.title || !formData.date || !formData.time) {
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
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Schedule Management</h1>
          <p className="text-muted-foreground mt-2">Manage your schedules with add, edit, and delete options</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={20} />
          Add Schedule
        </Button>
      </div>

      {schedules.length === 0 ? (
        <Card>
          <CardContent className="pt-12">
            <div className="text-center">
              <p className="text-muted-foreground">No schedules yet. Create your first schedule!</p>
            </div>
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
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Date & Time</p>
                  <p className="font-medium">{schedule.date} at {schedule.time}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Description</p>
                  <p className="text-sm">{schedule.description}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(schedule)}
                    className="flex-1 gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
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

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="time">Time *</Label>
                <Input
                  id="time"
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
              </div>
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
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </DialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
