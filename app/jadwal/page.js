import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import PublicSchedule from '../../components/PublicSchedule'
import DashboardHeader from '../../components/DashboardHeader'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const sampleImams = [
  { id: 'abad-badrussalam', imam: 'Ust. Abad Badrussalam', rakaat: 11, waktu: '19.30 WIB', nama_masjid: 'Masjid Al-Ikhlas' },
  { id: 'zaenal-abidin', imam: 'Ust. Zaenal Abidin', rakaat: 11, waktu: '19.30 WIB', nama_masjid: 'Masjid Al-Ikhlas' },
  { id: 'abdullah-fauzi', imam: 'Ust. Abdullah Fauzi', rakaat: 11, waktu: '19.30 WIB', nama_masjid: 'Masjid Al-Ikhlas' },
  { id: 'iwan', imam: 'Ust. Iwan', rakaat: 11, waktu: '19.30 WIB', nama_masjid: 'Masjid Al-Ikhlas' },
]

const fallbackSchedules = Array.from({ length: 30 }, (_, index) => ({
  ...sampleImams[index % sampleImams.length],
  id: `sample-${index + 1}`,
  malam: index + 1,
}))

export default async function JadwalPage() {
  const role = cookies().get('session_role')?.value
  const isLoggedIn = Boolean(cookies().get('session')?.value)
  const dashboardHome = role === 'admin' ? '/dashboard' : role === 'imam' ? '/dashboard-imam' : '/dashboard-user'

  const { data: schedules } = await supabase
    .from('jadwal')
    .select('id, malam, tanggal, waktu, rakaat, nama_masjid, catatan, status, imam:imam_id(id, nama, nama_masjid)')
    .order('malam', { ascending: true })

  return (
    <>
      {isLoggedIn && (
        <DashboardHeader role={role || 'user'} />
      )}
      <main style={{ padding: isLoggedIn ? '2rem 1rem' : '4rem 0', background: '#f8fafc', minHeight: '100vh' }}>
        <div className="container">
          <Link
            href={isLoggedIn ? dashboardHome : '/'}
            style={{ color: 'var(--accent-teal)', textDecoration: 'none', fontWeight: 700 }}
          >
            {isLoggedIn ? 'Kembali ke Dashboard' : 'Kembali ke Beranda'}
          </Link>

          <div style={{ marginTop: '2rem' }}>
            <PublicSchedule schedules={schedules || []} fallbackSchedules={fallbackSchedules} title="Jadwal Lengkap 30 Malam" />
          </div>
        </div>
      </main>
    </>
  )
}
