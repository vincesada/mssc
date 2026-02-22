'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LayoutDashboard, Calendar, RotateCcw, AlertCircle, Wrench, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const pathname = usePathname();

  const menuItems = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Schedule', href: '/schedule', icon: Calendar },
    { name: 'Renewal', href: '/renewal', icon: RotateCcw },
    { name: 'RMA', href: '/rma', icon: AlertCircle },
    { name: 'Installation', href: '/installation', icon: Wrench },
    { name: 'Products', href: '/products', icon: Package },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={cn(
          'bg-white border-r border-border transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          {sidebarOpen && <h1 className="text-lg font-bold text-foreground">MUSTARD SEED</h1>}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="ml-auto"
          >
            {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        </div>

        <nav className="p-4 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-lg transition-colors',
                  isActive(item.href)
                    ? 'bg-blue-50 text-blue-600 border border-blue-200'
                    : 'text-foreground hover:bg-gray-50'
                )}
              >
                <Icon size={20} className="flex-shrink-0" />
                {sidebarOpen && <span className="text-sm font-medium">{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
