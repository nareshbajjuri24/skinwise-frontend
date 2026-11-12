import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { 
  Settings, 
  User, 
  Lock, 
  LogOut, 
  ShieldCheck, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

const SettingsPage = () => {
  const { user, logout, changePassword } = useAuth();
  const navigate = useNavigate();

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (passwordData.newPassword.length < 6) {
      setErrorMsg('New password must be at least 6 characters long');
      return;
    }
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setErrorMsg('New passwords do not match');
      return;
    }

    try {
      setLoading(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setSuccessMsg('Password updated successfully!');
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: ''
      });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to change password. Please check your current password.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out of Skinwise?')) {
      await logout();
      navigate('/login');
    }
  };

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Account Settings
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Manage your security credentials and active session.
        </p>
      </div>

      {successMsg && (
        <div className="alert alert-success">
          <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="alert alert-danger">
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Account Profile Card */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <User size={18} color="var(--primary)" /> Account Identity
        </h2>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.9rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Full Name</span>
            <strong style={{ fontSize: '1.05rem', color: 'var(--text-main)' }}>{user?.name}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Email Address</span>
            <span style={{ color: 'var(--text-main)' }}>{user?.email}</span>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', display: 'block', fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: '700' }}>Role & Permissions</span>
            <span className="badge badge-primary" style={{ marginTop: '0.2rem' }}>{user?.role || 'ROLE_USER'}</span>
          </div>
        </div>
      </div>

      {/* Security: Change Password Card */}
      <div className="card" style={{ marginBottom: '1.75rem' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={18} color="var(--primary)" /> Change Password
        </h2>

        <form onSubmit={handlePasswordChange}>
          <div className="form-group">
            <label className="form-label" htmlFor="currentPassword">Current Password</label>
            <input
              id="currentPassword"
              type="password"
              className="form-input"
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData(prev => ({ ...prev, currentPassword: e.target.value }))}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="newPassword">New Password</label>
              <input
                id="newPassword"
                type="password"
                className="form-input"
                placeholder="At least 6 characters"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, newPassword: e.target.value }))}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="confirmNewPassword">Confirm New Password</label>
              <input
                id="confirmNewPassword"
                type="password"
                className="form-input"
                placeholder="Re-enter new password"
                value={passwordData.confirmNewPassword}
                onChange={(e) => setPasswordData(prev => ({ ...prev, confirmNewPassword: e.target.value }))}
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-secondary"
            disabled={loading}
          >
            {loading ? <span className="spinner"></span> : <Lock size={16} />}
            Update Password
          </button>
        </form>
      </div>

      {/* Session Management & Logout */}
      <div className="card" style={{ marginBottom: '2.5rem', borderColor: '#fecdd3' }}>
        <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '0.5rem', color: 'var(--danger)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <LogOut size={18} /> Sign Out of Session
        </h2>
        <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginBottom: '1.25rem', lineHeight: '1.5' }}>
          Signing out purges your active authentication token and local profile cache. A different user can register or log in on this browser without accessing any of your diet records.
        </p>
        <button
          onClick={handleLogout}
          className="btn btn-danger"
        >
          <LogOut size={16} /> Confirm & Sign Out
        </button>
      </div>

      <MedicalDisclaimer compact={true} />
    </div>
  );
};

export default SettingsPage;
