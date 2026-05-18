import ContactForm from '@/components/ContactForm'
import RevealAnimation from '@/components/RevealAnimation'

export const metadata = {
  title: 'Kontak – SiJimat',
}

export default function ContactPage() {
  return (
    <main style={{ padding: 'clamp(4rem,10vw,7rem) 0' }}>
      <RevealAnimation />
      <div className="container">

        <div className="section-head reveal">
          <div className="section-badge">Kontak</div>
          <h1 className="section-title">Ada Pertanyaan?<br />Kami Siap Membantu</h1>
        </div>

        <div style={{ maxWidth: '560px', margin: '3rem auto 0' }}>
          <ContactForm />
        </div>

      </div>
    </main>
  )
}