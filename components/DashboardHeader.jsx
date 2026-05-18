import Link from 'next/link'

const navByRole = {
  admin: [
    { href: '/dashboard', label: 'Dashboard Admin' },
    { href: '/daftar-imam', label: 'Daftar Imam' },
    { href: '/jadwal', label: 'Jadwal Publik' },
    { href: '/profile', label: 'Profil', icon: 'account' },
  ],
  imam: [
    { href: '/dashboard-imam', label: 'Dashboard Imam' },
    { href: '/daftar-imam', label: 'Data Imam' },
    { href: '/jadwal', label: 'Jadwal Publik' },
    { href: '/profile', label: 'Profil', icon: 'account' },
  ],
  user: [
    { href: '/dashboard-user', label: 'Dashboard User' },
    { href: '/jadwal', label: 'Jadwal Publik' },
    { href: '/profile', label: 'Profil', icon: 'account' },
  ],
}

export default function DashboardHeader({ role = 'user', title = 'SiJimat' }) {
  const links = navByRole[role] || navByRole.user

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 20,
      background: 'white',
      borderBottom: '1px solid #e5e7eb',
      boxShadow: '0 1px 8px rgba(15, 23, 42, 0.06)',
    }}>
      <div style={{
        maxWidth: '1100px',
        margin: '0 auto',
        minHeight: '64px',
        padding: '0.75rem 1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        flexWrap: 'wrap',
      }}>
        <Link href={role === 'admin' ? '/dashboard' : role === 'imam' ? '/dashboard-imam' : '/dashboard-user'} style={{
          color: '#111827',
          textDecoration: 'none',
          fontWeight: '800',
          fontSize: '1rem',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
        }}>
          <img
            src="/logo.png"
            alt="SiJimat"
            width="34"
            height="34"
            style={{
              width: '34px',
              height: '34px',
              borderRadius: '8px',
              objectFit: 'cover',
              flexShrink: 0,
            }}
          />
          <span>{title}</span>
        </Link>

        <div role="navigation" aria-label="Navigasi dashboard" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              title={link.label}
              aria-label={link.label}
              style={{
                color: '#374151',
                textDecoration: 'none',
                fontSize: '0.86rem',
                fontWeight: '600',
                width: link.icon ? '36px' : 'auto',
                height: link.icon ? '36px' : 'auto',
                borderRadius: link.icon ? '999px' : 0,
                border: link.icon ? '1px solid #e5e7eb' : 'none',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {link.icon ? <AccountIcon /> : link.label}
            </Link>
          ))}
          <a
            href="/api/logout"
            style={{
              padding: '0.45rem 0.85rem',
              borderRadius: '8px',
              border: '1px solid #e5e7eb',
              color: '#6b7280',
              textDecoration: 'none',
              fontSize: '0.86rem',
              fontWeight: '600',
            }}
          >
            Keluar
          </a>
        </div>
      </div>
    </header>
  )
}

function AccountIcon() {
  return (
    <span aria-hidden="true" style={{
      width: '16px',
      height: '16px',
      borderRadius: '999px',
      border: '2px solid currentColor',
      display: 'inline-block',
      position: 'relative',
    }}>
      <span style={{
        position: 'absolute',
        left: '50%',
        top: '3px',
        width: '4px',
        height: '4px',
        borderRadius: '999px',
        background: 'currentColor',
        transform: 'translateX(-50%)',
      }} />
      <span style={{
        position: 'absolute',
        left: '50%',
        bottom: '3px',
        width: '8px',
        height: '4px',
        borderRadius: '999px 999px 0 0',
        background: 'currentColor',
        transform: 'translateX(-50%)',
      }} />
    </span>
  )
}
