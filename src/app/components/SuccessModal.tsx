'use client';

import { CheckCircle2 } from 'lucide-react';
import { motion } from 'framer-motion';

type SuccessModalProps = {
  open: boolean;
  title?: string;
  message?: string;
  onClose: () => void;
};

export default function SuccessModal({
  open,
  title = 'Thank you for reaching out',
  message = 'Your enquiry has reached HillHoppers. We will review the details and get back to you shortly.',
  onClose,
}: SuccessModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[80] flex items-center justify-center bg-[rgba(4,11,20,0.58)] px-4 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="card-shell max-w-md rounded-[2rem] p-7 text-center shadow-2xl sm:p-9"
      >
        <motion.div
          initial={{ scale: 0.7, rotate: -8 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.08, duration: 0.32, ease: 'easeOut' }}
          className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[rgba(34,197,94,0.12)] text-[var(--success)]"
        >
          <CheckCircle2 size={42} strokeWidth={1.8} />
        </motion.div>
        <p className="eyebrow mb-3">Message received</p>
        <h2 className="section-title text-2xl">{title}</h2>
        <p className="mt-3 text-sm leading-6 text-[var(--muted)] sm:text-base">{message}</p>
        <button
          type="button"
          onClick={onClose}
          className="btn-brand mt-7 rounded-full px-7 py-3 text-sm font-semibold"
        >
          Continue exploring
        </button>
      </motion.div>
    </div>
  );
}
