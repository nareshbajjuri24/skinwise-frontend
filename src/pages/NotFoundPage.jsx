import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Home, Sparkles } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div style={{ maxWidth: '500px', margin: '4rem auto', textAlign: 'center' }}>
      <div className="card" style={{ padding: '3rem 2rem' }}>
        <div style={{
          width: '3.5rem',
          height: '3.5rem',
          borderRadius: '50%',
          backgroundColor: 'var(--primary-light)',
          color: 'var(--primary)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 1.25rem auto'
        }}>
          <Sparkles size={28} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.25rem' }}>404</h1>
        <h2 style={{ fontSize: '1.25rem', fontWeight: '700', marginBottom: '0.75rem' }}>Page Not Found</h2>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.75rem' }}>
          The page or resource you are looking for does not exist in the Skinwise Smart Diet System.
        </p>
        <Link to="/" className="btn btn-primary">
          <Home size={16} /> Return to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFoundPage;
