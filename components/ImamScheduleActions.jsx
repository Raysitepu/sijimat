'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import { confirmMyJadwal } from '../app/dashboard/actions'

export default function ImamScheduleActions({ scheduleId }) {
  const router = useRouter()
  const [notice, setNotice] = useState(null)
  const [isPending, startTransition] = useTransition()

  function submitStatus(status) {
    setNotice(null)
    startTransition(async () => {
      const result = await confirmMyJadwal(scheduleId, status)
      setNotice({
        type: result?.status === 'success' ? 'success' : 'error',
        message: result?.message || 'Konfirmasi diproses.',
      })
      router.refresh()
    })
  }

  return (
    <div style={{ display: 'grid', gap: '0.55rem' }}>
      <p style={{ color: '#6b7280', fontSize: '0.78rem', fontWeight: '600' }}>
        Konfirmasi ke admin apakah Anda bisa hadir atau berhalangan.
      </p>
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          type="button"
          disabled={isPending}
          onClick={() => submitStatus('dikonfirmasi')}
          style={{
            border: 'none',
            borderRadius: '8px',
            padding: '0.45rem 0.75rem',
            background: '#059669',
            color: 'white',
            fontWeight: '800',
            cursor: isPending ? 'not-allowed' : 'pointer',
          }}
        >
          Bisa Hadir
        </button>
        <button
          type="button"
          disabled={isPending}
          onClick={() => submitStatus('berhalangan')}
          style={{
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '0.45rem 0.75rem',
            background: '#fef2f2',
            color: '#b91c1c',
            fontWeight: '800',
            cursor: isPending ? 'not-allowed' : 'pointer',
          }}
        >
          Berhalangan
        </button>
      </div>
      {notice && (
        <p style={{
          color: notice.type === 'success' ? '#047857' : '#b91c1c',
          fontSize: '0.78rem',
          fontWeight: '700',
        }}>
          {notice.message}
        </p>
      )}
    </div>
  )
}
