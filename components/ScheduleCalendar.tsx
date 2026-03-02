'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, Building2, Calendar, Wrench, RotateCcw, AlertCircle } from 'lucide-react';

interface Schedule {
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

interface Renewal {
  id: number;
  clientName: string;
  companyName?: string;
  contactPerson?: string;
  emailOrNumber?: string;
  office: string;
  expiryDate: string;
  renewedDate: string;
}

interface RMA {
  id: number;
  itemReturned: string;
  purchasedDate: string;
  warranty: boolean;
  repairType: string;
  companyName?: string;
  contactPerson?: string;
  emailOrNumber?: string;
}

interface Installation {
  id: number;
  project: string;
  company: string;
  dateTime: string;
  location: string;
  devices: string[];
}

interface Props {
  schedules: Schedule[];
  renewals: Renewal[];
  rmas: RMA[];
  installations: Installation[];
}

interface CalendarEvent {
  id: string;
  type: 'schedule' | 'renewal' | 'rma' | 'installation';
  title: string;
  subtitle?: string;
  date: Date;
  detail1?: string;
  detail2?: string;
}

const TYPE_CONFIG = {
  schedule:     { color: '#7c6ff7', bg: '#ede9fe', light: '#f5f3ff', label: 'Schedule',     icon: Calendar },
  renewal:      { color: '#22a689', bg: '#ccfbef', light: '#f0fdf9', label: 'Renewal',      icon: RotateCcw },
  rma:          { color: '#e07b39', bg: '#ffedd5', light: '#fff7ed', label: 'RMA',          icon: AlertCircle },
  installation: { color: '#d0589e', bg: '#fce7f3', light: '#fdf4f9', label: 'Installation', icon: Wrench },
};

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];
const DAYS = ['SUN','MON','TUE','WED','THU','FRI','SAT'];

function parseDate(str: string): Date | null {
  if (!str || str.startsWith('0000')) return null;
  const normalized = str.replace(' ', 'T');
  const d = new Date(normalized);
  return isNaN(d.getTime()) ? null : d;
}

export default function ScheduleCalendar({ schedules, renewals, rmas, installations }: Props) {
  const today = new Date();
  const [currentDate, setCurrentDate] = useState(new Date(today.getFullYear(), today.getMonth(), 1));
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate());
  const [animDir, setAnimDir] = useState<'left' | 'right'>('right');
  const [animating, setAnimating] = useState(false);
  const [activeFilters, setActiveFilters] = useState<Set<string>>(
    new Set(['schedule', 'renewal', 'rma', 'installation'])
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const daysInPrevMonth = new Date(year, month, 0).getDate();

  const navigate = (dir: 'left' | 'right') => {
    setAnimDir(dir);
    setAnimating(true);
    setTimeout(() => {
      setCurrentDate(new Date(year, month + (dir === 'right' ? 1 : -1), 1));
      setSelectedDay(null);
      setAnimating(false);
    }, 180);
  };

  const toggleFilter = (type: string) => {
    setActiveFilters(prev => {
      const next = new Set(prev);
      next.has(type) ? next.delete(type) : next.add(type);
      return next;
    });
  };

  const allEvents: CalendarEvent[] = [];

  schedules.forEach(s => {
    const d = parseDate(s.datetime);
    if (d) allEvents.push({
      id: `schedule-${s.id}`, type: 'schedule',
      title: s.title, subtitle: s.clientType,
      date: d,
      detail1: d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      detail2: s.location || s.company,
    });
  });

  renewals.forEach(r => {
    const d = parseDate(r.expiryDate);
    if (d) allEvents.push({
      id: `renewal-${r.id}`, type: 'renewal',
      title: r.clientName, subtitle: 'Expiry Date',
      date: d,
      detail1: r.office,
      detail2: r.companyName,
    });
  });

  rmas.forEach(r => {
    const d = parseDate(r.purchasedDate);
    if (d) allEvents.push({
      id: `rma-${r.id}`, type: 'rma',
      title: r.itemReturned, subtitle: r.repairType,
      date: d,
      detail1: r.companyName,
      detail2: r.contactPerson,
    });
  });

  installations.forEach(i => {
    const d = parseDate(i.dateTime);
    if (d) allEvents.push({
      id: `installation-${i.id}`, type: 'installation',
      title: i.project, subtitle: i.company,
      date: d,
      detail1: i.location,
      detail2: Array.isArray(i.devices) ? i.devices.join(', ') : i.devices,
    });
  });

  const filteredEvents = allEvents.filter(e => activeFilters.has(e.type));

  const eventsByDay: Record<number, CalendarEvent[]> = {};
  filteredEvents.forEach(e => {
    if (e.date.getFullYear() === year && e.date.getMonth() === month) {
      const day = e.date.getDate();
      if (!eventsByDay[day]) eventsByDay[day] = [];
      eventsByDay[day].push(e);
    }
  });

  const selectedEvents = selectedDay ? (eventsByDay[selectedDay] || []) : [];
  const isToday = (day: number) =>
    today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;

  const totalCells = Math.ceil((firstDayOfMonth + daysInMonth) / 7) * 7;
  const cells: { day: number; current: boolean }[] = [];
  for (let i = 0; i < firstDayOfMonth; i++)
    cells.push({ day: daysInPrevMonth - firstDayOfMonth + 1 + i, current: false });
  for (let i = 1; i <= daysInMonth; i++)
    cells.push({ day: i, current: true });
  for (let i = 1; i <= totalCells - cells.length; i++)
    cells.push({ day: i, current: false });

  const weeks: typeof cells[] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));

  const totalThisMonth = Object.values(eventsByDay).reduce((a, b) => a + b.length, 0);

  return (
    <div style={{
      display: 'grid',
      gridTemplateColumns: '1fr 320px',
      background: '#ffffff',
      borderRadius: '20px',
      overflow: 'hidden',
      boxShadow: '0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      minHeight: '500px',
      border: '1px solid #e8e8f0',
    }}>

      {/* ── LEFT: Calendar ── */}
      <div style={{ padding: '28px 24px', borderRight: '1px solid #f0f0f8', background: '#fafafa' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <div style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '2.5px', color: '#7c6ff7', textTransform: 'uppercase', marginBottom: '5px' }}>
              All Events
            </div>
            <div style={{ fontSize: '24px', fontWeight: 700, color: '#1a1a2e', lineHeight: 1 }}>
              {MONTHS[month]}{' '}
              <span style={{ color: '#b0b0c8' }}>{year}</span>
            </div>
            <div style={{ fontSize: '12px', color: '#9090a8', marginTop: '4px' }}>
              {totalThisMonth} event{totalThisMonth !== 1 ? 's' : ''} this month
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {(['left', 'right'] as const).map(dir => (
              <button key={dir} onClick={() => navigate(dir)} style={{
                width: '34px', height: '34px', borderRadius: '10px',
                background: '#fff',
                border: '1.5px solid #e8e8f0',
                color: '#5a5a7a', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.15s', boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
              }}
                onMouseEnter={e => { e.currentTarget.style.background = '#f0edff'; e.currentTarget.style.borderColor = '#7c6ff7'; e.currentTarget.style.color = '#7c6ff7'; }}
                onMouseLeave={e => { e.currentTarget.style.background = '#fff'; e.currentTarget.style.borderColor = '#e8e8f0'; e.currentTarget.style.color = '#5a5a7a'; }}
              >
                {dir === 'left' ? <ChevronLeft size={15} /> : <ChevronRight size={15} />}
              </button>
            ))}
          </div>
        </div>

        {/* Filter pills */}
        <div style={{ display: 'flex', gap: '6px', marginBottom: '20px', flexWrap: 'wrap' }}>
          {(Object.entries(TYPE_CONFIG) as [keyof typeof TYPE_CONFIG, typeof TYPE_CONFIG[keyof typeof TYPE_CONFIG]][]).map(([type, cfg]) => {
            const active = activeFilters.has(type);
            return (
              <button key={type} onClick={() => toggleFilter(type)} style={{
                fontSize: '11px', fontWeight: 600,
                padding: '5px 12px', borderRadius: '20px', cursor: 'pointer',
                border: `1.5px solid ${active ? cfg.color : '#e0e0ee'}`,
                background: active ? cfg.bg : '#fff',
                color: active ? cfg.color : '#a0a0b8',
                transition: 'all 0.15s',
              }}>
                {cfg.label}
              </button>
            );
          })}
        </div>

        {/* Day headers */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', marginBottom: '6px' }}>
          {DAYS.map(d => (
            <div key={d} style={{
              textAlign: 'center', fontSize: '10px', fontWeight: 700,
              letterSpacing: '1px', color: '#c0c0d8', padding: '4px 0',
            }}>{d}</div>
          ))}
        </div>

        {/* Grid */}
        <div style={{
          opacity: animating ? 0 : 1,
          transform: animating ? `translateX(${animDir === 'right' ? '-10px' : '10px'})` : 'translateX(0)',
          transition: 'opacity 0.18s, transform 0.18s',
        }}>
          {weeks.map((week, wi) => (
            <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px', marginBottom: '3px' }}>
              {week.map((cell, ci) => {
                const events = cell.current ? (eventsByDay[cell.day] || []) : [];
                const hasEvents = events.length > 0;
                const isSel = cell.current && selectedDay === cell.day;
                const isTod = cell.current && isToday(cell.day);
                const dotColors = [...new Set(events.map(e => TYPE_CONFIG[e.type].color))].slice(0, 3);

                return (
                  <button key={ci} onClick={() => {
                    if (!cell.current) return;
                    setSelectedDay(isSel ? null : cell.day);
                  }} style={{
                    aspectRatio: '1',
                    borderRadius: '10px',
                    border: isTod
                      ? '2px solid #7c6ff7'
                      : isSel
                        ? '2px solid #c4bffa'
                        : '2px solid transparent',
                    background: isTod
                      ? '#7c6ff7'
                      : isSel
                        ? '#ede9fe'
                        : 'transparent',
                    color: !cell.current
                      ? '#d8d8e8'
                      : isTod
                        ? '#fff'
                        : isSel
                          ? '#7c6ff7'
                          : '#2d2d4a',
                    fontSize: '13px',
                    fontWeight: isTod ? 700 : isSel ? 600 : 400,
                    cursor: cell.current ? 'pointer' : 'default',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '3px', padding: '2px',
                    transition: 'all 0.12s', outline: 'none',
                  }}
                    onMouseEnter={e => { if (cell.current && !isSel && !isTod) e.currentTarget.style.background = '#f5f3ff'; }}
                    onMouseLeave={e => { if (cell.current && !isSel && !isTod) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <span style={{ lineHeight: 1 }}>{cell.day}</span>
                    {hasEvents && (
                      <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                        {dotColors.map((color, i) => (
                          <span key={i} style={{
                            width: '5px', height: '5px', borderRadius: '50%',
                            background: isTod ? 'rgba(255,255,255,0.85)' : color,
                            flexShrink: 0,
                          }} />
                        ))}
                        {events.length > 3 && (
                          <span style={{ fontSize: '8px', color: isTod ? 'rgba(255,255,255,0.7)' : '#a0a0b8', lineHeight: '5px' }}>+</span>
                        )}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ))}
        </div>

        {/* Legend */}
        <div style={{
          display: 'flex', gap: '14px', marginTop: '20px',
          paddingTop: '16px', borderTop: '1px solid #f0f0f8', flexWrap: 'wrap',
        }}>
          {(Object.entries(TYPE_CONFIG) as [keyof typeof TYPE_CONFIG, typeof TYPE_CONFIG[keyof typeof TYPE_CONFIG]][]).map(([type, cfg]) => (
            <div key={type} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: cfg.color, display: 'block' }} />
              <span style={{ fontSize: '11px', color: '#9090a8' }}>{cfg.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── RIGHT: Detail Panel ── */}
      <div style={{ display: 'flex', flexDirection: 'column', background: '#fff' }}>

        {/* Panel header */}
        <div style={{ padding: '28px 20px 16px', borderBottom: '1px solid #f0f0f8' }}>
          <div style={{ fontSize: '11px', fontWeight: 600, color: '#b0b0c8', letterSpacing: '1px', textTransform: 'uppercase', marginBottom: '4px' }}>
            {selectedDay ? `${MONTHS[month]} ${selectedDay}, ${year}` : 'No date selected'}
          </div>
          <div style={{ fontSize: '20px', fontWeight: 700, color: '#1a1a2e' }}>
            {selectedDay
              ? `${selectedEvents.length} Event${selectedEvents.length !== 1 ? 's' : ''}`
              : 'Pick a day'}
          </div>
        </div>

        {/* Event list */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>

          {!selectedDay && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', paddingTop: '60px', opacity: 0.4 }}>
              <span style={{ fontSize: '38px' }}>📅</span>
              <p style={{ color: '#5a5a7a', fontSize: '12px', textAlign: 'center', lineHeight: 1.6 }}>Click any date on<br />the calendar</p>
            </div>
          )}

          {selectedDay && selectedEvents.length === 0 && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '10px', paddingTop: '60px', opacity: 0.4 }}>
              <span style={{ fontSize: '38px' }}>✨</span>
              <p style={{ color: '#5a5a7a', fontSize: '12px', textAlign: 'center' }}>No events this day</p>
            </div>
          )}

          {selectedEvents.map((event, i) => {
            const cfg = TYPE_CONFIG[event.type];
            const Icon = cfg.icon;
            return (
              <div key={event.id} style={{
                background: cfg.light,
                border: `1px solid ${cfg.bg}`,
                borderLeft: `3px solid ${cfg.color}`,
                borderRadius: '12px',
                padding: '14px',
                animation: `fadeUp 0.25s ease ${i * 0.06}s both`,
              }}>
                {/* Badge */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '7px' }}>
                  <div style={{
                    width: '22px', height: '22px', borderRadius: '7px',
                    background: cfg.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Icon size={12} color={cfg.color} />
                  </div>
                  <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: cfg.color }}>
                    {cfg.label}
                  </span>
                </div>

                <div style={{ fontSize: '13px', fontWeight: 600, color: '#1a1a2e', marginBottom: '8px', lineHeight: 1.3 }}>
                  {event.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {event.subtitle && <InfoRow icon={<Clock size={11} color={cfg.color} />} text={event.subtitle} color="#5a5a7a" />}
                  {event.detail1 && <InfoRow icon={<MapPin size={11} color={cfg.color} />} text={event.detail1} color="#5a5a7a" />}
                  {event.detail2 && <InfoRow icon={<Building2 size={11} color={cfg.color} />} text={event.detail2} color="#5a5a7a" />}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

function InfoRow({ icon, text, color }: { icon: React.ReactNode; text: string; color: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
      {icon}
      <span style={{ fontSize: '11px', color, lineHeight: 1.3 }}>{text}</span>
    </div>
  );
}