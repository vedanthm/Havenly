"use client";

import { useState } from "react";

interface EmailModalProps {
  open: boolean;
  onClose: () => void;
  onSend: (email: string) => Promise<void>;
  sending: boolean;
}

export default function EmailModal({ open, onClose, onSend, sending }: EmailModalProps) {
  const [email, setEmail] = useState("");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-xl border border-border p-8 w-full max-w-md">
        <h3 className="font-serif text-2xl font-light tracking-[0.1em] uppercase text-text-primary mb-2">
          Send Assessment
        </h3>
        <p className="text-sm text-text-muted font-sans mb-6">
          The completed assessment will be sent as a PDF attachment.
        </p>
        <label className="block text-xs font-semibold tracking-[0.15em] uppercase text-accent mb-2 font-sans">
          Recipient Email
        </label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="client@example.com"
          className="w-full px-4 py-3 border border-border rounded-lg text-sm text-text-primary bg-cream font-sans mb-6"
        />
        <div className="flex gap-3 justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full border border-border text-sm font-medium text-text-secondary font-sans hover:bg-cream transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onSend(email)}
            disabled={!email || sending}
            className="px-6 py-2.5 rounded-full bg-accent text-white text-sm font-medium font-sans hover:bg-accent-light transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {sending ? "Sending..." : "Send PDF"}
          </button>
        </div>
      </div>
    </div>
  );
}
