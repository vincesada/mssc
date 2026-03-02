'use client';

import { useState } from 'react';
import { useData } from '@/app/context/DataContext';
import { Button } from '@/components/ui/button';
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
import { Plus, Edit2, Trash2, AlertCircle, RotateCcw, Building2, User, Phone, MapPin, Calendar } from 'lucide-react';
import { Renewal as RenewalType } from '@/app/context/DataContext';

export default function RenewalPage() {
  const { renewals, addRenewal, updateRenewal, deleteRenewal } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    clientName: '',
    companyName: '',
    contactPerson: '',
    emailOrNumber: '',
    office: '',
    expiryDate: '',
    renewedDate: '',
  });

  const resetForm = () => {
    setFormData({ clientName: '', companyName: '', contactPerson: '', emailOrNumber: '', office: '', expiryDate: '', renewedDate: '' });
    setEditingId(null);
  };

  const handleOpenDialog = (renewal?: RenewalType & any) => {
    if (renewal) {
      setFormData({
        clientName: renewal.clientName || '',
        companyName: renewal.companyName || '',
        contactPerson: renewal.contactPerson || '',
        emailOrNumber: renewal.emailOrNumber || '',
        office: renewal.office || '',
        expiryDate: renewal.expiryDate || '',
        renewedDate: renewal.renewedDate || '',
      });
      setEditingId(String(renewal.id));
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.clientName || !formData.expiryDate) {
      alert('Please fill in all required fields');
      return;
    }
    if (editingId) {
      updateRenewal(Number(editingId), formData);
    } else {
      addRenewal(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteRenewal(Number(deleteId));
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const isExpired = (date: string) => !!date && new Date(date) < new Date();

  const expiredCount = renewals.filter(r => isExpired(r.expiryDate)).length;
  const activeCount = renewals.length - expiredCount;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }} className="space-y-6">

      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', color: '#888', textTransform: 'uppercase', marginBottom: '6px' }}>
            Client Renewals
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', lineHeight: 1, margin: 0 }}>
            Renewal Management
          </h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>
            Track client renewals and expiry dates
          </p>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#111', color: '#fff',
            border: 'none', borderRadius: '12px',
            padding: '10px 20px', fontSize: '13px', fontWeight: 600,
            cursor: 'pointer', boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={e => { e.currentTarget.style.background = '#333'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
          onMouseLeave={e => { e.currentTarget.style.background = '#111'; e.currentTarget.style.transform = 'translateY(0)'; }}
        >
          <Plus size={16} /> Add Renewal
        </button>
      </div>

      {/* ── Summary Pills ── */}
      {renewals.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '8px 14px' }}>
            <RotateCcw size={14} color="#555" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>{activeCount} Active</span>
          </div>
          {expiredCount > 0 && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#fafafa', border: '1px solid #ddd', borderRadius: '10px', padding: '8px 14px' }}>
              <AlertCircle size={14} color="#999" />
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#666' }}>{expiredCount} Expired</span>
            </div>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '8px 14px' }}>
            <Calendar size={14} color="#555" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>{renewals.length} Total</span>
          </div>
        </div>
      )}

      {/* ── Empty State ── */}
      {renewals.length === 0 && (
        <div style={{
          textAlign: 'center', padding: '64px 32px',
          background: '#fafafa', borderRadius: '16px',
          border: '2px dashed #e0e0e0',
        }}>
          <div style={{ width: '56px', height: '56px', background: '#f0f0f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <RotateCcw size={24} color="#888" />
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>No renewals yet</p>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Start tracking your client renewals</p>
          <button
            onClick={() => handleOpenDialog()}
            style={{
              background: '#111', color: '#fff', border: 'none',
              borderRadius: '10px', padding: '9px 20px',
              fontSize: '13px', fontWeight: 600, cursor: 'pointer',
            }}
          >
            Add First Renewal
          </button>
        </div>
      )}

      {/* ── Renewal Cards ── */}
      {renewals.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
          {renewals.map((renewal, idx) => {
            const expired = isExpired(renewal.expiryDate);
            return (
              <div
                key={renewal.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  border: `1px solid ${expired ? '#ddd' : '#eee'}`,
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  animation: `fadeUp 0.3s ease ${idx * 0.05}s both`,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)'; }}
              >
                {/* Top accent bar — dark if active, light gray if expired */}
                <div style={{ height: '3px', background: expired ? '#ccc' : '#222' }} />

                <div style={{ padding: '18px 20px' }}>
                  {/* Title row */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: '#111', margin: '0 0 3px', lineHeight: 1.2 }}>
                        {renewal.clientName}
                      </p>
                      {renewal.office && (
                        <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{renewal.office}</p>
                      )}
                    </div>
                    <div style={{
                      display: 'flex', alignItems: 'center', gap: '5px',
                      padding: '4px 10px', borderRadius: '20px', flexShrink: 0,
                      background: '#f0f0f0', border: '1px solid #ddd',
                    }}>
                      {expired && <AlertCircle size={11} color="#888" />}
                      <span style={{ fontSize: '11px', fontWeight: 600, color: expired ? '#888' : '#333' }}>
                        {expired ? 'Expired' : 'Active'}
                      </span>
                    </div>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
                    {renewal.companyName && <InfoRow icon={<Building2 size={12} color="#aaa" />} label="Company" value={renewal.companyName} />}
                    {renewal.contactPerson && <InfoRow icon={<User size={12} color="#aaa" />} label="Contact" value={renewal.contactPerson} />}
                    {renewal.emailOrNumber && <InfoRow icon={<Phone size={12} color="#aaa" />} label="Reach" value={renewal.emailOrNumber} />}
                    {renewal.office && <InfoRow icon={<MapPin size={12} color="#aaa" />} label="Office" value={renewal.office} />}
                  </div>

                  {/* Date row */}
                  <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: '8px', marginBottom: '14px',
                    padding: '10px 12px', background: '#f8f8f8',
                    borderRadius: '10px', border: '1px solid #eee',
                  }}>
                    <div>
                      <p style={{ fontSize: '10px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Expiry</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: expired ? '#888' : '#111', margin: 0 }}>{renewal.expiryDate || '—'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize: '10px', color: '#aaa', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '3px' }}>Renewed</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#111', margin: 0 }}>{renewal.renewedDate || '—'}</p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenDialog(renewal)}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '8px', borderRadius: '9px', fontSize: '12px', fontWeight: 600,
                        background: '#f5f5f5', border: '1px solid #e0e0e0', color: '#444',
                        cursor: 'pointer', transition: 'background 0.15s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#e8e8e8'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; }}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => { setDeleteId(String(renewal.id)); setIsDeleteOpen(true); }}
                      style={{
                        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                        padding: '8px', borderRadius: '9px', fontSize: '12px', fontWeight: 600,
                        background: '#f5f5f5', border: '1px solid #e0e0e0', color: '#444',
                        cursor: 'pointer', transition: 'background 0.15s',
                      }}
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

      {/* ── Add/Edit Dialog ── */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Renewal' : 'Add New Renewal'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the renewal details' : 'Add a new client renewal'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input id="clientName" placeholder="Client name" value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input id="companyName" placeholder="Company name" value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input id="contactPerson" placeholder="Contact person" value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="emailOrNumber">Email or Phone Number</Label>
              <Input id="emailOrNumber" placeholder="Email or phone number" value={formData.emailOrNumber}
                onChange={(e) => setFormData({ ...formData, emailOrNumber: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="office">Office Location</Label>
              <Input id="office" placeholder="Office location" value={formData.office}
                onChange={(e) => setFormData({ ...formData, office: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input id="expiryDate" type="date" value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="renewedDate">Renewed Date</Label>
                <Input id="renewedDate" type="date" value={formData.renewedDate}
                  onChange={(e) => setFormData({ ...formData, renewedDate: e.target.value })} />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Delete Dialog ── */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Renewal</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this renewal record? This action cannot be undone.
          </AlertDialogDescription>
          <DialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
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
      <span style={{ fontSize: '11px', color: '#bbb', width: '46px', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '12px', color: '#222', fontWeight: 500 }}>{value}</span>
    </div>
  );
}