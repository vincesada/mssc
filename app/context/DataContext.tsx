'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

/* ================== Interfaces ================== */
export interface Schedule {
  id: number;
  title: string;
  description: string;
  datetime: string;
  location: string;
  clientType: string;
  company: string;
  contact: string;
  emailOrNumber: string;
}

export interface Renewal {
  id: number;
  clientName: string;
  companyName?: string;
  contactPerson?: string;
  emailOrNumber?: string;
  office: string;
  expiryDate: string;
  renewedDate: string;
}

export interface RMA {
  id: number;
  itemReturned: string;
  purchasedDate: string;
  warranty: boolean;
  repairType: string;
  companyName?: string;
  contactPerson?: string;
  emailOrNumber?: string;
}

export interface Installation {
  id: number;
  project: string;
  company: string;
  dateTime: string;
  location: string;
  devices: string[];
}

export interface Product {
  id: number;
  name: string;
  category: string;
  description?: string;
  quantity: number;
  image?: string;
}

export interface Device {
  id: number;
  name: string;
  type: string;
}

/* ================== Context Type ================== */
interface DataContextType {
  schedules: Schedule[];
  renewals: Renewal[];
  rmas: RMA[];
  installations: Installation[];
  products: Product[];
  devices: Device[];
  isLoaded: boolean;

  addSchedule: (data: Omit<Schedule, 'id'>) => Promise<void>;
  updateSchedule: (id: number, data: Omit<Schedule, 'id'>) => Promise<void>;
  deleteSchedule: (id: number) => Promise<void>;

  addRenewal: (data: Omit<Renewal, 'id'>) => Promise<void>;
  updateRenewal: (id: number, data: Omit<Renewal, 'id'>) => Promise<void>;
  deleteRenewal: (id: number) => Promise<void>;

  addRMA: (data: Omit<RMA, 'id'>) => Promise<void>;
  updateRMA: (id: number, data: Omit<RMA, 'id'>) => Promise<void>;
  deleteRMA: (id: number) => Promise<void>;

  addInstallation: (data: Omit<Installation, 'id'>) => Promise<void>;
  updateInstallation: (id: number, data: Omit<Installation, 'id'>) => Promise<void>;
  deleteInstallation: (id: number) => Promise<void>;

  addProduct: (data: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: number, data: Omit<Product, 'id'>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;

  addDevice: (data: Omit<Device, 'id'>) => Promise<void>;
  deleteDevice: (id: number) => Promise<void>;
}

/* ================== Context ================== */
const DataContext = createContext<DataContextType | undefined>(undefined);

/* ================== Provider ================== */
export function DataProvider({ children }: { children: React.ReactNode }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [rmas, setRMAs] = useState<RMA[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  /* ================== Load All ================== */
  useEffect(() => {
    async function loadAll() {
      try {
        const [s, r, rma, i, p, d] = await Promise.all([
          fetch('/api/schedules').then(r => r.json()),
          fetch('/api/renewals').then(r => r.json()),
          fetch('/api/rmas').then(r => r.json()),
          fetch('/api/installations').then(r => r.json()),
          fetch('/api/products').then(r => r.json()),
          fetch('/api/devices').then(r => r.json()),
        ]);

        setSchedules(s);
        setRenewals(r);
        setRMAs(rma);
        setInstallations(
          i.map((x: any) => ({
            ...x,
            devices: Array.isArray(x.devices)
              ? x.devices
              : JSON.parse(x.devices ?? '[]'),
          }))
        );
        setProducts(p);
        setDevices(d);
      } catch (err) {
        console.error('Load failed', err);
      } finally {
        setIsLoaded(true);
      }
    }
    loadAll();
  }, []);

  /* ================== Helpers ================== */
  const post = async (url: string, data: any) =>
    fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());

  const put = async (url: string, data: any) =>
    fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    }).then(r => r.json());

  const remove = async (url: string) =>
    fetch(url, { method: 'DELETE' });

  /* ================== CRUD ================== */

  // Schedules
  const addSchedule = async (data: Omit<Schedule, 'id'>) => {
    const created = await post('/api/schedules', data);
    setSchedules(prev => [...prev, created]);
  };

  const updateSchedule = async (id: number, data: Omit<Schedule, 'id'>) => {
    const updated = await put(`/api/schedules/${id}`, data);
    setSchedules(prev => prev.map(s => (s.id === id ? updated : s)));
  };

  const deleteSchedule = async (id: number) => {
    await remove(`/api/schedules/${id}`);
    setSchedules(prev => prev.filter(s => s.id !== id));
  };

  // Renewals
  const addRenewal = async (data: Omit<Renewal, 'id'>) => {
    const created = await post('/api/renewals', data);
    setRenewals(prev => [...prev, created]);
  };

  const updateRenewal = async (id: number, data: Omit<Renewal, 'id'>) => {
    const updated = await put(`/api/renewals/${id}`, data);
    setRenewals(prev => prev.map(r => (r.id === id ? updated : r)));
  };

  const deleteRenewal = async (id: number) => {
    await remove(`/api/renewals/${id}`);
    setRenewals(prev => prev.filter(r => r.id !== id));
  };

  // RMAs
  const addRMA = async (data: Omit<RMA, 'id'>) => {
    const created = await post('/api/rmas', data);
    setRMAs(prev => [...prev, created]);
  };

  const updateRMA = async (id: number, data: Omit<RMA, 'id'>) => {
    const updated = await put(`/api/rmas/${id}`, data);
    setRMAs(prev => prev.map(r => (r.id === id ? updated : r)));
  };

  const deleteRMA = async (id: number) => {
    await remove(`/api/rmas/${id}`);
    setRMAs(prev => prev.filter(r => r.id !== id));
  };

  // Installations
  const addInstallation = async (data: Omit<Installation, 'id'>) => {
    const created = await post('/api/installations', {
      ...data,
      devices: JSON.stringify(data.devices),
    });
    created.devices = JSON.parse(created.devices);
    setInstallations(prev => [...prev, created]);
  };

  const updateInstallation = async (id: number, data: Omit<Installation, 'id'>) => {
    const updated = await put(`/api/installations/${id}`, {
      ...data,
      devices: JSON.stringify(data.devices),
    });
    updated.devices = JSON.parse(updated.devices);
    setInstallations(prev => prev.map(i => (i.id === id ? updated : i)));
  };

  const deleteInstallation = async (id: number) => {
    await remove(`/api/installations/${id}`);
    setInstallations(prev => prev.filter(i => i.id !== id));
  };

  // Products
  const addProduct = async (data: Omit<Product, 'id'>) => {
    const created = await post('/api/products', data);
    setProducts(prev => [...prev, created]);
  };

  const updateProduct = async (id: number, data: Omit<Product, 'id'>) => {
    const updated = await put(`/api/products/${id}`, data);
    setProducts(prev => prev.map(p => (p.id === id ? updated : p)));
  };

  const deleteProduct = async (id: number) => {
    await remove(`/api/products/${id}`);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // Devices
  const addDevice = async (data: Omit<Device, 'id'>) => {
    const created = await post('/api/devices', data);
    setDevices(prev => [...prev, created]);
  };

  const deleteDevice = async (id: number) => {
    await remove(`/api/devices/${id}`);
    setDevices(prev => prev.filter(d => d.id !== id));
  };

  return (
    <DataContext.Provider
      value={{
        schedules,
        renewals,
        rmas,
        installations,
        products,
        devices,
        isLoaded,
        addSchedule,
        updateSchedule,
        deleteSchedule,
        addRenewal,
        updateRenewal,
        deleteRenewal,
        addRMA,
        updateRMA,
        deleteRMA,
        addInstallation,
        updateInstallation,
        deleteInstallation,
        addProduct,
        updateProduct,
        deleteProduct,
        addDevice,
        deleteDevice,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

/* ================== Hook ================== */
export function useData() {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error('useData must be used within DataProvider');
  return ctx;
}