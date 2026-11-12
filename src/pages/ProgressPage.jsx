import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { progressApi } from '../api/progressApi';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';
import { 
  TrendingUp, 
  Calendar, 
  CheckCircle2, 
  DollarSign, 
  Star, 
  RefreshCw, 
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

const ProgressPage = () => {
  const [progressData, setProgressData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        setLoading(true);
        setError('');
        const res = await progressApi.getProgressSummary();
        if (res?.data) {
          setProgressData(res.data);
        }
      } catch (err) {
        setError(err.message || 'Failed to load progress analytics.');
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderColor: 'rgba(5, 150, 105, 0.2)', borderTopColor: 'var(--primary)' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Compiling your genuine nutrition analytics...</p>
      </div>
    );
  }

  const trends = progressData?.weeklyTrends || [];
  const feedbackHistory = progressData?.feedbackHistory || [];
  const adjustmentHistory = progressData?.adjustmentHistory || [];

  const hasHistory = trends.length > 0 || feedbackHistory.length > 0;

  return (
    <div>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Genuine Progress & Adherence Analytics
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Skinwise tracks your actual dietary consistency, budget variance, and algorithm modifications without fabricated statistics.
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <MedicalDisclaimer />
      </div>

      {!hasHistory ? (
        <div className="empty-state" style={{ maxWidth: '600px', margin: '3rem auto' }}>
          <TrendingUp className="empty-state-icon" />
          <h2 className="empty-state-title">No Historical Records Yet</h2>
          <p className="empty-state-desc">
            As you check off your meals and complete weekly feedback reviews, this dashboard will generate real adherence charts, budget tracking, and adaptive algorithm logs.
          </p>
          <Link to="/diet-plan" className="btn btn-primary">
            View Current Diet Plan <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <>
          {/* Top Metric Cards */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            <div className="card">
              <span className="card-subtitle">Current Program Status</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', marginTop: '0.25rem' }}>
                Week {progressData.currentWeek || 1} <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '500' }}>/ 12</span>
              </h3>
            </div>

            <div className="card">
              <span className="card-subtitle">Overall Adherence Rate</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary)', marginTop: '0.25rem' }}>
                {progressData.overallAdherencePercentage || 0}%
              </h3>
            </div>

            <div className="card">
              <span className="card-subtitle">Total Meals Completed</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--success)', marginTop: '0.25rem' }}>
                {progressData.mealCompletionPercentage || 0}%
              </h3>
            </div>

            <div className="card">
              <span className="card-subtitle">Weekly Budget</span>
              <h3 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--primary-dark)', marginTop: '0.25rem' }}>
                ₹{Number(progressData.currentWeeklyBudget || 0).toFixed(0)}
              </h3>
            </div>
          </div>

          {/* Charts Section */}
          <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
            {/* Chart 1: Adherence Trend */}
            <div className="card">
              <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                Weekly Adherence Rate (%)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Percentage of planned meals followed each week.
              </p>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={trends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="weekNumber" tickFormatter={(w) => `Wk ${w}`} stroke="#94a3b8" />
                    <YAxis domain={[0, 100]} stroke="#94a3b8" />
                    <Tooltip formatter={(value) => [`${value}%`, 'Adherence']} />
                    <Line type="monotone" dataKey="adherenceRate" stroke="var(--primary)" strokeWidth={3} dot={{ r: 5 }} activeDot={{ r: 7 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Chart 2: Budget vs Actual Cost */}
            <div className="card">
              <h3 className="card-title" style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                Budget vs. Estimated Meal Cost (₹)
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                Weekly budget ceiling compared to estimated 35-meal grocery cost.
              </p>
              <div style={{ width: '100%', height: 260 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={trends} margin={{ top: 10, right: 20, left: -10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                    <XAxis dataKey="weekNumber" tickFormatter={(w) => `Wk ${w}`} stroke="#94a3b8" />
                    <YAxis stroke="#94a3b8" />
                    <Tooltip formatter={(val) => [`₹${val}`, '']} />
                    <Legend />
                    <Bar dataKey="budget" name="Budget" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="estimatedCost" name="Est. Cost" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Plan Adjustment History Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <RefreshCw size={20} color="var(--primary)" /> Adaptive Algorithm Transition Logs
            </h2>

            {adjustmentHistory.length === 0 ? (
              <div className="card" style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                Currently on Week 1 baseline. After you complete Week 1 review, subsequent week adaptations will be documented here.
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {adjustmentHistory.map(adj => (
                  <div key={adj.id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                      <span className="badge badge-primary">
                        Week {adj.fromWeek} → Week {adj.toWeek}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        Applied: {new Date(adj.appliedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <strong style={{ fontSize: '0.95rem', color: 'var(--text-main)', display: 'block', marginBottom: '0.35rem' }}>
                      {adj.adjustmentReason}
                    </strong>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>
                      {adj.changesSummary}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Feedback History Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Star size={20} color="#f59e0b" /> Past Weekly Reviews
            </h2>

            {feedbackHistory.length === 0 ? (
              <div className="card" style={{ padding: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                No submitted reviews yet. Submit your review under the <Link to="/feedback" style={{ color: 'var(--primary)', fontWeight: '600' }}>Weekly Review</Link> tab.
              </div>
            ) : (
              <div className="grid-2">
                {feedbackHistory.map(fb => (
                  <div key={fb.id} className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                      <span className="badge badge-neutral">Week {fb.weekNumber} Review</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.2rem' }}>
                        {[...Array(fb.overallSatisfaction || 5)].map((_, i) => (
                          <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />
                        ))}
                      </div>
                    </div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <div>Followed: <strong>{fb.mealsFollowedCount} meals</strong> • Skipped: <strong>{fb.mealsSkippedCount}</strong></div>
                      <div>Budget: <strong>{fb.affordabilityRating}</strong> • Difficulty: <strong>{fb.difficultyRating}/5</strong></div>
                      <div>Satiety: <strong>{fb.hungerFullnessRating}</strong></div>
                      {fb.likedFoods && <div>Liked: <em>{fb.likedFoods}</em></div>}
                      {fb.comments && <div style={{ marginTop: '0.25rem', color: 'var(--text-muted)' }}>"{fb.comments}"</div>}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressPage;
