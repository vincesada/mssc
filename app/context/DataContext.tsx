'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface Schedule {
  id: string;
  title: string;
  description: string;
  datetime: string;       // combined date & time
  location: string;
  clientType: string;     // underwarranty | newclient
  company: string;
  contact: string;
  emailOrNumber: string;
}

export interface Renewal {
  id: string;
  clientName: string;
  companyName?: string;       // added
  contactPerson?: string;     // added
  emailOrNumber?: string;     // added
  office: string;
  expiryDate: string;
  renewedDate: string;
}


export interface RMA {
  id: string;
  itemReturned: string;
  purchasedDate: string;
  warranty: boolean;
  repairType: string; // free repair/change item or repair with fee
  companyName?: string;      // added
  contactPerson?: string;    // added
  emailOrNumber?: string;    // added
}

export interface Installation {
  id: string;
  project: string;
  company: string;
  dateTime: string;
  location: string;
  devices: string[]; // now references Product.name
}

export interface Product {
  id: string;
  name: string;
  category: string;
  description?: string;
  quantity: number;      // Available stock
  image?: string;        // URL or Base64 string
}

export interface Device {
  id: string;
  name: string;
  type: string;
}

interface DataContextType {
  schedules: Schedule[];
  renewals: Renewal[];
  rmas: RMA[];
  installations: Installation[];
  products: Product[];
  devices: Device[];
  
  // Schedule operations
  addSchedule: (schedule: Omit<Schedule, 'id'>) => void;
  updateSchedule: (id: string, schedule: Omit<Schedule, 'id'>) => void;
  deleteSchedule: (id: string) => void;
  
  // Renewal operations
  addRenewal: (renewal: Omit<Renewal, 'id'>) => void;
  updateRenewal: (id: string, renewal: Omit<Renewal, 'id'>) => void;
  deleteRenewal: (id: string) => void;
  
  // RMA operations
  addRMA: (rma: Omit<RMA, 'id'>) => void;
  updateRMA: (id: string, rma: Omit<RMA, 'id'>) => void;
  deleteRMA: (id: string) => void;
  
  // Installation operations
  addInstallation: (installation: Omit<Installation, 'id'>) => void;
  updateInstallation: (id: string, installation: Omit<Installation, 'id'>) => void;
  deleteInstallation: (id: string) => void;
  
  // Product operations
  addProduct: (product: Omit<Product, 'id'>) => void;
  updateProduct: (id: string, product: Omit<Product, 'id'>) => void;
  deleteProduct: (id: string) => void;
  
  // Device operations
  addDevice: (device: Omit<Device, 'id'>) => void;
  deleteDevice: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [renewals, setRenewals] = useState<Renewal[]>([]);
  const [rmas, setRMAs] = useState<RMA[]>([]);
  const [installations, setInstallations] = useState<Installation[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    const savedSchedules = localStorage.getItem('schedules');
    const savedRenewals = localStorage.getItem('renewals');
    const savedRMAs = localStorage.getItem('rmas');
    const savedInstallations = localStorage.getItem('installations');
    const savedProducts = localStorage.getItem('products');
    const savedDevices = localStorage.getItem('devices');

    if (savedSchedules) setSchedules(JSON.parse(savedSchedules));
    if (savedRenewals) setRenewals(JSON.parse(savedRenewals));
    if (savedRMAs) setRMAs(JSON.parse(savedRMAs));
    if (savedInstallations) setInstallations(JSON.parse(savedInstallations));
    if (savedProducts) setProducts(JSON.parse(savedProducts));
    if (savedDevices) setDevices(JSON.parse(savedDevices));
    
    setIsLoaded(true);
  }, []);

  // Save schedules to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('schedules', JSON.stringify(schedules));
    }
  }, [schedules, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('renewals', JSON.stringify(renewals));
    }
  }, [renewals, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('rmas', JSON.stringify(rmas));
    }
  }, [rmas, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('installations', JSON.stringify(installations));
    }
  }, [installations, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('products', JSON.stringify(products));
    }
  }, [products, isLoaded]);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem('devices', JSON.stringify(devices));
    }
  }, [devices, isLoaded]);

  // Schedule operations
  const addSchedule = (schedule: Omit<Schedule, 'id'>) => {
    const newSchedule = { ...schedule, id: Date.now().toString() };
    setSchedules([...schedules, newSchedule]);
  };

  const updateSchedule = (id: string, schedule: Omit<Schedule, 'id'>) => {
    setSchedules(schedules.map(s => s.id === id ? { ...schedule, id } : s));
  };

  const deleteSchedule = (id: string) => {
    setSchedules(schedules.filter(s => s.id !== id));
  };

  // Renewal operations
  const addRenewal = (renewal: Omit<Renewal, 'id'>) => {
    const newRenewal = { ...renewal, id: Date.now().toString() };
    setRenewals([...renewals, newRenewal]);
  };

  const updateRenewal = (id: string, renewal: Omit<Renewal, 'id'>) => {
    setRenewals(renewals.map(r => r.id === id ? { ...renewal, id } : r));
  };

  const deleteRenewal = (id: string) => {
    setRenewals(renewals.filter(r => r.id !== id));
  };

  // RMA operations
  const addRMA = (rma: Omit<RMA, 'id'>) => {
    const newRMA = { ...rma, id: Date.now().toString() };
    setRMAs([...rmas, newRMA]);
  };

  const updateRMA = (id: string, rma: Omit<RMA, 'id'>) => {
    setRMAs(rmas.map(r => r.id === id ? { ...rma, id } : r));
  };

  const deleteRMA = (id: string) => {
    setRMAs(rmas.filter(r => r.id !== id));
  };

  // Installation operations
  const addInstallation = (installation: Omit<Installation, 'id'>) => {
    const newInstallation = { ...installation, id: Date.now().toString() };
    setInstallations([...installations, newInstallation]);
  };

  const updateInstallation = (id: string, installation: Omit<Installation, 'id'>) => {
    setInstallations(installations.map(i => i.id === id ? { ...installation, id } : i));
  };

  const deleteInstallation = (id: string) => {
    setInstallations(installations.filter(i => i.id !== id));
  };

  // Product operations
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: Date.now().toString() };
    setProducts([...products, newProduct]);
  };

  const updateProduct = (id: string, product: Omit<Product, 'id'>) => {
    setProducts(products.map(p => p.id === id ? { ...product, id } : p));
  };

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id));
  };

  // Device operations
  const addDevice = (device: Omit<Device, 'id'>) => {
    const newDevice = { ...device, id: Date.now().toString() };
    setDevices([...devices, newDevice]);
  };

  const deleteDevice = (id: string) => {
    setDevices(devices.filter(d => d.id !== id));
  };

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <DataContext.Provider
      value={{
        schedules,
        renewals,
        rmas,
        installations,
        products,
        devices,
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

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}
