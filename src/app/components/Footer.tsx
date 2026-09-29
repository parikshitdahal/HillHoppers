import Link from 'next/link'
import { Facebook, Instagram, Mail, Phone } from 'lucide-react'
import Image from 'next/image'

export default function Footer() {
  return (
    <footer className="mt-14 border-t border-[rgba(17,24,39,0.08)] bg-[linear-gradient(180deg,#eef7fc_0%,#f9fcff_100%)] pt-14 pb-6 text-[var(--muted)]">
      <div className="mx-auto grid max-w-7xl gap-8 px-6 md:grid-cols-4">

        {/* Logo & Intro */}
        <div className="flex flex-col items-start">
          <div className="flex items-center space-x-2 mb-3">
            <Image src="/logo.svg" alt="HillHoppers Logo" width={40} height={40} className="rounded-full shadow-[0_14px_28px_rgba(0,136,204,0.14)]" />
            <div>
              <p className="text-2xl font-bold text-[var(--text-dark)]">HillHoppers</p>
            </div>
          </div>
          <p className="max-w-xs text-sm leading-6 text-[var(--muted)]">
            Curated mountain journeys across Sikkim and the Eastern Himalayas, shaped with local insight, flexible planning, and a calmer pace.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="mb-3 text-lg font-semibold text-[var(--text-dark)]">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link href="/packages" className="hover:text-[var(--accent)] transition">Packages</Link></li>
            <li><Link href="/destinations" className="hover:text-[var(--accent)] transition">Destinations</Link></li>
            <li><Link href="/about" className="hover:text-[var(--accent)] transition">About Us</Link></li>
            <li><Link href="/contacts" className="hover:text-[var(--accent)] transition">Contact</Link></li>
          </ul>
        </div>

        {/* Contact Info */}
        <div>
          <h4 className="mb-3 text-lg font-semibold text-[var(--text-dark)]">Contact</h4>
          <ul className="space-y-2 text-sm text-[var(--muted)]">
            <li className="flex items-start gap-2">
              <Phone size={16} className="mt-1" /> <span>+91 7797889051</span>
            </li>
            <li className="flex items-start gap-2">
              <Mail size={16} className="mt-1" /> <span>bagaichafarmsandventures@gmail.com</span>
            </li>
            <li>
              📍 Gangtok, Sikkim
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div>
          <h4 className="mb-3 text-lg font-semibold text-[var(--text-dark)]">Follow Us</h4>
          <div className="flex space-x-4">
            <a href="https://facebook.com" target="_blank" rel="noreferrer" className="rounded-full border border-[rgba(17,24,39,0.08)] bg-white p-3 transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
              <Facebook className="transition" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="rounded-full border border-[rgba(17,24,39,0.08)] bg-white p-3 transition hover:border-[var(--accent)] hover:text-[var(--accent)]">
              <Instagram className="transition" />
            </a>
          </div>
        </div>
      </div>

      {/* Copyright */}
      <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-3 border-t border-[rgba(17,24,39,0.08)] px-6 pt-6 text-xs text-[var(--muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>Crafted for mountain journeys, local stories, and mindful travel.</p>
        © {new Date().getFullYear()} HillHoppers. All rights reserved.
      </div>
    </footer>
  )
}
