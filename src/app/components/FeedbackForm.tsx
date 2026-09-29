'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { Camera, ImagePlus, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import SuccessModal from '@/app/components/SuccessModal';

const galleryNotes = [
  'Mountain views from your route',
  'Hotel, homestay, or cafe moments',
  'Family, group, or solo travel memories',
];

export default function FeedbackForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    trip: '',
    rating: '5',
    message: '',
  });
  const [files, setFiles] = useState<File[]>([]);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const onFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFiles(Array.from(e.target.files || []).slice(0, 4));
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    setError('');

    const payload = new FormData();
    Object.entries(form).forEach(([key, value]) => payload.append(key, value));
    files.forEach(file => payload.append('media', file));

    try {
      const res = await fetch('/api/mail/feedback', {
        method: 'POST',
        body: payload,
      });
      const json = await res.json();

      if (res.ok && json.success) {
        setStatus('success');
        setForm({ name: '', email: '', phone: '', trip: '', rating: '5', message: '' });
        setFiles([]);
      } else {
        setStatus('error');
        setError(json.error || 'Failed to send feedback.');
      }
    } catch {
      setStatus('error');
      setError('Network or server error');
    }
  };

  return (
    <section className="mt-12">
      <SuccessModal
        open={status === 'success'}
        title="Thank you for sharing your journey"
        message="Your feedback and travel memories have reached HillHoppers. We truly appreciate you helping future travellers see Sikkim through real stories."
        onClose={() => setStatus('idle')}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 0.45 }}
        className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]"
      >
        <div className="card-shell overflow-hidden rounded-[1.8rem]">
          <div
            className="relative min-h-[360px] bg-cover bg-center p-7 text-white"
            style={{
              backgroundImage:
                "linear-gradient(180deg,rgba(0,136,204,0.2),rgba(11,29,42,0.92)), url('/destinations/temi.jpg')",
            }}
          >
            <div className="absolute inset-0 luxury-grid opacity-40" />
            <div className="relative flex h-full min-h-[300px] flex-col justify-between">
              <div>
                <div className="mb-4 inline-flex rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.28em] backdrop-blur">
                  Client Gallery
                </div>
                <h2 className="text-3xl font-black leading-tight">Share your HillHoppers story with us.</h2>
                <p className="mt-4 text-sm leading-6 text-slate-100">
                  Add a few words, photos, or short videos from your journey. We review every submission before using it anywhere on the website.
                </p>
              </div>
              <div className="mt-8 space-y-3">
                {galleryNotes.map(note => (
                  <div key={note} className="flex items-center gap-3 rounded-2xl border border-white/12 bg-white/10 px-4 py-3 text-sm backdrop-blur">
                    <Camera size={16} />
                    <span>{note}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={onSubmit} className="card-shell space-y-5 rounded-[1.8rem] p-5 sm:p-8">
          <div>
            <p className="eyebrow mb-3">Feedback</p>
            <h3 className="section-title text-2xl">Tell us how your trip felt</h3>
            <p className="mt-2 text-sm leading-6 text-[var(--muted)]">
              Your words help us improve routes, stays, drivers, and the overall experience.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <input className="input-brand w-full p-3" name="name" placeholder="Full name" value={form.name} onChange={onChange} required />
            <input className="input-brand w-full p-3" name="email" type="email" placeholder="Email address" value={form.email} onChange={onChange} required />
            <input className="input-brand w-full p-3" name="phone" placeholder="Phone number" value={form.phone} onChange={onChange} required />
            <input className="input-brand w-full p-3" name="trip" placeholder="Trip or package name" value={form.trip} onChange={onChange} />
          </div>

          <div className="grid gap-4 sm:grid-cols-[0.6fr_1.4fr]">
            <label className="input-brand flex items-center gap-3 p-3">
              <Star className="text-[var(--accent)]" size={18} />
              <select name="rating" value={form.rating} onChange={onChange} className="w-full bg-transparent outline-none">
                <option value="5">5 stars</option>
                <option value="4">4 stars</option>
                <option value="3">3 stars</option>
                <option value="2">2 stars</option>
                <option value="1">1 star</option>
              </select>
            </label>
            <label className="input-brand flex cursor-pointer items-center gap-3 p-3">
              <ImagePlus className="text-[var(--accent)]" size={18} />
              <span className="min-w-0 flex-1 truncate text-[var(--muted)]">
                {files.length ? `${files.length} file(s) selected` : 'Upload photos or short videos'}
              </span>
              <input className="hidden" type="file" accept="image/*,video/*" multiple onChange={onFileChange} />
            </label>
          </div>

          <textarea
            className="input-brand w-full p-3"
            name="message"
            rows={5}
            placeholder="Tell us what you loved, what could be better, or what future travellers should know"
            value={form.message}
            onChange={onChange}
            required
          />

          {status === 'error' && (
            <p className="rounded-xl border border-[rgba(255,77,109,0.24)] bg-[rgba(255,77,109,0.1)] px-4 py-3 text-[var(--pink)]">
              {error}
            </p>
          )}

          <button
            disabled={status === 'loading'}
            className={`btn-brand w-full rounded-full px-6 py-3 font-semibold transition ${status === 'loading' ? 'cursor-not-allowed opacity-60' : ''}`}
          >
            {status === 'loading' ? 'Sending feedback...' : 'Share Feedback'}
          </button>
        </form>
      </motion.div>
    </section>
  );
}
