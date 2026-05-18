import './globals.css'
import AppChrome from '../components/AppChrome'

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3001'),
  title: {
    default: 'SiJimat',
    template: '%s | SiJimat',
  },
  applicationName: 'SiJimat',
  description: 'Kelola jadwal imam tarawih masjid Anda dengan mudah dan otomatis.',
  icons: {
    icon: '/logo.png',
    shortcut: '/logo.png',
    apple: '/logo.png',
  },
  openGraph: {
    title: 'SiJimat',
    siteName: 'SiJimat',
    description: 'Kelola jadwal imam tarawih masjid Anda dengan mudah dan otomatis.',
    images: ['/logo.png'],
  },
}

export default function RootLayout({ children }) {
  return (
    <html lang="id">
      <body>
        <AppChrome>{children}</AppChrome>
      </body>
    </html>
  )
}
