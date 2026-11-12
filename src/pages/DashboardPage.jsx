import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { dietPlanApi } from '../api/dietPlanApi';
import { progressApi } from '../api/progressApi';
import MealCard from '../components/MealCard';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { 
  CalendarDays, 
  DollarSign, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Sparkles, 
  AlertCircle,
  TrendingUp,
  MessageSquare,
  RefreshCw,
  Plus
} from 'lucide-react';

const DAYS = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];

const DashboardPage = () => {
  const { user } = useAuth();
  const [currentPlan, setCurrentPlan] = useState(null);
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [generating, setGenerating] = useState(false);
  const [updatingMealId, setUpdatingMealId] = useState(null);

  // Determine current day of week (e.g., MONDAY)
  const currentDayName = DAYS[new Date().getDay()] === 'SUNDAY' ? 'SUNDAY' : DAYS[new Date().getDay()];

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      
      const [planRes, progRes] = await Promise.allSettled([
        dietPlanApi.getCurrentPlan(),
        progressApi.getProgressSummary()
      ]);

      if (planRes.status === 'fulfilled' && planRes.value?.data) {
        setCurrentPlan(planRes.value.data);
      }
      if (progRes.status === 'fulfilled' && progRes.value?.data) {
        setProgress(progRes.value.data);
      }
    } catch (err) {
      console.warn('Dashboard load notice:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleGeneratePlan = async () => {
    try {
      setGenerating(true);
      setError('');
      const res = await dietPlanApi.generatePlan();
      if (res?.data) {
        setCurrentPlan(res.data);
        await loadDashboardData();
      }
    } catch (err) {
      setError(err.message || 'Failed to generate plan. Please ensure your profile is completed.');
    } finally {
      setGenerating(false);
    }
  };

  const handleToggleMeal = async (mealId) => {
    try {
      setUpdatingMealId(mealId);
      const res = await dietPlanApi.toggleMeal(mealId);
      if (res?.data && currentPlan) {
        setCurrentPlan(prev => ({
          ...prev,
          meals: prev.meals.map(m => m.id === mealId ? { ...m, completed: res.data.completed } : m)
        }));
        // Refresh progress stats
        const progRes = await progressApi.getProgressSummary();
        if (progRes?.data) setProgress(progRes.data);
      }
    } catch (err) {
      console.error('Failed to toggle meal status', err);
    } finally {
      setUpdatingMealId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderColor: 'rgba(5, 150, 105, 0.2)', borderTopColor: 'var(--primary)' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading your dashboard...</p>
      </div>
    );
  }

  // Filter meals for today
  const todaysMeals = currentPlan?.meals?.filter(m => m.dayOfWeek === currentDayName) || [];
  const completedTodayCount = todaysMeals.filter(m => m.completed).length;

  return (
    <div>
      {/* Welcome Banner */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        marginBottom: '2rem'
      }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            Hello, {user?.name?.split(' ')[0] || 'Member'} 👋
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {currentPlan 
              ? `Currently on Week ${currentPlan.weekNumber} of 12 • Smart Adaptive Nutrition` 
              : 'Welcome to Skinwise! Complete your assessment to generate your personalized meal plan.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          {currentPlan ? (
            <>
              <Link to="/diet-plan" className="btn btn-outline btn-sm">
                <CalendarDays size={16} /> View 7-Day Plan
              </Link>
              <Link to="/feedback" className="btn btn-primary btn-sm">
                <MessageSquare size={16} /> Weekly Review
              </Link>
            </>
          ) : (
            <button 
              onClick={handleGeneratePlan} 
              disabled={generating} 
              className="btn btn-primary"
            >
              {generating ? <span className="spinner"></span> : <Plus size={16} />}
              Generate Week 1 Plan
            </button>
          )}
        </div>
      </div>

      {error && (
        <div className="alert alert-danger" style={{ marginBottom: '1.5rem' }}>
          <AlertCircle size={18} style={{ flexShrink: 0 }} />
          <span>{error}</span>
          <Link to="/profile" style={{ marginLeft: 'auto', fontWeight: '700', textDecoration: 'underline' }}>
            Edit Profile
          </Link>
        </div>
      )}

      {/* If No Active Plan Exists Yet */}
      {!currentPlan ? (
        <div className="card" style={{ textAlign: 'center', padding: '3.5rem 1.5rem', marginBottom: '2rem' }}>
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
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>
            No Active Diet Plan Found
          </h2>
          <p style={{ color: 'var(--text-muted)', maxWidth: '520px', margin: '0 auto 1.75rem auto', lineHeight: '1.5' }}>
            To get your 7-day budget-conscious skin nutrition plan, ensure your dietary preferences and health assessment are saved.
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/profile" className="btn btn-secondary">
              Review Diet Profile
            </Link>
            <button 
              onClick={handleGeneratePlan} 
              disabled={generating} 
              className="btn btn-primary"
            >
              {generating ? <span className="spinner"></span> : <Plus size={16} />}
              Generate Week 1 Plan
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            {/* Week Card */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--primary-light)',
                color: 'var(--primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CalendarDays size={22} />
              </div>
              <div>
                <p className="card-subtitle">Current Plan</p>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                  Week {currentPlan.weekNumber} <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>/ 12</span>
                </h3>
              </div>
            </div>

            {/* Budget Status */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--warning-bg)',
                color: 'var(--warning)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <DollarSign size={22} />
              </div>
              <div>
                <p className="card-subtitle">Weekly Budget</p>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                  ₹{Number(currentPlan.totalWeeklyBudget).toFixed(0)}
                </h3>
              </div>
            </div>

            {/* Estimated Plan Cost */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--success-bg)',
                color: 'var(--success)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Sparkles size={22} />
              </div>
              <div>
                <p className="card-subtitle">Estimated Total Cost</p>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
                  ₹{Number(currentPlan.estimatedTotalCost).toFixed(0)}
                </h3>
              </div>
            </div>

            {/* Today's Completion */}
            <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{
                width: '3rem',
                height: '3rem',
                borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--info-bg)',
                color: 'var(--info)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <CheckCircle2 size={22} />
              </div>
              <div>
                <p className="card-subtitle">Today's Meals</p>
                <h3 style={{ fontSize: '1.4rem', fontWeight: '800' }}>
                  {completedTodayCount} / {todaysMeals.length || 5}
                </h3>
              </div>
            </div>
          </div>

          {/* Adaptation Note Banner if plan has adaptations */}
          {currentPlan.adaptationNotes && (
            <div style={{
              backgroundColor: 'var(--surface)',
              border: '1px solid #bbf7d0',
              borderRadius: 'var(--radius-md)',
              padding: '1rem 1.25rem',
              marginBottom: '2rem',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              boxShadow: 'var(--shadow-sm)'
            }}>
              <RefreshCw size={20} color="var(--primary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <strong style={{ fontSize: '0.9rem', color: 'var(--primary-dark)', display: 'block', marginBottom: '0.2rem' }}>
                  Adaptive Plan Formulation (Week {currentPlan.weekNumber})
                </strong>
                <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  {currentPlan.adaptationNotes}
                </p>
              </div>
            </div>
          )}

          {/* Today's Meals Section */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '1rem'
            }}>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
                  Today's Meals ({currentDayName})
                </h2>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  Check off each meal as you follow it to track your real skin adherence.
                </p>
              </div>
              <Link to="/diet-plan" style={{ fontSize: '0.85rem', fontWeight: '700', color: 'var(--primary)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                Full 7-Day Plan <ArrowRight size={14} />
              </Link>
            </div>

            {todaysMeals.length === 0 ? (
              <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
                  No meals found for {currentDayName}. View the complete weekly plan below.
                </p>
                <Link to="/diet-plan" className="btn btn-outline btn-sm" style={{ marginTop: '0.75rem' }}>
                  Open 7-Day Plan
                </Link>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {todaysMeals.map(meal => (
                  <MealCard 
                    key={meal.id} 
                    mealItem={meal} 
                    onToggleComplete={handleToggleMeal}
                    isUpdating={updatingMealId === meal.id}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}

      {/* Wellness & Educational Reminder */}
      <div style={{ marginTop: '3rem' }}>
        <MedicalDisclaimer compact={true} />
      </div>
    </div>
  );
};

export default DashboardPage;
