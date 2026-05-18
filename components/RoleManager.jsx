'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { deleteUser, updateUserRole } from '../app/dashboard/actions'

const roleLabels = {
  user: 'User',
  imam: 'Imam',
  admin: 'Admin',
}

export default function RoleManager({ users }) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [roles, setRoles] = useState(() => (
    Object.fromEntries(users.map((user) => [user.id, user.role || 'user']))
  ))
  const [notice, setNotice] = useState(null)

  function handleChange(userId, nextRole) {
    const previousRole = roles[userId] || 'user'
    setRoles((current) => ({ ...current, [userId]: nextRole }))
    setNotice(null)

    startTransition(async () => {
      const result = await updateUserRole(userId, nextRole)

      if (result?.status === 'success') {
        setNotice({ type: 'success', message: result.message })
        router.refresh()
        return
      }

      setRoles((current) => ({ ...current, [userId]: previousRole }))
      setNotice({
        type: 'error',
        message: result?.message || 'Role gagal disimpan.',
      })
    })
  }

  function handleDelete(user) {
    if (!confirm(`Yakin hapus pengguna ${user.email}?`)) return

    setNotice(null)
    startTransition(async () => {
      const result = await deleteUser(user.id)
      setNotice({
        type: result?.status === 'success' ? 'success' : 'error',
        message: result?.message || 'Pengguna diproses.',
      })
      router.refresh()
    })
  }

  return (
    <section style={{
      background: 'white',
      borderRadius: '12px',
      border: '1px solid #e5e7eb',
      padding: '1.25rem',
      marginBottom: '1.5rem',
    }}>
      <div className="panel-heading-row" style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.05rem', fontWeight: '700', color: '#111827', marginBottom: '0.2rem' }}>
            Kelola Role Pengguna
          </h2>
          <p style={{ fontSize: '0.82rem', color: '#6b7280' }}>
            Admin bisa mengubah akun menjadi user, imam, atau admin.
          </p>
        </div>
        {isPending && <span style={{ fontSize: '0.78rem', color: '#059669', fontWeight: '700' }}>Menyimpan...</span>}
      </div>

      {notice && (
        <div style={{
          marginBottom: '1rem',
          padding: '0.7rem 0.85rem',
          borderRadius: '8px',
          border: `1px solid ${notice.type === 'success' ? '#a7f3d0' : '#fecaca'}`,
          background: notice.type === 'success' ? '#ecfdf5' : '#fef2f2',
          color: notice.type === 'success' ? '#065f46' : '#991b1b',
          fontSize: '0.84rem',
          fontWeight: '600',
        }}>
          {notice.message}
        </div>
      )}

      {users.length === 0 ? (
        <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>Belum ada pengguna terdaftar.</p>
      ) : (
        <div style={{ display: 'grid', gap: '0.75rem' }}>
          {users.map((user) => (
            <div
              key={user.id}
              className="role-user-row"
              style={{
                display: 'grid',
                gridTemplateColumns: 'minmax(0, 1fr) 150px auto',
                gap: '0.75rem',
                alignItems: 'center',
                padding: '0.85rem',
                borderRadius: '10px',
                background: '#f9fafb',
                border: '1px solid #f3f4f6',
              }}
            >
              <div style={{ minWidth: 0 }}>
                <div style={{ fontWeight: '700', color: '#111827', fontSize: '0.92rem' }}>
                  {user.nama || 'Tanpa nama'}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.8rem', overflowWrap: 'anywhere' }}>
                  {user.email}
                </div>
              </div>

              <select
                value={roles[user.id] || 'user'}
                onChange={(event) => handleChange(user.id, event.target.value)}
                disabled={isPending}
                aria-label={`Ubah role ${user.email}`}
                style={{
                  width: '100%',
                  padding: '0.55rem 0.7rem',
                  borderRadius: '8px',
                  border: '1px solid #d1d5db',
                  background: 'white',
                  color: '#111827',
                  fontWeight: '600',
                }}
              >
                {Object.entries(roleLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
              <button
                type="button"
                onClick={() => handleDelete(user)}
                disabled={isPending}
                style={{
                  border: '1px solid #fecaca',
                  background: '#fef2f2',
                  color: '#b91c1c',
                  borderRadius: '8px',
                  padding: '0.55rem 0.75rem',
                  fontWeight: '700',
                  cursor: isPending ? 'not-allowed' : 'pointer',
                }}
              >
                Hapus
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  )
}
