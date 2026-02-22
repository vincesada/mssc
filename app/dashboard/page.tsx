'use client';

import { useData } from '@/app/context/DataContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, RotateCcw, AlertCircle, Wrench, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function DashboardPage() {
  const { schedules, renewals, rmas, installations } = useData();

  const stats = [
    {
      title: 'Total Schedules',
      value: schedules.length,
      description: 'Active schedules',
      icon: Calendar,
      href: '/schedule',
      color: 'bg-blue-50 text-blue-600',
    },
    {
      title: 'Renewals',
      value: renewals.length,
      description: 'Client renewals',
      icon: RotateCcw,
      href: '/renewal',
      color: 'bg-green-50 text-green-600',
    },
    {
      title: 'RMA Records',
      value: rmas.length,
      description: 'Warranty requests',
      icon: AlertCircle,
      href: '/rma',
      color: 'bg-orange-50 text-orange-600',
    },
    {
      title: 'Installations',
      value: installations.length,
      description: 'Active projects',
      icon: Wrench,
      href: '/installation',
      color: 'bg-purple-50 text-purple-600',
    },
  ];

  const expiredRenewals = renewals.filter(r => new Date(r.expiryDate) < new Date());
  const expiredCount = expiredRenewals.length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground mt-2">Welcome to your business management dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.href} href={stat.href}>
              <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-muted-foreground">
                    {stat.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="text-3xl font-bold text-foreground">{stat.value}</div>
                      <p className="text-xs text-muted-foreground mt-1">{stat.description}</p>
                    </div>
                    <div className={`p-3 rounded-lg ${stat.color}`}>
                      <Icon size={24} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Alerts Section */}
      {expiredCount > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertCircle className="text-orange-600" size={20} />
              <CardTitle className="text-orange-900">Renewal Alerts</CardTitle>
            </div>
            <CardDescription className="text-orange-700">
              {expiredCount} client renewal{expiredCount === 1 ? '' : 's'} have expired
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {expiredRenewals.slice(0, 3).map((renewal) => (
                <div key={renewal.id} className="flex items-center justify-between p-2 bg-white rounded border border-orange-100">
                  <div>
                    <p className="font-medium text-sm text-foreground">{renewal.clientName}</p>
                    <p className="text-xs text-muted-foreground">Expired: {renewal.expiryDate}</p>
                  </div>
                </div>
              ))}
            </div>
            {expiredCount > 3 && (
              <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                <Link href="/renewal">View All</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Recent Schedules */}
      {schedules.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Upcoming Schedules</CardTitle>
            <CardDescription>Your next scheduled items</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {schedules.slice(0, 5).map((schedule) => (
                <div
                  key={schedule.id}
                  className="flex items-start justify-between p-3 border border-border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">{schedule.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {schedule.date} at {schedule.time} • {schedule.location}
                    </p>
                  </div>
                  <TrendingUp size={16} className="text-gray-400 flex-shrink-0" />
                </div>
              ))}
            </div>
            {schedules.length > 5 && (
              <Button variant="outline" size="sm" className="mt-4 w-full" asChild>
                <Link href="/schedule">View All Schedules</Link>
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {schedules.length === 0 && renewals.length === 0 && rmas.length === 0 && installations.length === 0 && (
        <Card>
          <CardContent className="pt-12">
            <div className="text-center space-y-4">
              <p className="text-muted-foreground">No data yet. Start by adding your first entry!</p>
              <div className="flex gap-2 flex-wrap justify-center">
                <Button asChild>
                  <Link href="/schedule">Add Schedule</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/renewal">Add Renewal</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
