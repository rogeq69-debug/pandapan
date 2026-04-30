'use client'

import Image from 'next/image'

export default function Hero() {
  const scrollToCatalog = () => {
    document.getElementById('catalogo')?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="relative flex min-h-[80svh] flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#FFF5E1] via-[#FDDDB0] to-[#E8532A] px-6 text-center md:min-h-screen">
      {/* Logo */}
      <div className="mb-6 flex items-center justify-center">
        <Image
          src="/branding/logo.png"
          alt="PandaPan Panadería Artesanal"
          width={320}
          height={120}
          priority
          className="w-[200px] drop-shadow-lg sm:w-[260px] md:w-[320px]"
        />
      </div>

      {/* Tagline */}
      <p
        className="mb-3 font-serif text-4xl font-bold leading-tight tracking-tight text-[#2D1B0E] sm:text-5xl md:text-6xl"
        style={{ fontFamily: 'var(--font-serif, serif)' }}
      >
        El pan que merece
        <br />
        <span className="text-white drop-shadow">tu mesa.</span>
      </p>

      <p className="mb-8 max-w-xs text-base text-[#2D1B0E]/70 sm:max-w-sm sm:text-lg">
        Horneado a diario con ingredientes seleccionados. Pedí por WhatsApp y lo recibís fresco.
      </p>

      {/* CTA */}
      <button
        onClick={scrollToCatalog}
        className="min-h-[52px] rounded-full bg-white px-8 py-3 text-lg font-semibold text-[#E8532A] shadow-lg transition-transform active:scale-95 hover:scale-105 hover:shadow-xl"
      >
        Ver Catálogo →
      </button>

      {/* Onda decorativa inferior */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M0 60 C360 0 1080 0 1440 60 L1440 60 L0 60 Z"
            fill="#FFF5E1"
          />
        </svg>
      </div>
    </section>
  )
}
