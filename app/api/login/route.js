// app/api/login/route.js
// API route login admin + user biasa

import { NextResponse } from 'next/server'
import { createHash } from 'crypto'
import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

export async function POST(request) {
  const body = await request.json().catch(() => null)
  const identifier = body?.identifier?.toString().trim()
  const password = body?.password?.toString() || ''

  if (!identifier || !password) {
    return NextResponse.json(
      { success: false, message: 'Email/username dan password wajib diisi.' },
      { status: 400 }
    )
  }

  let sessionValue = ''
  let role = ''

  // Fallback login admin demo lama
  if (identifier === 'admin' && password === 'sijimat123') {
    sessionValue = 'admin-sijimat'
    role = 'admin'
  } else {
    const passwordHash = createHash('sha256').update(password).digest('hex')
    const normalizedEmail = identifier.toLowerCase()

    const { data: user, error } = await supabase
      .from('users')
      .select('id, email, password_hash, role')
      .eq('email', normalizedEmail)
      .maybeSingle()

    if (error || !user || user.password_hash !== passwordHash) {
      return NextResponse.json(
        { success: false, message: 'Email/username atau password salah.' },
        { status: 401 }
      )
    }

    sessionValue = `user-${user.id}`
    role = user.role || 'user'
  }

  const response = NextResponse.json({ success: true, role })

  // Set cookie session selama 1 hari
  response.cookies.set('session', sessionValue, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 hari
    path: '/',
  })
  response.cookies.set('session_role', role, {
    httpOnly: true,
    maxAge: 60 * 60 * 24, // 1 hari
    path: '/',
  })

  return response
}

export async function DELETE() {
  const response = NextResponse.json({ success: true })

  // Hapus cookie saat logout
  response.cookies.delete('session')
  response.cookies.delete('session_role')

  return response
}
