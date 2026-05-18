'use client'

import Link from 'next/link'
import { useState } from 'react'
import DashboardClient from './DashboardClient'
import RoleManager from './RoleManager'
import ScheduleManager from './ScheduleManager'

const tabs = [
  { id: 'users', label: 'Pengguna' },
  { id: 'imams', label: 'Imam' },
  { id: 'schedules', label: 'Jadwal' },
]

export default function AdminDashboard({ users, imams, schedules, scheduleError, query }) {
  const [activeTab, setActiveTab] = useState('users')

  const stats = [
    { label: 'Pengguna', value: users.length },
    { label: 'Imam', value: imams.length },
    { label: 'Jadwal', value: schedules.length },
  ]

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <div className="admin-heading-row" style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: '1rem',
        flexWrap: 'wrap',
        marginBottom: '1.25rem',
      }}>
        <div>
          <p style={{ color: '#059669', fontSize: '0.82rem', fontWeight: '800', marginBottom: '0.35rem' }}>
            Admin Panel
          </p>
          <h1 style={{ fontSize: '1.8rem', lineHeight: 1.2, fontWeight: '800', color: '#111827' }}>
            Dashboard SiJimat
          </h1>
          <p style={{ color: '#6b7280', fontSize: '0.92rem', marginTop: '0.35rem' }}>
            Kelola role, data imam, dan jadwal tarawih dari satu tempat.
          </p>
        </div>

        <Link
          href="/daftar-imam"
          style={{
            padding: '0.65rem 1rem',
            borderRadius: '8px',
            background: '#059669',
            color: 'white',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: '700',
          }}
        >
          + Daftar Imam
        </Link>
      </div>

      <div className="admin-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.85rem', marginBottom: '1.25rem' }}>
        {stats.map((stat) => (
          <div key={stat.label} style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1rem',
          }}>
            <div style={{ color: '#6b7280', fontSize: '0.78rem', fontWeight: '700' }}>{stat.label}</div>
            <div style={{ color: '#111827', fontSize: '1.55rem', fontWeight: '800', lineHeight: 1.2 }}>{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="admin-tabs" style={{
        background: 'white',
        border: '1px solid #e5e7eb',
        borderRadius: '12px',
        padding: '0.35rem',
        display: 'flex',
        gap: '0.35rem',
        marginBottom: '1rem',
      }}>
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: 1,
              border: 'none',
              borderRadius: '8px',
              padding: '0.7rem 0.85rem',
              cursor: 'pointer',
              background: activeTab === tab.id ? '#059669' : 'transparent',
              color: activeTab === tab.id ? 'white' : '#374151',
              fontWeight: '800',
              fontSize: '0.9rem',
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'users' && <RoleManager users={users} />}
      {activeTab === 'imams' && <DashboardClient imams={imams} query={query} />}
      {activeTab === 'schedules' && (
        <ScheduleManager
          imams={imams}
          schedules={schedules}
          scheduleError={scheduleError}
        />
      )}
    </div>
  )
}
