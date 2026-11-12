import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Heart, ShieldCheck, DollarSign, RefreshCw } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: 'var(--surface)',
      borderTop: '1px solid var(--border)',
      padding: '3rem 1.5rem 2rem 1.5rem',
      marginTop: 'auto'
    }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div className="grid-4" style={{ marginBottom: '2.5rem' }}>
          {/* Brand info */}
          <div style={{ gridColumn: 'span 2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
              <div style={{
                background: 'var(--primary)',
                color: '#fff',
                width: '1.8rem',
                height: '1.8rem',
                borderRadius: 'var(--radius-sm)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Sparkles size={14} />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
                Skinwise
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', lineHeight: '1.6', maxWidth: '420px', marginBottom: '1rem' }}>
              Personalized, budget-conscious smart diet planning engineered to support cutaneous health, hormonal equilibrium, and systemic well-being through accessible regional nutrition.
            </p>
            <div style={{ display: 'flex', gap: '1rem', color: 'var(--text-light)', fontSize: '0.8rem' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><DollarSign size={14} color="var(--primary)" /> Budget-First</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><RefreshCw size={14} color="var(--primary)" /> 12-Week Adaptive</span>
              <span style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}><ShieldCheck size={14} color="var(--primary)" /> Allergy-Safe</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', marginBottom: '0.85rem' }}>
              Platform
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><Link to="/dashboard">Dashboard</Link></li>
              <li><Link to="/diet-plan">7-Day Meal Plan</Link></li>
              <li><Link to="/feedback">Weekly Adaptation</Link></li>
              <li><Link to="/progress">Adherence Analytics</Link></li>
              <li><Link to="/profile">Skin Assessment</Link></li>
            </ul>
          </div>

          {/* Trust & Transparency */}
          <div>
            <h4 style={{ fontSize: '0.875rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-main)', marginBottom: '0.85rem' }}>
              Transparency
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              <li><span>Regional Reference Pricing</span></li>
              <li><span>Transparent Ingredient Data</span></li>
              <li><span>Zero Artificial Calorie Inflation</span></li>
              <li><span>Strict Data Ownership</span></li>
            </ul>
          </div>
        </div>

        {/* Medical & Wellness Disclaimer Box */}
        <div style={{
          backgroundColor: 'var(--surface-alt)',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '1rem 1.25rem',
          fontSize: '0.775rem',
          color: 'var(--text-muted)',
          lineHeight: '1.5',
          marginBottom: '2rem'
        }}>
          <strong>Medical & Dermatological Notice:</strong> Skinwise provides educational wellness nutrition planning based on dietary profiles and regional ingredient staples. The recommendations provided do not constitute medical, clinical, or dermatological advice, diagnosis, or treatment. Dietary changes support general physical well-being but should never replace prescribed medications, topical therapies, or physician oversight for acne vulgaris, eczema, psoriasis, dermatitis, or other conditions.
        </div>

        {/* Bottom Bar */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          paddingTop: '1.25rem',
          borderTop: '1px solid var(--border)',
          fontSize: '0.8rem',
          color: 'var(--text-light)'
        }}>
          <p>© {new Date().getFullYear()} Skinwise — Smart Diet System. All rights reserved.</p>
          <p style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            Built for affordable, scientifically grounded skin nutrition
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
