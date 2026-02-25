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
import { Plus, Edit2, Trash2, AlertCircle } from 'lucide-react';
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
    setFormData({
      clientName: '',
      companyName: '',
      contactPerson: '',
      emailOrNumber: '',
      office: '',
      expiryDate: '',
      renewedDate: '',
    });
    setEditingId(null);
  };

  const handleOpenDialog = (renewal?: RenewalType & any) => {
    if (renewal) {
      setFormData({
        clientName: renewal.clientName || '',
        companyName: renewal.companyName || '',
        contactPerson: renewal.contactPerson || '',
        emailOrNumber: renewal.emailOrNumber || '',
        office: renewal.office,
        expiryDate: renewal.expiryDate,
        renewedDate: renewal.renewedDate,
      });
      setEditingId(renewal.id);
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
      updateRenewal(editingId, formData);
    } else {
      addRenewal(formData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteRenewal(deleteId);
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  const isExpired = (expiryDate: string) => new Date(expiryDate) < new Date();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Renewal Management</h1>
          <p className="text-muted-foreground mt-2">Track client renewals and expiry dates</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={20} />
          Add Renewal
        </Button>
      </div>

      {renewals.length === 0 ? (
        <Card>
          <CardContent className="pt-12">
            <div className="text-center">
              <p className="text-muted-foreground">No renewals yet. Add your first renewal!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {renewals.map((renewal) => (
            <Card
              key={renewal.id}
              className={`hover:shadow-lg transition-all ${
                isExpired(renewal.expiryDate) ? 'border-red-200 bg-red-50' : ''
              }`}
            >
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <CardTitle className="text-lg">{renewal.clientName}</CardTitle>
                      {isExpired(renewal.expiryDate) && (
                        <div className="flex items-center gap-1 bg-red-100 text-red-700 px-2 py-1 rounded text-xs font-medium">
                          <AlertCircle size={14} />
                          Expired
                        </div>
                      )}
                    </div>
                    <CardDescription>{renewal.office}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{renewal.companyName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{renewal.contactPerson || '-'} ({renewal.emailOrNumber || '-'})</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Expiry Date</p>
                    <p className="font-medium">{renewal.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Renewed Date</p>
                    <p className="font-medium">{renewal.renewedDate || 'Not renewed'}</p>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(renewal)}
                    className="flex-1 gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDeleteId(renewal.id);
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
            <DialogTitle>{editingId ? 'Edit Renewal' : 'Add New Renewal'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the renewal details' : 'Add a new client renewal'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="clientName">Client Name *</Label>
              <Input
                id="clientName"
                placeholder="Client name"
                value={formData.clientName}
                onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Company name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                placeholder="Contact person"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="emailOrNumber">Email or Phone Number</Label>
              <Input
                id="emailOrNumber"
                placeholder="Email or phone number"
                value={formData.emailOrNumber}
                onChange={(e) => setFormData({ ...formData, emailOrNumber: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="office">Office Location</Label>
              <Input
                id="office"
                placeholder="Office location"
                value={formData.office}
                onChange={(e) => setFormData({ ...formData, office: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiryDate">Expiry Date *</Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="renewedDate">Renewed Date</Label>
                <Input
                  id="renewedDate"
                  type="date"
                  value={formData.renewedDate}
                  onChange={(e) => setFormData({ ...formData, renewedDate: e.target.value })}
                />
              </div>
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
          <AlertDialogTitle>Delete Renewal</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this renewal record? This action cannot be undone.
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