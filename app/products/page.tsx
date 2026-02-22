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
import { Plus, Edit2, Trash2, Package } from 'lucide-react';
import { Product as ProductType } from '@/app/context/DataContext';

export default function ProductsPage() {
  const { products, addProduct, updateProduct, deleteProduct } = useData();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    description: '',
  });

  const resetForm = () => {
    setFormData({ name: '', category: '', description: '' });
    setEditingId(null);
  };

  const handleOpenDialog = (product?: ProductType) => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description,
      });
      setEditingId(product.id);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    if (!formData.name || !formData.category) {
      alert('Please fill in required fields');
      return;
    }

    if (editingId) {
      updateProduct(editingId, formData);
    } else {
      addProduct(formData);
    }

    setIsDialogOpen(false);
    resetForm();
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteProduct(deleteId);
      setIsDeleteOpen(false);
      setDeleteId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Product Management</h1>
          <p className="text-muted-foreground mt-2">Manage your products for RMA and other operations</p>
        </div>
        <Button onClick={() => handleOpenDialog()} className="gap-2">
          <Plus size={20} />
          Add Product
        </Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="pt-12">
            <div className="text-center space-y-4">
              <Package size={48} className="mx-auto text-muted-foreground opacity-50" />
              <p className="text-muted-foreground">No products yet. Add your first product!</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id} className="hover:shadow-lg transition-shadow flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <CardDescription>{product.category}</CardDescription>
                  </div>
                  <Package size={24} className="text-blue-600 flex-shrink-0" />
                </div>
              </CardHeader>
              <CardContent className="space-y-4 flex-1">
                {product.description && (
                  <div>
                    <p className="text-xs text-muted-foreground">Description</p>
                    <p className="text-sm text-foreground">{product.description}</p>
                  </div>
                )}

                <div className="flex gap-2 pt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleOpenDialog(product)}
                    className="flex-1 gap-2"
                  >
                    <Edit2 size={16} />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setDeleteId(product.id);
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
            <DialogTitle>{editingId ? 'Edit Product' : 'Add New Product'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update the product details' : 'Create a new product'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                placeholder="e.g., Router X1000"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                placeholder="e.g., Networking, Electronics"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Product description (optional)"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete this product? This action cannot be undone.
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
