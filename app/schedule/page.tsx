'use client';

import { useState } from 'react';
import { useData } from '@/app/context/DataContext';
import { Button } from '@/components/ui/button';
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
import { Plus, Edit2, Trash2, Clock, MapPin, Building2, User, Phone, Calendar, Tag } from 'lucide-react';
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
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);

  const [formData, setFormData] = useState<ScheduleFormData>({
    title: '', description: '', datetime: '', location: '',
    clientType: '', company: '', contact: '', emailOrNumber: '',
  });

  const resetForm = () => {
    setFormData({ title: '', description: '', datetime: '', location: '', clientType: '', company: '', contact: '', emailOrNumber: '' });
    setEditingId(null);
  };

  const handleOpenDialog = (schedule?: ScheduleType) => {
    if (schedule) {
      const datetimeForInput = schedule.datetime
        ? schedule.datetime.replace(' ', 'T').slice(0, 16)
        : '';
      setFormData({
        title: schedule.title,
        description: schedule.description,
        datetime: datetimeForInput,
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
    if (!formData.title.trim() || !formData.datetime.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    const datetimeForDB = formData.datetime.replace('T', ' ') + ':00';
    const payload = { ...formData, datetime: datetimeForDB };
    if (editingId !== null) {
      updateSchedule(editingId, payload);
    } else {
      addSchedule(payload);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteId !== null) {
      deleteSchedule(deleteId);
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const formatDatetime = (dt: string) => {
    if (!dt || dt.startsWith('0000')) return '—';
    const d = new Date(dt.replace(' ', 'T'));
    if (isNaN(d.getTime())) return dt;
    return d.toLocaleString([], { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const isPast = (dt: string) => {
    if (!dt || dt.startsWith('0000')) return false;
    return new Date(dt.replace(' ', 'T')) < new Date();
  };

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }} className="space-y-6">

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', color: '#888', textTransform: 'uppercase', marginBottom: '6px' }}>
            Appointments
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', lineHeight: 1, margin: 0 }}>
            Schedule Management
          </h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>
            Manage your schedules with add, edit, and delete options
          </p>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#111', color: '#fff', border: 'none', borderRadius: '12px',
            padding: '10px 20px', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.15)', transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={16} /> Add Schedule
        </button>
      </div>

      {/* Summary Pills */}
      {schedules.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '8px 14px' }}>
            <Calendar size={14} color="#555" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>{schedules.length} Total</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '8px 14px' }}>
            <Tag size={14} color="#555" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>
              {schedules.filter(s => s.clientType === 'underwarranty').length} Under Warranty
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '8px 14px' }}>
            <Tag size={14} color="#555" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>
              {schedules.filter(s => s.clientType === 'newclient').length} New Clients
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {schedules.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 32px', background: '#fafafa', borderRadius: '16px', border: '2px dashed #e0e0e0' }}>
          <div style={{ width: '56px', height: '56px', background: '#f0f0f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Calendar size={24} color="#888" />
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>No schedules yet</p>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Create your first schedule to get started</p>
          <button onClick={() => handleOpenDialog()} style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}>
            Add First Schedule
          </button>
        </div>
      )}

      {/* Schedule Cards */}
      {schedules.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {schedules.map((schedule, idx) => {
            const past = isPast(schedule.datetime);
            return (
              <div
                key={schedule.id}
                style={{
                  background: '#fff', borderRadius: '16px', border: '1px solid #eee',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)', overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  animation: `fadeUp 0.3s ease ${idx * 0.05}s both`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}
              >
                <div style={{ height: '3px', background: past ? '#ccc' : '#222' }} />
                <div style={{ padding: '18px 20px' }}>
                  {/* Title + badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#111', margin: 0, lineHeight: 1.3, flex: 1 }}>
                      {schedule.title}
                    </p>
                    {schedule.clientType && (
                      <span style={{
                        fontSize: '10px', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase',
                        color: '#555', background: '#f0f0f0', border: '1px solid #ddd',
                        borderRadius: '20px', padding: '3px 9px', flexShrink: 0, whiteSpace: 'nowrap',
                      }}>
                        {schedule.clientType === 'underwarranty' ? 'Warranty' : 'New Client'}
                      </span>
                    )}
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
                    <InfoRow icon={<Clock size={12} color="#aaa" />} label="Time" value={formatDatetime(schedule.datetime)} />
                    {schedule.location && <InfoRow icon={<MapPin size={12} color="#aaa" />} label="Location" value={schedule.location} />}
                    {schedule.company && <InfoRow icon={<Building2 size={12} color="#aaa" />} label="Company" value={schedule.company} />}
                    {schedule.contact && <InfoRow icon={<User size={12} color="#aaa" />} label="Contact" value={schedule.contact} />}
                    {schedule.emailOrNumber && <InfoRow icon={<Phone size={12} color="#aaa" />} label="Reach" value={schedule.emailOrNumber} />}
                  </div>

                  {/* Description */}
                  {schedule.description && (
                    <div style={{ padding: '8px 12px', background: '#f8f8f8', borderRadius: '8px', border: '1px solid #eee', fontSize: '12px', color: '#666', lineHeight: 1.5, marginBottom: '14px' }}>
                      {schedule.description}
                    </div>
                  )}

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenDialog(schedule)}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', borderRadius: '9px', fontSize: '12px', fontWeight: 600, background: '#f5f5f5', border: '1px solid #e0e0e0', color: '#444', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e8e8e8'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => { setDeleteId(schedule.id); setIsDeleteOpen(true); }}
                      style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', padding: '8px', borderRadius: '9px', fontSize: '12px', fontWeight: 600, background: '#f5f5f5', border: '1px solid #e0e0e0', color: '#444', cursor: 'pointer', transition: 'background 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e8e8e8'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; }}
                    >
                      <Trash2 size={13} /> Delete
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId !== null ? 'Edit Schedule' : 'Add New Schedule'}</DialogTitle>
            <DialogDescription>{editingId !== null ? 'Update the schedule details' : 'Create a new schedule entry'}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div><Label htmlFor="title">Title *</Label><Input id="title" placeholder="Schedule title" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} /></div>
            <div><Label htmlFor="datetime">Date & Time *</Label><Input id="datetime" type="datetime-local" value={formData.datetime} onChange={(e) => setFormData({ ...formData, datetime: e.target.value })} /></div>
            <div>
              <Label htmlFor="clientType">Client Type</Label>
              <select id="clientType" value={formData.clientType} onChange={(e) => setFormData({ ...formData, clientType: e.target.value })} className="w-full border rounded px-3 py-2 text-sm bg-white">
                <option value="">Select client type</option>
                <option value="underwarranty">Under Warranty</option>
                <option value="newclient">New Client</option>
              </select>
            </div>
            <div><Label htmlFor="company">Company Name</Label><Input id="company" placeholder="Company Name" value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} /></div>
            <div><Label htmlFor="contact">Contact Person</Label><Input id="contact" placeholder="Contact Person" value={formData.contact} onChange={(e) => setFormData({ ...formData, contact: e.target.value })} /></div>
            <div><Label htmlFor="emailOrNumber">Email or Number</Label><Input id="emailOrNumber" placeholder="Email or Phone Number" value={formData.emailOrNumber} onChange={(e) => setFormData({ ...formData, emailOrNumber: e.target.value })} /></div>
            <div><Label htmlFor="location">Location</Label><Input id="location" placeholder="Location" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} /></div>
            <div><Label htmlFor="description">Description</Label><Textarea id="description" placeholder="Schedule description" value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="min-h-24" /></div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId !== null ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Schedule</AlertDialogTitle>
          <AlertDialogDescription>Are you sure you want to delete this schedule? This action cannot be undone.</AlertDialogDescription>
          <DialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </DialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <div style={{ width: '18px', display: 'flex', justifyContent: 'center', flexShrink: 0 }}>{icon}</div>
      <span style={{ fontSize: '11px', color: '#bbb', width: '50px', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '12px', color: '#222', fontWeight: 500 }}>{value}</span>
    </div>
  );
}