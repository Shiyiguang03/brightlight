'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';

const STATUS_STEPS = [
  { name: 'Received', icon: 'package' },
  { name: 'Diagnosed', icon: 'magnifier' },
  { name: 'Repairing', icon: 'wrench' },
  { name: 'Ready', icon: 'box' },
  { name: 'Collected', icon: 'check' },
];

function getStepIndex(status: string): number {
  const stepNames = STATUS_STEPS.map(s => s.name);
  switch (status) {
    case 'Pending':      return 0;
    case 'Diagnosed':    return stepNames.indexOf('Diagnosed');
    case 'In Progress':  return stepNames.indexOf('Repairing');
    case 'Ready':        return stepNames.indexOf('Ready');
    case 'Completed':
    case 'Done':         return stepNames.length - 1;
    default:             return 0;
  }
}

function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { label: string; bgColor: string; textColor: string }> = {
    Pending: {
      label: 'Pending',
      bgColor: 'bg-blue-100',
      textColor: 'text-blue-700',
    },
    'In Progress': {
      label: 'In Progress',
      bgColor: 'bg-amber-100',
      textColor: 'text-amber-700',
    },
    Completed: {
      label: 'Done',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
    },
    Done: {
      label: 'Done',
      bgColor: 'bg-green-100',
      textColor: 'text-green-700',
    },
  };

  const cfg = config[status] ?? config['Pending'];

  return (
    <span className={`inline-flex items-center px-4 py-2 rounded-full text-xs font-semibold ${cfg.bgColor} ${cfg.textColor} border ${cfg.bgColor === 'bg-blue-100' ? 'border-blue-300' : cfg.bgColor === 'bg-amber-100' ? 'border-amber-300' : 'border-green-300'}`}>
      {cfg.label}
    </span>
  );
}

function StepIcon({ type, isActive, isDone }: { type: string; isActive: boolean; isDone: boolean }) {
  const iconProps = {
    viewBox: '0 0 24 24',
    width: 16,
    height: 16,
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const getIcon = () => {
    switch (type) {
      case 'package':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <line x1="16.5" y1="9.4" x2="7.5" y2="4.21" />
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
            <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
            <line x1="12" y1="22.08" x2="12" y2="12" />
          </svg>
        );
      case 'magnifier':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.35-4.35" />
          </svg>
        );
      case 'wrench':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 1 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
          </svg>
        );
      case 'box':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
        );
      case 'check':
        return (
          <svg {...iconProps} viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
          </svg>
        );
      default:
        return null;
    }
  };

  return getIcon();
}

function ProgressTracker({ status }: { status: string }) {
  const activeIndex = getStepIndex(status);
  const isDone = status === 'Completed' || status === 'Done';

  return (
    <div className="mt-6 pt-4">
      <div className="flex items-start justify-between">
        {STATUS_STEPS.map((step, i) => {
          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;

          let dotClass = '';
          let textColor = '';

          if (isDone) {
            dotClass = 'bg-green-600 border-2 border-green-600 text-white';
            textColor = 'text-slate-700';
          } else if (isCompleted) {
            dotClass = 'bg-blue-600 border-2 border-blue-600 text-white';
            textColor = 'text-slate-700';
          } else if (isActive) {
            dotClass = 'bg-blue-50 border-2 border-blue-600 text-blue-600';
            textColor = 'text-slate-700';
          } else {
            dotClass = 'bg-slate-100 border-2 border-slate-200 text-slate-300';
            textColor = 'text-slate-500';
          }

          return (
            <div key={step.name} className="flex flex-col items-center flex-1">
              <div className={`w-9 h-9 rounded-full flex items-center justify-center ${dotClass}`}>
                <StepIcon type={step.icon} isActive={isActive} isDone={isDone} />
              </div>
              <span className={`text-xs font-medium mt-2 text-center ${textColor}`}>
                {step.name}
              </span>
            </div>
          );
        })}
      </div>

      {/* Connector Line */}
      <div className="flex mt-2">
        {STATUS_STEPS.map((_, i) => {
          if (i >= STATUS_STEPS.length - 1) return null;

          const isCompleted = i < activeIndex;
          const isActive = i === activeIndex;
          const connectorClass = isDone
            ? 'bg-green-500'
            : isCompleted || isActive
            ? 'bg-blue-500'
            : 'bg-slate-200';

          return (
            <div key={`connector-${i}`} className="flex-1 px-1">
              <div className={`h-1 rounded-full ${connectorClass}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default function MyRepairsPage() {
  const [repairs, setRepairs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepairs = async () => {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        setLoading(false);
        return;
      }

      const user = JSON.parse(storedUser);

      try {
        const res = await fetch(`/api/my-repairs?userId=${user.id}`);
        const data = await res.json();
        setRepairs(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchRepairs();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Loading your repair requests...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased pb-20">
      <Navbar />

      <div className="max-w-4xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-10 flex-wrap gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">My Repair Requests</h1>
            <p className="text-slate-500 mt-1 text-sm">Track the live progress of your devices</p>
          </div>
          <Link
            href="/request-repair"
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all shadow-sm whitespace-nowrap"
          >
            <span>+</span> New Repair Request
          </Link>
        </div>

        {repairs.length > 0 ? (
          <div className="flex flex-col gap-4">
            {repairs.map((repair) => {
              const currentStatus = repair.status || 'Pending';

              return (
                <div
                  key={repair.id}
                  className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow duration-200"
                >
                  {/* Header Row */}
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-6 mb-3">
                        <h2 className="font-bold text-lg text-slate-900 capitalize">
                          {repair.brand} {repair.model}
                        </h2>
                        <StatusBadge status={currentStatus} />
                      </div>
                    </div>

                    {/* Date */}
                    <div className="text-slate-600 text-sm md:text-right">
                      <span className="text-slate-500">Submitted on </span>
                      <span className="font-semibold text-slate-900">
                        {new Date(repair.createdAt).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {/* Device Details */}
                  <div className="space-y-2 mb-5">
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-800">Device Type:</span> {repair.deviceType}
                    </p>
                    <p className="text-sm text-slate-700">
                      <span className="font-semibold text-slate-800">Problem:</span> {repair.problemDescription}
                    </p>
                  </div>

                  {/* Divider */}
                  <div className="border-t border-slate-100 mb-4" />

                  {/* Progress Tracker */}
                  <ProgressTracker status={currentStatus} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl shadow-sm">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <p className="text-slate-500 font-medium mb-4">You haven't submitted any repair requests yet.</p>
            <Link
              href="/request-repair"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-xl font-semibold inline-block transition text-sm"
            >
              Submit Your First Request
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}