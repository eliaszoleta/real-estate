import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { FAQS } from '../../data/faqs';

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faq" style={{ maxWidth: 760, margin: '64px auto', padding: '0 20px' }}>
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <h2 style={{ fontSize: 'clamp(24px, 4vw, 32px)', fontWeight: 800, color: 'var(--text)', marginBottom: 10 }}>
          Frequently Asked Questions
        </h2>
      </div>

      <div style={{ border: '1px solid var(--border)', borderRadius: 12, overflow: 'hidden' }}>
        {FAQS.map((item, i) => {
          const open = openIndex === i;
          return (
            <div key={item.q} style={{ borderBottom: i < FAQS.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
              <button
                onClick={() => setOpenIndex(open ? -1 : i)}
                style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, padding: '16px 20px', background: 'white', border: 'none', textAlign: 'left', cursor: 'pointer' }}
              >
                <span style={{ fontSize: 14.5, fontWeight: 600, color: 'var(--text)' }}>{item.q}</span>
                <ChevronDown size={17} color="var(--text-muted)" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }} />
              </button>
              {open && (
                <div style={{ padding: '0 20px 18px', fontSize: 13.5, color: 'var(--text-muted)', lineHeight: 1.7 }}>{item.a}</div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
