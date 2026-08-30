import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Mail } from 'lucide-react';

export default function Contact() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '56px 20px 64px', color: 'var(--text-muted)', fontSize: 15, lineHeight: 1.8 }}>
      <Helmet><title>Contact | HomeValueCal</title></Helmet>
      <h1 style={{ fontSize: 32, fontWeight: 800, color: 'var(--text)', marginBottom: 18 }}>Contact Us</h1>
      <p style={{ marginBottom: 20 }}>
        Questions, feedback, or spotted something off in an estimate? We'd like to hear about it.
      </p>
      <a href="mailto:hello@homevaluecal.com" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--primary)', color: 'white', padding: '12px 22px', borderRadius: 9, fontWeight: 700, fontSize: 14.5 }}>
        <Mail size={16} /> hello@homevaluecal.com
      </a>
    </div>
  );
}
