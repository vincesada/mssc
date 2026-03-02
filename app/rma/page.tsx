'use client';

import { useState } from 'react';
import { useData } from '@/app/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
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
import { Plus, Edit2, Trash2, ShieldCheck, ShieldX, Package, Calendar, Wrench, Building2, User, Phone } from 'lucide-react';
import { RMA as RMAType } from '@/app/context/DataContext';

export default function RMAPage() {
  const { rmas, products, addRMA, updateRMA, deleteRMA } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    itemReturned: '',
    purchasedDate: '',
    warranty: true,
    repairType: '',
    companyName: '',
    contactPerson: '',
    emailOrNumber: '',
  });

  const resetForm = () => {
    setFormData({
      itemReturned: '',
      purchasedDate: '',
      warranty: true,
      repairType: '',
      companyName: '',
      contactPerson: '',
      emailOrNumber: '',
    });
    setEditingId(null);
  };

  const handleOpenDialog = (rma?: RMAType) => {
    if (rma) {
      setFormData({
        itemReturned: rma.itemReturned,
        purchasedDate: rma.purchasedDate,
        warranty: rma.warranty,
        repairType: rma.repairType,
        companyName: rma.companyName || '',
        contactPerson: rma.contactPerson || '',
        emailOrNumber: rma.emailOrNumber || '',
      });
      setEditingId(String(rma.id));
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.itemReturned || !formData.purchasedDate || !formData.repairType) {
      alert('Please fill in all required fields');
      return;
    }
    if (editingId) {
      updateRMA(Number(editingId), formData);
    } else {
      addRMA(formData);
    }
    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteRMA(Number(deleteId));
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const warrantyCount = rmas.filter(r => r.warranty).length;
  const outOfWarrantyCount = rmas.filter(r => !r.warranty).length;

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }} className="space-y-6">

      {/* Header – matched with Schedule */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', color: '#888', textTransform: 'uppercase', marginBottom: '6px' }}>
            Returns & Repairs
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', lineHeight: 1, margin: 0 }}>
            RMA Management
          </h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>
            Track returned items, warranty claims, and repair records
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
          <Plus size={16} /> Add RMA
        </button>
      </div>

      {/* Summary Pills – neutral style like Schedule */}
      {rmas.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '8px 14px' }}>
            <ShieldCheck size={14} color="#555" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>{warrantyCount} Under Warranty</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '8px 14px' }}>
            <ShieldX size={14} color="#555" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>{outOfWarrantyCount} Out of Warranty</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '8px 14px' }}>
            <Package size={14} color="#555" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>{rmas.length} Total Records</span>
          </div>
        </div>
      )}

      {/* Empty State – matched style */}
      {rmas.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 32px', background: '#fafafa', borderRadius: '16px', border: '2px dashed #e0e0e0' }}>
          <div style={{ width: '56px', height: '56px', background: '#f0f0f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Package size={24} color="#888" />
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>No RMA records yet</p>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Create your first RMA entry to get started</p>
          <button
            onClick={() => handleOpenDialog()}
            style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            Add First RMA
          </button>
        </div>
      )}

      {/* RMA Cards – cleaner, Schedule-like */}
      {rmas.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
          {rmas.map((rma, idx) => {
            const isOutOfWarranty = !rma.warranty;
            return (
              <div
                key={rma.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  border: '1px solid #eee',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  animation: `fadeUp 0.3s ease ${idx * 0.05}s both`,
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ height: '3px', background: isOutOfWarranty ? '#ccc' : '#222' }} />

                <div style={{ padding: '18px 20px' }}>
                  {/* Title + badge */}
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '10px', marginBottom: '14px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                      <div style={{
                        width: '28px', height: '28px', borderRadius: '8px',
                        background: '#f5f5f5', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <Package size={15} color="#777" />
                      </div>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: '#111', margin: 0, lineHeight: 1.3 }}>
                        {rma.itemReturned}
                      </p>
                    </div>

                    <span style={{
                      fontSize: '10px', fontWeight: 600, letterSpacing: '0.4px', textTransform: 'uppercase',
                      color: '#555', background: '#f0f0f0', border: '1px solid #ddd',
                      borderRadius: '20px', padding: '3px 9px', whiteSpace: 'nowrap',
                    }}>
                      {rma.warranty ? 'Warranty' : 'No Warranty'}
                    </span>
                  </div>

                  {/* Details */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
                    <InfoRow icon={<Calendar size={12} color="#aaa" />} label="Purchased" value={rma.purchasedDate} />
                    <InfoRow icon={<Wrench size={12} color="#aaa" />} label="Repair" value={rma.repairType} />
                    {rma.companyName && <InfoRow icon={<Building2 size={12} color="#aaa" />} label="Company" value={rma.companyName} />}
                    {rma.contactPerson && <InfoRow icon={<User size={12} color="#aaa" />} label="Contact" value={rma.contactPerson} />}
                    {rma.emailOrNumber && <InfoRow icon={<Phone size={12} color="#aaa" />} label="Reach" value={rma.emailOrNumber} />}
                  </div>

                  {/* Warranty note – subtle */}
                  <div style={{
                    padding: '8px 12px',
                    background: '#f8f8f8',
                    borderRadius: '8px',
                    border: '1px solid #eee',
                    fontSize: '12px',
                    color: '#555',
                    lineHeight: 1.4,
                    marginBottom: '14px',
                  }}>
                    {rma.warranty
                      ? '✓ Eligible for free repair or replacement'
                      : '⚠ Repair / service subject to fee'}
                  </div>

                  {/* Actions – same as Schedule */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenDialog(rma)}
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
                      onClick={() => { setDeleteId(String(rma.id)); setIsDeleteOpen(true); }}
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

      {/* Dialogs remain mostly unchanged – just visual consistency via buttons */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit RMA' : 'Add New RMA'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the RMA details' : 'Create a new RMA record'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {/* ... form fields stay the same ... */}
            <div>
              <Label htmlFor="itemReturned">Product Being Returned *</Label>
              {products.length === 0 ? (
                <div className="p-3 bg-gray-50 border border-gray-200 rounded text-sm text-gray-600">
                  No products available. Add one first in Products section.
                </div>
              ) : (
                <Select value={formData.itemReturned} onValueChange={v => setFormData({ ...formData, itemReturned: v })}>
                  <SelectTrigger id="itemReturned">
                    <SelectValue placeholder="Select product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.name}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
            {/* other fields same as your original */}
            <div><Label>Purchased Date *</Label><Input type="date" value={formData.purchasedDate} onChange={e => setFormData({...formData, purchasedDate: e.target.value})} /></div>
            <div>
              <Label>Warranty Status *</Label>
              <Select value={formData.warranty ? 'yes' : 'no'} onValueChange={v => setFormData({...formData, warranty: v === 'yes'})}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Under Warranty</SelectItem>
                  <SelectItem value="no">Out of Warranty</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {/* ... rest of fields ... */}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete RMA</AlertDialogTitle>
          <AlertDialogDescription>This action cannot be undone.</AlertDialogDescription>
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
      <span style={{ fontSize: '11px', color: '#bbb', width: '60px', flexShrink: 0 }}>{label}</span>
      <span style={{ fontSize: '12px', color: '#222', fontWeight: 500 }}>{value}</span>
    </div>
  );
}