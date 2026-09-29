'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import SuccessModal from '@/app/components/SuccessModal';

const destinations = [
  { name: 'Gangtok', img: '/destinations/gangtok.jpg' },
  { name: 'North Sikkim', img: '/destinations/north-hero.jpg' },
  { name: 'South Sikkim', img: '/destinations/south.jpeg' },
  { name: 'West Sikkim', img: '/destinations/west.jpg' },
  { name: 'East Sikkim', img: '/destinations/east.jpg' },
  { name: 'Pelling', img: '/destinations/west2.jpg' },
  { name: 'Lachung', img: '/destinations/lachung.jpeg' },
  { name: 'Yumthang Valley', img: '/destinations/north-hero.jpg' },
  { name: 'Rabong', img: '/destinations/namchi.jpg' },
  { name: 'Nathula Pass', img: '/destinations/tasngo.jpg' },
];

export default function CustomPackagePage() {
  const today = new Date().toISOString().split('T')[0];
  const [form, setForm] = useState({
    destinations: [] as string[],
    days: '',
    startDate: '',
    endDate: '',
    stayType: '',
    message: '',
    name: '',
    email: '',
    phone: '',
  });

  const [status, setStatus] = useState<'idle'|'loading'|'success'|'error'>('idle');
  const [error, setError] = useState('');

  const toggleDestination = (place: string) => {
    setForm(prev => ({
      ...prev,
      destinations: prev.destinations.includes(place)
        ? prev.destinations.filter(p => p !== place)
        : [...prev.destinations, place],
    }));
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.destinations.length === 0) {
      setStatus('error');
      setError('Please select at least one destination before sending your custom enquiry.');
      return;
    }

    setStatus('loading');

    try {
      const res = await fetch('/api/mail/custom', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (res.ok && json.success) {
        setStatus('success');
        setForm({
          destinations: [],
          days: '',
          startDate: '',
          endDate: '',
          stayType: '',
          message: '',
          name: '',
          email: '',
          phone: '',
        });
      } else {
        setStatus('error');
        setError(json.error || 'Failed to submit custom package.');
      }
    } catch {
      setStatus('error'); setError('Network or server error');
    }
  };

  return (
    <div className="bg-page min-h-screen pt-24 px-4 sm:px-6 md:px-20 pb-16">
      <SuccessModal
        open={status==='success'}
        title="Thank you, your custom trip request is with us"
        message="We will study your destinations, dates, and preferences, then get back with a thoughtful HillHoppers plan."
        onClose={() => setStatus('idle')}
      />
      <div className="card-shell mx-auto mb-10 max-w-4xl rounded-[1.8rem] p-8 text-center">
        <p className="eyebrow mb-3">Made Around You</p>
        <h1 className="section-title text-3xl md:text-4xl">Plan A Journey Around Your Own Brief</h1>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">
          Select the regions, dates, stay style, and pace you have in mind, and we&apos;ll turn that into a practical itinerary designed to travel well.
        </p>
      </div>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-shell max-w-4xl mx-auto rounded-[1.8rem] p-5 sm:p-8 md:p-12"
      >
        {status==='error' && <div className="mb-4 rounded-xl border border-[rgba(255,77,109,0.24)] bg-[rgba(255,77,109,0.1)] px-4 py-3 text-center text-[var(--pink)]">{error}</div>}

        <form onSubmit={onSubmit} className="space-y-8">
          {/* Pick Destinations */}
          <div>
            <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <h2 className="text-xl font-semibold text-[var(--accent)]">Select Your Destinations</h2>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Required</p>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {destinations.map(({ name, img }) => (
                <motion.div
                  key={name}
                  whileHover={{ scale: 1.03 }}
                  onClick={() => toggleDestination(name)}
                className={`cursor-pointer rounded-[1.2rem] p-2 text-center font-medium shadow-md transition-all hover:-translate-y-1 hover:shadow-lg ${
                    form.destinations.includes(name)
                      ? 'bg-[linear-gradient(180deg,rgba(0,136,204,0.44),rgba(11,29,42,0.92))] text-white ring-2 ring-[var(--accent)]'
                      : 'border border-[rgba(17,24,39,0.08)] bg-white text-[var(--text-dark)]'
                  }`}
                >
                  <Image
                    src={img}
                    alt={name}
                    width={160}
                    height={100}
                    quality={95}
                    className="mx-auto mb-2 rounded-md object-cover h-[72px] w-full max-w-[140px]"
                    sizes="140px"
                  />
                  {name}
                </motion.div>
              ))}
            </div>
            {status==='error' && error.includes('destination') && (
              <p className="mt-3 rounded-xl border border-[rgba(255,77,109,0.24)] bg-[rgba(255,77,109,0.1)] px-4 py-3 text-sm text-[var(--pink)]">
                {error}
              </p>
            )}
          </div>

          {/* Days & Stay Type */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Preferred Trip Length</label>
              <input
                type="number"
                name="days"
                value={form.days}
                onChange={onChange}
                className="input-brand w-full p-3"
                placeholder="For example, 5"
                required
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Preferred Stay Style</label>
              <select
                name="stayType"
                value={form.stayType}
                onChange={onChange}
                className="input-brand w-full p-3"
              >
                <option value="">No preference yet</option>
                <option value="Budget">Budget</option>
                <option value="Standard">Standard</option>
                <option value="Premium">Premium</option>
                <option value="Luxury">Luxury</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Travel Start Date</label>
              <input
                type="date"
                name="startDate"
                min={today}
                value={form.startDate}
                onChange={onChange}
                className="input-brand w-full p-3"
              />
            </div>
            <div>
              <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Travel End Date</label>
              <input
                type="date"
                name="endDate"
                min={form.startDate || today}
                value={form.endDate}
                onChange={onChange}
                className="input-brand w-full p-3"
              />
            </div>
          </div>

          {/* Additional Message */}
          <div>
            <label className="mb-2 block text-sm font-semibold uppercase tracking-[0.16em] text-[var(--muted)]">Additional Notes</label>
            <textarea
              name="message"
              value={form.message}
              onChange={onChange}
              className="input-brand w-full p-3"
              rows={4}
              placeholder="Tell us more about the experience, pace, comfort level, or special requests you have in mind"
            />
          </div>

          {/* Contact */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <input name="name" value={form.name} onChange={onChange} type="text" placeholder="Full name" className="input-brand p-3" required />
            <input name="email" value={form.email} onChange={onChange} type="email" placeholder="Email address" className="input-brand p-3" required />
            <input name="phone" value={form.phone} onChange={onChange} type="text" placeholder="Phone number" className="input-brand p-3 sm:col-span-2" required />
          </div>

          {status==='error' && !error.includes('destination') && (
            <p className="rounded-xl border border-[rgba(255,77,109,0.24)] bg-[rgba(255,77,109,0.1)] px-4 py-3 text-center text-[var(--pink)]">{error}</p>
          )}

          <button
            type="submit"
            className={`btn-brand w-full rounded-full px-6 py-3 font-semibold transition ${status==='loading' ? 'cursor-not-allowed opacity-50' : ''}`}
            disabled={status==='loading'}
          >
            {status==='loading' ? 'Sending...' : 'Send Custom Enquiry'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
