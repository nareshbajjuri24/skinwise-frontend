import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Sparkles, 
  LayoutDashboard, 
  CalendarDays, 
  MessageSquare, 
  TrendingUp, 
  User, 
  Settings, 
  LogOut, 
  Menu, 
  X,
  BookOpen
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav style={{
      backgroundColor: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
      position: 'sticky',
      top: 0,
      zIndex: 50,
      boxShadow: 'var(--shadow-sm)'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{
            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
            color: '#fff',
            width: '2.4rem',
            height: '2.4rem',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 2px 8px rgba(5, 150, 105, 0.3)'
          }}>
            <Sparkles size={20} />
          </div>
          <div>
            <span style={{ fontSize: '1.25rem', fontWeight: '800', letterSpacing: '-0.02em', color: 'var(--primary-dark)' }}>
              Skin<span style={{ color: 'var(--primary)' }}>wise</span>
            </span>
            <span style={{ display: 'block', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--text-muted)', fontWeight: '600', marginTop: '-3px' }}>
              Smart Diet System
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{ display: 'none', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          {isAuthenticated ? (
            <>
              <Link 
                to="/dashboard" 
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  color: isActive('/dashboard') ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                <LayoutDashboard size={18} />
                Dashboard
              </Link>
              <Link 
                to="/diet-plan" 
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  color: isActive('/diet-plan') ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                <CalendarDays size={18} />
                Diet Plan
              </Link>
              <Link 
                to="/feedback" 
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  color: isActive('/feedback') ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                <MessageSquare size={18} />
                Weekly Feedback
              </Link>
              <Link 
                to="/progress" 
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '0.4rem', 
                  fontSize: '0.9rem', 
                  fontWeight: '600',
                  color: isActive('/progress') ? 'var(--primary)' : 'var(--text-muted)'
                }}
              >
                <TrendingUp size={18} />
                Progress
              </Link>
            </>
          ) : (
            <>
              <Link to="/" style={{ fontSize: '0.9rem', fontWeight: '600', color: isActive('/') ? 'var(--primary)' : 'var(--text-muted)' }}>
                Home
              </Link>
              <Link to="/#how-it-works" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                How It Works
              </Link>
              <Link to="/#features" style={{ fontSize: '0.9rem', fontWeight: '600', color: 'var(--text-muted)' }}>
                Features
              </Link>
            </>
          )}
        </div>

        {/* Right CTA / User Profile Menu */}
        <div style={{ display: 'none', alignItems: 'center', gap: '0.85rem' }} className="desktop-nav">
          {isAuthenticated ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link 
                to="/profile" 
                title="Profile & Diet Assessment" 
                className="btn btn-secondary btn-sm"
                style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <User size={16} />
                <span>{user?.name?.split(' ')[0] || 'Profile'}</span>
              </Link>
              <Link 
                to="/settings" 
                title="Settings" 
                className="btn btn-secondary btn-sm"
                style={{ padding: '0.4rem 0.5rem' }}
              >
                <Settings size={17} />
              </Link>
              <button 
                onClick={handleLogout} 
                className="btn btn-outline btn-sm" 
                title="Sign out"
                style={{ borderColor: 'var(--border)', color: 'var(--text-muted)' }}
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-secondary btn-sm">
                Sign In
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Get Started
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Toggle */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'block', color: 'var(--text-main)', padding: '0.4rem' }}
          className="mobile-toggle"
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: 'var(--surface)',
          borderTop: '1px solid var(--border)',
          padding: '1rem 1.5rem',
          display: 'flex',
          flexDirection: 'column',
          gap: '0.85rem'
        }}>
          {isAuthenticated ? (
            <>
              <div style={{ paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '0.25rem' }}>
                <p style={{ fontWeight: '700', fontSize: '0.95rem' }}>{user?.name}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{user?.email}</p>
              </div>
              <Link 
                to="/dashboard" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', fontWeight: '600' }}
              >
                <LayoutDashboard size={18} color="var(--primary)" /> Dashboard
              </Link>
              <Link 
                to="/diet-plan" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', fontWeight: '600' }}
              >
                <CalendarDays size={18} color="var(--primary)" /> Diet Plan
              </Link>
              <Link 
                to="/feedback" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', fontWeight: '600' }}
              >
                <MessageSquare size={18} color="var(--primary)" /> Weekly Feedback
              </Link>
              <Link 
                to="/progress" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', fontWeight: '600' }}
              >
                <TrendingUp size={18} color="var(--primary)" /> Progress
              </Link>
              <Link 
                to="/profile" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', fontWeight: '600' }}
              >
                <User size={18} color="var(--primary)" /> Diet Assessment & Profile
              </Link>
              <Link 
                to="/settings" 
                onClick={() => setMobileMenuOpen(false)}
                style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', padding: '0.5rem 0', fontWeight: '600' }}
              >
                <Settings size={18} color="var(--primary)" /> Account Settings
              </Link>
              <button 
                onClick={() => { setMobileMenuOpen(false); handleLogout(); }}
                className="btn btn-danger btn-sm"
                style={{ marginTop: '0.5rem', width: '100%' }}
              >
                <LogOut size={16} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: '600' }}>
                Home
              </Link>
              <Link to="/#how-it-works" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: '600' }}>
                How It Works
              </Link>
              <Link to="/#features" onClick={() => setMobileMenuOpen(false)} style={{ padding: '0.5rem 0', fontWeight: '600' }}>
                Features
              </Link>
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn btn-secondary btn-sm" style={{ flex: 1 }}>
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn btn-primary btn-sm" style={{ flex: 1 }}>
                  Get Started
                </Link>
              </div>
            </>
          )}
        </div>
      )}

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav {
            display: flex !important;
          }
          .mobile-toggle {
            display: none !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
