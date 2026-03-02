'use client';

import dynamic from 'next/dynamic';
import { useState, useEffect } from 'react';
import { useData } from '@/app/context/DataContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, MapPin, Building2, Clock, X, Wrench } from 'lucide-react';
import { Installation as InstallationType } from '@/app/context/DataContext';

const FieldMap = dynamic(() => import('@/components/fieldmap'), { ssr: false });

export default function InstallationPage() {
  const { installations, addInstallation, updateInstallation, deleteInstallation, products } = useData();

  // ── Temporary debug logs (remove or comment out after fixing) ──
  useEffect(() => {
    console.log('INSTALLATIONS:', installations);
    if (installations.length > 0) {
      console.log('First installation devices:', installations[0].devices);
      console.log('Devices type:', typeof installations[0].devices);
      console.log('Is array?', Array.isArray(installations[0].devices));
    }
    console.log('PRODUCTS count:', products.length);
    console.log('Products with images:', products.filter(p => !!p.image).map(p => p.name));
  }, [installations, products]);
  // ──────────────────────────────────────────────────────────────

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [selectedDevice, setSelectedDevice] = useState<string>('');
  const [mapLocation, setMapLocation] = useState<string>('');

  const [formData, setFormData] = useState({
    project: '',
    company: '',
    dateTime: '',
    location: '',
    devices: [] as string[],
  });

  // Helper: ensure devices is always string[]
  const normalizeDevices = (dev: any): string[] => {
    if (Array.isArray(dev)) return dev;
    if (typeof dev === 'string') {
      try {
        const parsed = JSON.parse(dev);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }
    return [];
  };

  const resetForm = () => {
    setFormData({ project: '', company: '', dateTime: '', location: '', devices: [] });
    setSelectedDevice('');
    setEditingId(null);
    setMapLocation('');
  };

  const handleOpenDialog = (installation?: InstallationType) => {
    if (installation) {
      const safeDevices = normalizeDevices(installation.devices);
      setFormData({
        project: installation.project || '',
        company: installation.company || '',
        dateTime: installation.dateTime || '',
        location: installation.location || '',
        devices: safeDevices,
      });
      setEditingId(Number(installation.id));
      setMapLocation(installation.location || '');
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleAddDevice = () => {
    if (selectedDevice.trim() && !formData.devices.includes(selectedDevice.trim())) {
      setFormData({ ...formData, devices: [...formData.devices, selectedDevice.trim()] });
      setSelectedDevice('');
    }
  };

  const handleRemoveDevice = (device: string) => {
    setFormData({ ...formData, devices: formData.devices.filter(d => d !== device) });
  };

  const handleSave = () => {
    if (!formData.project.trim() || !formData.company.trim() || !formData.dateTime || !formData.location.trim()) {
      alert('Please fill in all required fields');
      return;
    }
    const payload = {
      ...formData,
      project: formData.project.trim(),
      company: formData.company.trim(),
      location: formData.location.trim(),
    };
    if (editingId) {
      updateInstallation(editingId, payload);
    } else {
      addInstallation(payload);
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

  const formatDateTime = (dt: string) => {
    if (!dt) return '—';
    try {
      return new Date(dt).toLocaleString([], {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return dt;
    }
  };

  useEffect(() => {
    setMapLocation(formData.location);
  }, [formData.location]);

  // Helper to find product with normalized matching
  const findProduct = (deviceName: string) =>
    products.find(
      (p) => p.name.trim().toLowerCase() === deviceName.trim().toLowerCase()
    );

  return (
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }} className="space-y-6">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{ fontSize: '11px', fontWeight: 700, letterSpacing: '2.5px', color: '#888', textTransform: 'uppercase', marginBottom: '6px' }}>
            Projects
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', lineHeight: 1, margin: 0 }}>
            Installation Management
          </h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>
            Track and manage installation projects
          </p>
        </div>
        <button
          onClick={() => handleOpenDialog()}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#111',
            color: '#fff',
            border: 'none',
            borderRadius: '12px',
            padding: '10px 20px',
            fontSize: '13px',
            fontWeight: 600,
            cursor: 'pointer',
            boxShadow: '0 4px 14px rgba(0,0,0,0.15)',
            transition: 'all 0.2s',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#333';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#111';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Plus size={16} /> Add Installation
        </button>
      </div>

      {/* Summary */}
      {installations.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#f5f5f5', border: '1px solid #e0e0e0', borderRadius: '10px', padding: '8px 14px' }}>
            <Wrench size={14} color="#555" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>
              {installations.length} Total Projects
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {installations.length === 0 && (
        <div style={{ textAlign: 'center', padding: '64px 32px', background: '#fafafa', borderRadius: '16px', border: '2px dashed #e0e0e0' }}>
          <div style={{ width: '56px', height: '56px', background: '#f0f0f0', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <Wrench size={24} color="#888" />
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>No installations yet</p>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>Add your first installation project</p>
          <button
            onClick={() => handleOpenDialog()}
            style={{ background: '#111', color: '#fff', border: 'none', borderRadius: '10px', padding: '9px 20px', fontSize: '13px', fontWeight: 600, cursor: 'pointer' }}
          >
            Add First Installation
          </button>
        </div>
      )}

      {/* Cards */}
      {installations.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '16px' }}>
          {installations.map((installation, idx) => {
            const safeDevices = normalizeDevices(installation.devices);

            return (
              <div
                key={installation.id}
                style={{
                  background: '#fff',
                  borderRadius: '16px',
                  border: '1px solid #eee',
                  boxShadow: '0 2px 12px rgba(0,0,0,0.05)',
                  overflow: 'hidden',
                  transition: 'transform 0.2s, box-shadow 0.2s',
                  animation: `fadeUp 0.3s ease ${idx * 0.05}s both`,
                  display: 'flex',
                  flexDirection: 'column',
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 8px 24px rgba(0,0,0,0.09)';
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                  (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)';
                }}
              >
                <div style={{ height: '3px', background: '#222' }} />

                <div style={{ padding: '18px 20px', flex: 1, display: 'flex', flexDirection: 'column', gap: '0' }}>
                  {/* Title */}
                  <div style={{ marginBottom: '14px' }}>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: '#111', margin: '0 0 3px' }}>{installation.project}</p>
                    <p style={{ fontSize: '12px', color: '#999', margin: 0 }}>{installation.company}</p>
                  </div>

                  {/* Info rows */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
                    <InfoRow icon={<Clock size={12} color="#aaa" />} label="Date" value={formatDateTime(installation.dateTime)} />
                    <InfoRow icon={<MapPin size={12} color="#aaa" />} label="Location" value={installation.location} />
                    <InfoRow icon={<Building2 size={12} color="#aaa" />} label="Company" value={installation.company} />
                  </div>

                  {/* Devices */}
                  {safeDevices.length > 0 && (
                    <div style={{ marginBottom: '14px' }}>
                      <p style={{ fontSize: '10px', color: '#aaa', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '6px' }}>
                        Devices
                      </p>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                        {safeDevices.map((d) => {
                          const product = findProduct(d);
                          return (
                            <div
                              key={d}
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                background: '#f5f5f5',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '4px 8px',
                              }}
                            >
                              {product?.image ? (
                                <img
                                  src={product.image}
                                  alt={d}
                                  style={{ width: '16px', height: '16px', objectFit: 'cover', borderRadius: '3px' }}
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <div
                                  style={{
                                    width: '16px',
                                    height: '16px',
                                    background: '#ddd',
                                    borderRadius: '3px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    color: '#777',
                                  }}
                                >
                                  ?
                                </div>
                              )}
                              <span style={{ fontSize: '11px', fontWeight: 600, color: '#333' }}>{d}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Map */}
                  <div style={{ marginBottom: '14px', flex: 1 }}>
                    <FieldMap destinationAddress={installation.location} />
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleOpenDialog(installation)}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px',
                        borderRadius: '9px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: '#f5f5f5',
                        border: '1px solid #e0e0e0',
                        color: '#444',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#e8e8e8')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f5')}
                    >
                      <Edit2 size={13} /> Edit
                    </button>
                    <button
                      onClick={() => {
                        setDeleteId(Number(installation.id));
                        setIsDeleteOpen(true);
                      }}
                      style={{
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '6px',
                        padding: '8px',
                        borderRadius: '9px',
                        fontSize: '12px',
                        fontWeight: 600,
                        background: '#f5f5f5',
                        border: '1px solid #e0e0e0',
                        color: '#444',
                        cursor: 'pointer',
                        transition: 'background 0.15s',
                      }}
                      onMouseEnter={(e) => (e.currentTarget.style.background = '#e8e8e8')}
                      onMouseLeave={(e) => (e.currentTarget.style.background = '#f5f5f5')}
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
        <DialogContent className="sm:max-w-[760px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Installation' : 'Add New Installation'}</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col md:flex-row gap-4">
            {/* Form */}
            <div className="flex-1 space-y-4">
              <div>
                <Label>Project Name *</Label>
                <Input value={formData.project} onChange={(e) => setFormData({ ...formData, project: e.target.value })} />
              </div>
              <div>
                <Label>Company *</Label>
                <Input value={formData.company} onChange={(e) => setFormData({ ...formData, company: e.target.value })} />
              </div>
              <div>
                <Label>Date & Time *</Label>
                <Input
                  type="datetime-local"
                  value={formData.dateTime}
                  onChange={(e) => setFormData({ ...formData, dateTime: e.target.value })}
                />
              </div>
              <div>
                <Label>Location *</Label>
                <Input
                  placeholder="e.g. Ayala Center Cebu, IT Park Cebu"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
                <p style={{ fontSize: '11px', color: '#aaa', marginTop: '4px' }}>
                  Map will show route from our office (Mabolo, Cebu City) to this location.
                </p>
              </div>
              <div>
                <Label>Devices</Label>
                <div className="flex gap-2 mb-2">
                  <select
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    className="flex-1 border p-2 rounded-md text-sm bg-white"
                  >
                    <option value="">Select a product</option>
                    {products
                      .filter((p) => p.quantity > 0)
                      .map((p) => (
                        <option key={p.id} value={p.name}>
                          {p.name} (Stock: {p.quantity})
                        </option>
                      ))}
                  </select>
                  <Button type="button" onClick={handleAddDevice} variant="outline" className="gap-1 flex-shrink-0">
                    <Plus size={14} /> Add
                  </Button>
                </div>

                {formData.devices.length > 0 && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {formData.devices.map((d) => {
                      const product = findProduct(d);
                      return (
                        <div
                          key={d}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                            background: '#f5f5f5',
                            border: '1px solid #e0e0e0',
                            borderRadius: '8px',
                            padding: '6px 10px',
                          }}
                        >
                          {product?.image ? (
                            <img
                              src={product.image}
                              alt={d}
                              style={{ width: '20px', height: '20px', objectFit: 'cover', borderRadius: '4px' }}
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display = 'none';
                              }}
                            />
                          ) : (
                            <div
                              style={{
                                width: '20px',
                                height: '20px',
                                background: '#ddd',
                                borderRadius: '4px',
                                fontSize: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#777',
                              }}
                            >
                              ?
                            </div>
                          )}
                          <span style={{ fontSize: '13px', fontWeight: 500, flex: 1 }}>{d}</span>
                          <button
                            onClick={() => handleRemoveDevice(d)}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#aaa', display: 'flex' }}
                          >
                            <X size={14} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Map preview */}
            <div style={{ flex: 1, minHeight: '320px' }}>
              <p style={{ fontSize: '11px', color: '#aaa', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '8px' }}>
                Route Preview
              </p>
              <FieldMap destinationAddress={mapLocation} />
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

      {/* Delete Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Installation</AlertDialogTitle>
          <p style={{ fontSize: '13px', color: '#666', marginTop: '8px' }}>
            Are you sure you want to delete this installation? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </div>
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