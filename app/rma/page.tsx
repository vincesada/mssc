'use client';

import { useState } from 'react';
import { useData } from '@/app/context/DataContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { Plus, Edit2, Trash2, Check, X } from 'lucide-react';
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
      setEditingId(rma.id);
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
      updateRMA(editingId, formData);
    } else {
      addRMA(formData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteRMA(deleteId);
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">RMA Management</h1>
          <p className="text-muted-foreground mt-2">Manage returned items and warranty repairs</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={20} />
          Add RMA
        </Button>
      </div>

      {/* RMA Cards */}
      {rmas.length === 0 ? (
        <Card>
          <CardContent className="pt-12">
            <div className="text-center">
              <p className="text-muted-foreground">No RMA records yet. Add your first RMA!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {rmas.map((rma) => (
            <Card key={rma.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{rma.itemReturned}</CardTitle>
                    <CardDescription>Purchased on {rma.purchasedDate}</CardDescription>
                  </div>
                  <div
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${
                      rma.warranty
                        ? 'bg-green-100 text-green-700'
                        : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {rma.warranty ? (
                      <>
                        <Check size={16} />
                        Under Warranty
                      </>
                    ) : (
                      <>
                        <X size={16} />
                        Out of Warranty
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                <div>
                  <p className="text-sm text-muted-foreground">Repair Type</p>
                  <p className="font-medium">{rma.repairType}</p>
                  {rma.warranty && <p className="text-xs text-green-600 mt-1">Free repair or item change</p>}
                  {!rma.warranty && <p className="text-xs text-orange-600 mt-1">Repair with applicable fee</p>}
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Company</p>
                  <p className="font-medium">{rma.companyName || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Contact Person</p>
                  <p className="font-medium">{rma.contactPerson || '-'}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email / Contact Number</p>
                  <p className="font-medium">{rma.emailOrNumber || '-'}</p>
                </div>
                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(rma)}
                    className="flex-1 gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDeleteId(rma.id);
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
            <DialogTitle>{editingId ? 'Edit RMA' : 'Add New RMA'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the RMA details' : 'Create a new RMA record'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="itemReturned">Product Being Returned *</Label>
              {products.length === 0 ? (
                <div className="p-3 bg-amber-50 border border-amber-200 rounded-md text-sm text-amber-700">
                  No products available. <a href="/products" className="font-semibold underline">Add a product first</a>
                </div>
              ) : (
                <Select
                  value={formData.itemReturned}
                  onValueChange={(value) => setFormData({ ...formData, itemReturned: value })}
                >
                  <SelectTrigger id="itemReturned">
                    <SelectValue placeholder="Select a product" />
                  </SelectTrigger>
                  <SelectContent>
                    {products.map((product) => (
                      <SelectItem key={product.id} value={product.name}>
                        {product.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label htmlFor="purchasedDate">Purchased Date *</Label>
              <Input
                id="purchasedDate"
                type="date"
                value={formData.purchasedDate}
                onChange={(e) => setFormData({ ...formData, purchasedDate: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="warranty">Warranty Status *</Label>
              <Select
                value={formData.warranty ? 'yes' : 'no'}
                onValueChange={(value) => setFormData({ ...formData, warranty: value === 'yes' })}
              >
                <SelectTrigger id="warranty">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Under Warranty (Free Repair/Change Item)</SelectItem>
                  <SelectItem value="no">Out of Warranty (Repair with Fee)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="repairType">Repair Type *</Label>
              <Input
                id="repairType"
                placeholder={formData.warranty ? 'e.g., Replace module, Free repair' : 'e.g., Screen repair ($50), Battery replacement ($30)'}
                value={formData.repairType}
                onChange={(e) => setFormData({ ...formData, repairType: e.target.value })}
              />
            </div>

            {/* New Fields */}
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                placeholder="Enter company name"
                value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="contactPerson">Contact Person</Label>
              <Input
                id="contactPerson"
                placeholder="Enter contact person"
                value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="emailOrNumber">Email or Contact Number</Label>
              <Input
                id="emailOrNumber"
                placeholder="Enter email or phone number"
                value={formData.emailOrNumber}
                onChange={(e) => setFormData({ ...formData, emailOrNumber: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>{editingId ? 'Update' : 'Add'}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete RMA</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this RMA record? This action cannot be undone.
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