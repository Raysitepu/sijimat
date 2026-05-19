import { createClient } from '@supabase/supabase-js'
import { unstable_noStore as noStore } from 'next/cache'
import DashboardHeader from '../../components/DashboardHeader'
import AdminDashboard from '../../components/AdminDashboard'

export const dynamic = 'force-dynamic'
export const revalidate = 0

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export default async function DashboardPage({ searchParams }) {
  noStore()

  const query = searchParams?.q || ''

  let supabaseQuery = supabase
    .from('imam')
    .select('*')
    .order('created_at', { ascending: false })

  if (query) {
    supabaseQuery = supabaseQuery.ilike('nama', `%${query}%`)
  }

  let [{ data: imams }, { data: users }, scheduleResult] = await Promise.all([
    supabaseQuery,
    supabase
      .from('users')
      .select('id, nama, email, role')
      .order('nama', { ascending: true }),
    supabase
      .from('jadwal')
      .select('id, malam, tanggal, waktu, rakaat, nama_masjid, catatan, status, imam_id, imam:imam_id(id, nama, no_whatsapp, nama_masjid)')
      .order('malam', { ascending: true }),
  ])

  if (scheduleResult.error) {
    scheduleResult = await supabase
      .from('jadwal')
      .select('id, malam, tanggal, waktu, rakaat, nama_masjid, catatan, status, imam_id')
      .order('malam', { ascending: true })
  }

  return (
    <>
      <DashboardHeader role="admin" />
      <main style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
        <AdminDashboard
          users={users || []}
          imams={imams || []}
          schedules={scheduleResult.data || []}
          scheduleError={scheduleResult.error?.message || ''}
          query={query}
        />
      </main>
    </>
  )
}
