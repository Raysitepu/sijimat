'use server'

import { createClient } from '@supabase/supabase-js'
import { createHash } from 'crypto'
import { z } from 'zod'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

const RegisterSchema = z.object({
  nama: z.string().min(3, 'Nama minimal 3 karakter').max(100, 'Nama terlalu panjang'),
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(8, 'Password minimal 8 karakter'),
})

export async function registerUser(prevState, formData) {
  const rawData = {
    nama: formData.get('nama'),
    email: formData.get('email'),
    password: formData.get('password'),
  }

  const validated = RegisterSchema.safeParse(rawData)

  if (!validated.success) {
    const fieldErrors = {}
    validated.error.errors.forEach((err) => {
      const field = err.path[0]
      fieldErrors[field] = err.message
    })

    return {
      status: 'error',
      message: 'Periksa kembali data yang Anda isi.',
      fieldErrors,
    }
  }

  const passwordHash = createHash('sha256').update(validated.data.password).digest('hex')

  const { error } = await supabase.from('users').insert([{
    nama: validated.data.nama,
    email: validated.data.email.toLowerCase(),
    password_hash: passwordHash,
    role: 'user',
  }])

  if (error) {
    if (error.code === '23505') {
      return {
        status: 'error',
        message: 'Email sudah terdaftar, silakan gunakan email lain.',
        fieldErrors: { email: 'Email ini sudah digunakan' },
      }
    }

    return {
      status: 'error',
      message: 'Gagal membuat akun. Cek konfigurasi tabel users di Supabase.',
      fieldErrors: {},
    }
  }

  return {
    status: 'success',
    message: 'Akun berhasil dibuat. Silakan masuk menggunakan akun Anda.',
    fieldErrors: {},
  }
}
