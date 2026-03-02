'use client';

import { useState, ChangeEvent } from 'react';
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
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Edit2, Trash2, Package, Tag } from 'lucide-react';
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
    quantity: 0,
    image: '',
  });

  const resetForm = () => {
    setFormData({ name: '', category: '', description: '', quantity: 0, image: '' });
    setEditingId(null);
  };

  const handleOpenDialog = (product?: ProductType) => {
    if (product) {
      setFormData({
        name: product.name,
        category: product.category,
        description: product.description || '',
        quantity: product.quantity,
        image: product.image || '',
      });
      setEditingId(product.id);
    } else {
      resetForm();
    }
    setIsDialogOpen(true);
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    if (!formData.name.trim() || !formData.category.trim()) {
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
    <div style={{ fontFamily: "'Segoe UI', system-ui, sans-serif" }} className="space-y-6">

      {/* Header – same as Schedule & updated RMA */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <div style={{
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '2.5px',
            color: '#888',
            textTransform: 'uppercase',
            marginBottom: '6px'
          }}>
            Inventory
          </div>
          <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', lineHeight: 1, margin: 0 }}>
            Product Management
          </h1>
          <p style={{ fontSize: '13px', color: '#888', marginTop: '6px' }}>
            Add, edit and manage your product catalog
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
          onMouseEnter={e => {
            e.currentTarget.style.background = '#333';
            e.currentTarget.style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = '#111';
            e.currentTarget.style.transform = 'translateY(0)';
          }}
        >
          <Plus size={16} /> Add Product
        </button>
      </div>

      {/* Summary pills – optional but consistent */}
      {products.length > 0 && (
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '8px 14px'
          }}>
            <Package size={14} color="#555" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>
              {products.length} Products
            </span>
          </div>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: '#f5f5f5',
            border: '1px solid #e0e0e0',
            borderRadius: '10px',
            padding: '8px 14px'
          }}>
            <Tag size={14} color="#555" />
            <span style={{ fontSize: '12px', fontWeight: 600, color: '#333' }}>
              {new Set(products.map(p => p.category)).size} Categories
            </span>
          </div>
        </div>
      )}

      {/* Empty State */}
      {products.length === 0 && (
        <div style={{
          textAlign: 'center',
          padding: '64px 32px',
          background: '#fafafa',
          borderRadius: '16px',
          border: '2px dashed #e0e0e0'
        }}>
          <div style={{
            width: '56px',
            height: '56px',
            background: '#f0f0f0',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <Package size={24} color="#888" />
          </div>
          <p style={{ fontSize: '15px', fontWeight: 600, color: '#111', marginBottom: '6px' }}>
            No products yet
          </p>
          <p style={{ fontSize: '13px', color: '#888', marginBottom: '20px' }}>
            Add your first product to start building your inventory
          </p>
          <button
            onClick={() => handleOpenDialog()}
            style={{
              background: '#111',
              color: '#fff',
              border: 'none',
              borderRadius: '10px',
              padding: '9px 20px',
              fontSize: '13px',
              fontWeight: 600,
              cursor: 'pointer'
            }}
          >
            Add First Product
          </button>
        </div>
      )}

      {/* Product Cards */}
      {products.length > 0 && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
          gap: '16px'
        }}>
          {products.map((product, idx) => (
            <div
              key={product.id}
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
              {/* Thin top accent bar */}
              <div style={{ height: '3px', background: '#222' }} />

              <div style={{ padding: '18px 20px' }}>
                {/* Title + category badge */}
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '10px',
                  marginBottom: '14px'
                }}>
                  <p style={{
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#111',
                    margin: 0,
                    lineHeight: 1.3,
                    flex: 1
                  }}>
                    {product.name}
                  </p>
                  <span style={{
                    fontSize: '10px',
                    fontWeight: 600,
                    letterSpacing: '0.5px',
                    textTransform: 'uppercase',
                    color: '#555',
                    background: '#f0f0f0',
                    border: '1px solid #ddd',
                    borderRadius: '20px',
                    padding: '3px 9px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap'
                  }}>
                    {product.category}
                  </span>
                </div>

                {/* Image */}
                {product.image ? (
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{
                      width: '100%',
                      height: '160px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      marginBottom: '14px',
                      background: '#f8f8f8'
                    }}
                  />
                ) : (
                  <div style={{
                    width: '100%',
                    height: '160px',
                    background: '#f8f8f8',
                    borderRadius: '8px',
                    marginBottom: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Package size={48} color="#ddd" />
                  </div>
                )}

                {/* Details */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '7px', marginBottom: '14px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{ width: '18px', display: 'flex', justifyContent: 'center' }}>
                      <Tag size={12} color="#aaa" />
                    </div>
                    <span style={{ fontSize: '11px', color: '#bbb', width: '60px' }}>Stock</span>
                    <span style={{ fontSize: '12px', color: '#222', fontWeight: 500 }}>
                      {product.quantity}
                    </span>
                  </div>
                  {product.description && (
                    <div style={{
                      fontSize: '12px',
                      color: '#666',
                      lineHeight: 1.5,
                      padding: '8px 12px',
                      background: '#f8f8f8',
                      borderRadius: '8px',
                      border: '1px solid #eee'
                    }}>
                      {product.description}
                    </div>
                  )}
                </div>

                {/* Actions */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={() => handleOpenDialog(product)}
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
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e8e8e8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; }}
                  >
                    <Edit2 size={13} /> Edit
                  </button>
                  <button
                    onClick={() => { setDeleteId(product.id); setIsDeleteOpen(true); }}
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
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = '#e8e8e8'; }}
                    onMouseLeave={e => { e.currentTarget.style.background = '#f5f5f5'; }}
                  >
                    <Trash2 size={13} /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{editingId ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {editingId ? 'Update product details' : 'Enter details for a new product'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="category">Category *</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min={0}
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: parseInt(e.target.value) || 0 })}
              />
            </div>
            <div>
              <Label htmlFor="image">Product Image</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
              />
              {formData.image && (
                <img
                  src={formData.image}
                  alt="Preview"
                  style={{
                    marginTop: '8px',
                    width: '100%',
                    height: '140px',
                    objectFit: 'cover',
                    borderRadius: '8px',
                    border: '1px solid #eee'
                  }}
                />
              )}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingId ? 'Update' : 'Add'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogTitle>Delete Product</AlertDialogTitle>
          <p style={{ fontSize: '14px', color: '#555', margin: '8px 0 16px' }}>
            Are you sure you want to delete this product? This action cannot be undone.
          </p>
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
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