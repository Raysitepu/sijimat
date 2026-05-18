import Link from 'next/link'
import { cookies } from 'next/headers'
import { createClient } from '@supabase/supabase-js'
import DashboardHeader from '../../components/DashboardHeader'
import EditImamProfileForm from '../../components/EditImamProfileForm'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const roleLabel = {
  admin: 'Admin',
  imam: 'Imam',
  user: 'User',
}

const dashboardByRole = {
  admin: '/dashboard',
  imam: '/dashboard-imam',
  user: '/dashboard-user',
}

function getSessionUserId() {
  const session = cookies().get('session')?.value || ''
  return session.startsWith('user-') ? session.replace('user-', '') : null
}

export default async function ProfilePage() {
  const role = cookies().get('session_role')?.value || 'user'
  const userId = getSessionUserId()

  const [{ data: user }, { data: imamProfiles }] = await Promise.all([
    userId
      ? supabase
        .from('users')
        .select('id, nama, email, role')
        .eq('id', userId)
        .maybeSingle()
      : Promise.resolve({ data: null }),
    userId
      ? supabase
        .from('imam')
        .select('id, nama, no_whatsapp, nama_masjid, ketersediaan')
        .eq('user_id', userId)
      : Promise.resolve({ data: [] }),
  ])

  const dashboardHref = dashboardByRole[role] || '/dashboard-user'

  return (
    <>
      <DashboardHeader role={role} />
      <main style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 1rem' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto', display: 'grid', gap: '1rem' }}>
          <section style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '1.5rem',
          }}>
            <p style={{ color: '#059669', fontSize: '0.82rem', fontWeight: '800', marginBottom: '0.35rem' }}>
              Profil Akun
            </p>
            <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: '#111827', marginBottom: '0.4rem' }}>
              {user?.nama || (role === 'admin' ? 'Admin Demo' : 'Pengguna SiJimat')}
            </h1>
            <p style={{ color: '#6b7280', marginBottom: '1rem' }}>
              Role aktif: <strong>{roleLabel[role] || 'User'}</strong>
            </p>

            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <Link
                href={dashboardHref}
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  background: '#059669',
                  color: 'white',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                }}
              >
                Kembali ke Dashboard
              </Link>
              <a
                href="/api/logout"
                style={{
                  padding: '0.6rem 1rem',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                  color: '#6b7280',
                  textDecoration: 'none',
                  fontWeight: '700',
                  fontSize: '0.9rem',
                }}
              >
                Keluar
              </a>
            </div>
          </section>

          <section style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '1.25rem',
          }}>
            <h2 style={{ color: '#111827', fontSize: '1.05rem', fontWeight: '800', marginBottom: '1rem' }}>
              Detail Akun
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.85rem' }}>
              <InfoCard label="Nama" value={user?.nama || (role === 'admin' ? 'Admin Demo' : '-')} />
              <InfoCard label="Email" value={user?.email || (role === 'admin' ? 'Login demo admin' : '-')} />
              <InfoCard label="Role" value={roleLabel[role] || 'User'} />
            </div>
          </section>

          <section style={{
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '14px',
            padding: '1.25rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap' }}>
              <h2 style={{ color: '#111827', fontSize: '1.05rem', fontWeight: '800' }}>
                Data Imam Terhubung
              </h2>
              {(role === 'imam' || role === 'admin') && (
                <Link href="/daftar-imam" style={{ color: '#059669', textDecoration: 'none', fontWeight: '800', fontSize: '0.86rem' }}>
                  Isi Data Imam
                </Link>
              )}
            </div>

            {!imamProfiles?.length ? (
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '1rem', color: '#6b7280' }}>
                Belum ada data imam yang terhubung dengan akun ini.
              </div>
            ) : (
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {imamProfiles.map((imam) => (
                  <EditImamProfileForm key={imam.id} imam={imam} />
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </>
  )
}

function InfoCard({ label, value }) {
  return (
    <div style={{ background: '#f9fafb', border: '1px solid #f3f4f6', borderRadius: '10px', padding: '0.9rem' }}>
      <div style={{ color: '#6b7280', fontSize: '0.78rem', fontWeight: '800', marginBottom: '0.25rem' }}>{label}</div>
      <div style={{ color: '#111827', fontWeight: '800', overflowWrap: 'anywhere' }}>{value}</div>
    </div>
  )
}
