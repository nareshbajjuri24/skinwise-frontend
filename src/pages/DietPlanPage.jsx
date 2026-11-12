import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { dietPlanApi } from '../api/dietPlanApi';
import MealCard from '../components/MealCard';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { 
  Printer, 
  RefreshCw, 
  Calendar, 
  DollarSign, 
  Sparkles, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  AlertCircle,
  Clock,
  ArrowRight
} from 'lucide-react';

const DAYS_OF_WEEK = [
  'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'
];

const MEAL_FILTERS = [
  { value: 'ALL', label: 'All 5 Meals' },
  { value: 'BREAKFAST', label: 'Breakfast' },
  { value: 'MORNING_SNACK', label: 'Morning Snack' },
  { value: 'LUNCH', label: 'Lunch' },
  { value: 'EVENING_SNACK', label: 'Evening Snack' },
  { value: 'DINNER', label: 'Dinner' }
];

const DietPlanPage = () => {
  const [currentPlan, setCurrentPlan] = useState(null);
  const [selectedDay, setSelectedDay] = useState('MONDAY');
  const [mealFilter, setMealFilter] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [updatingMealId, setUpdatingMealId] = useState(null);
  const [error, setError] = useState('');

  const loadPlan = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await dietPlanApi.getCurrentPlan();
      if (res?.data) {
        setCurrentPlan(res.data);
      }
    } catch (err) {
      setError(err.message || 'No active plan found. Please generate your Week 1 plan.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlan();
  }, []);

  const handleRegenerate = async () => {
    if (!window.confirm('Regenerate this week\'s plan with fresh rotational recipe choices?')) {
      return;
    }
    try {
      setRegenerating(true);
      setError('');
      const res = await dietPlanApi.regeneratePlan();
      if (res?.data) {
        setCurrentPlan(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to regenerate plan.');
    } finally {
      setRegenerating(false);
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
      }
    } catch (err) {
      console.error('Failed to toggle meal', err);
    } finally {
      setUpdatingMealId(null);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderColor: 'rgba(5, 150, 105, 0.2)', borderTopColor: 'var(--primary)' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading your 7-day meal plan...</p>
      </div>
    );
  }

  if (error || !currentPlan) {
    return (
      <div style={{ maxWidth: '650px', margin: '3rem auto', textAlign: 'center' }}>
        <div className="card" style={{ padding: '3rem 2rem' }}>
          <AlertCircle size={40} color="var(--warning)" style={{ margin: '0 auto 1rem auto' }} />
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800', marginBottom: '0.5rem' }}>No Active Plan Available</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            {error || 'You have not generated your personalized 7-day plan yet.'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
            <Link to="/profile" className="btn btn-secondary">
              Update Profile
            </Link>
            <button onClick={loadPlan} className="btn btn-primary">
              Retry Loading
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Filter meals for active day and active meal type
  const dayMeals = currentPlan.meals?.filter(m => m.dayOfWeek === selectedDay) || [];
  const filteredMeals = mealFilter === 'ALL'
    ? dayMeals
    : dayMeals.filter(m => m.mealType === mealFilter);

  // Compute day estimated cost & calories
  const dayTotalCost = dayMeals.reduce((acc, m) => acc + (m.estimatedCost ? Number(m.estimatedCost) : 0), 0);
  const dayTotalCalories = dayMeals.reduce((acc, m) => acc + (m.recipe?.estimatedCalories || 0), 0);
  const dayCompletedCount = dayMeals.filter(m => m.completed).length;

  return (
    <div>
      {/* Header and Print Actions */}
      <div className="no-print" style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '1.5rem'
      }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.25rem' }}>
            <span className="badge badge-primary">Week {currentPlan.weekNumber} of 12</span>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              {currentPlan.startDate} to {currentPlan.endDate}
            </span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em' }}>
            7-Day Skin Nutrition Plan
          </h1>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
          <button onClick={handlePrint} className="btn btn-secondary btn-sm" title="Print clean weekly fridge sheet or PDF">
            <Printer size={16} /> Print / Export PDF
          </button>
          <button onClick={handleRegenerate} disabled={regenerating} className="btn btn-outline btn-sm" title="Regenerate this week">
            {regenerating ? <span className="spinner"></span> : <RefreshCw size={16} />} Regenerate
          </button>
          <Link to="/feedback" className="btn btn-primary btn-sm">
            Submit Weekly Review <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Printable Heading (Only visible in Print view) */}
      <div className="print-only" style={{ marginBottom: '1.5rem', textAlign: 'center' }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: '800' }}>Skinwise — Weekly Smart Diet Plan (Week {currentPlan.weekNumber})</h1>
        <p style={{ fontSize: '0.9rem', color: '#555' }}>
          Budget: ₹{currentPlan.totalWeeklyBudget} • Estimated Cost: ₹{currentPlan.estimatedTotalCost} • 5 Meals/Day
        </p>
      </div>

      {/* Adaptive formulation explanation banner */}
      {currentPlan.adaptationNotes && (
        <div className="no-print" style={{
          backgroundColor: 'var(--primary-light)',
          border: '1px solid #a7f3d0',
          borderRadius: 'var(--radius-md)',
          padding: '0.85rem 1.25rem',
          marginBottom: '1.5rem',
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.65rem',
          fontSize: '0.85rem',
          color: 'var(--primary-dark)'
        }}>
          <Sparkles size={18} style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <strong>Adaptive Formulation Notes:</strong> {currentPlan.adaptationNotes}
          </div>
        </div>
      )}

      {/* Week Cost Summary Bar */}
      <div className="card no-print" style={{
        marginBottom: '1.75rem',
        padding: '1.25rem',
        backgroundColor: 'var(--surface)',
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.5rem'
      }}>
        <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              Weekly Budget
            </span>
            <p style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
              ₹{Number(currentPlan.totalWeeklyBudget).toFixed(0)}
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              Estimated 7-Day Cost
            </span>
            <p style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--primary-dark)' }}>
              ₹{Number(currentPlan.estimatedTotalCost).toFixed(2)}
            </p>
          </div>
          <div>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: '700' }}>
              Selected Day ({selectedDay})
            </span>
            <p style={{ fontSize: '1.35rem', fontWeight: '800', color: 'var(--text-main)' }}>
              ₹{dayTotalCost.toFixed(2)} <span style={{ fontSize: '0.85rem', fontWeight: '500', color: 'var(--text-muted)' }}>({dayTotalCalories} kcal)</span>
            </p>
          </div>
        </div>

        <div>
          <span className="badge badge-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.825rem' }}>
            Day Adherence: {dayCompletedCount} / 5 Meals
          </span>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="no-print tabs-container" style={{
        display: 'flex',
        gap: '0.5rem',
        overflowX: 'auto',
        paddingBottom: '0.5rem',
        marginBottom: '1.25rem'
      }}>
        {DAYS_OF_WEEK.map(day => {
          const isSelected = selectedDay === day;
          return (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              style={{
                padding: '0.65rem 1.15rem',
                borderRadius: 'var(--radius-md)',
                fontWeight: isSelected ? '700' : '500',
                fontSize: '0.875rem',
                backgroundColor: isSelected ? 'var(--primary)' : 'var(--surface)',
                color: isSelected ? '#ffffff' : 'var(--text-muted)',
                border: '1px solid ' + (isSelected ? 'var(--primary)' : 'var(--border)'),
                transition: 'all 0.2s ease',
                flexShrink: 0
              }}
            >
              {day.slice(0, 3)}
            </button>
          );
        })}
      </div>

      {/* Meal Type Filter Chips */}
      <div className="no-print filter-bar" style={{
        display: 'flex',
        gap: '0.4rem',
        flexWrap: 'wrap',
        marginBottom: '1.5rem',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.3rem', marginRight: '0.3rem' }}>
          <Filter size={14} /> Filter Slot:
        </span>
        {MEAL_FILTERS.map(filter => (
          <button
            key={filter.value}
            onClick={() => setMealFilter(filter.value)}
            style={{
              padding: '0.35rem 0.75rem',
              borderRadius: '9999px',
              fontSize: '0.8rem',
              fontWeight: mealFilter === filter.value ? '700' : '500',
              backgroundColor: mealFilter === filter.value ? 'var(--primary-light)' : 'var(--surface-alt)',
              color: mealFilter === filter.value ? 'var(--primary-dark)' : 'var(--text-muted)',
              border: '1px solid ' + (mealFilter === filter.value ? 'var(--primary)' : 'var(--border)')
            }}
          >
            {filter.label}
          </button>
        ))}
      </div>

      {/* Meals Grid / List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2.5rem' }}>
        {filteredMeals.map(meal => (
          <MealCard
            key={meal.id}
            mealItem={meal}
            onToggleComplete={handleToggleMeal}
            isUpdating={updatingMealId === meal.id}
          />
        ))}
      </div>

      {/* Print View of All 7 Days */}
      <div className="print-only">
        {DAYS_OF_WEEK.map(day => (
          <div key={day} style={{ marginBottom: '2rem', pageBreakInside: 'avoid' }}>
            <h2 style={{ fontSize: '1.25rem', fontWeight: '800', borderBottom: '2px solid #ccc', paddingBottom: '0.25rem', marginBottom: '0.75rem' }}>
              {day}
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {currentPlan.meals?.filter(m => m.dayOfWeek === day).map(meal => (
                <div key={meal.id} style={{ border: '1px solid #eee', padding: '0.75rem', borderRadius: '4px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: '700', fontSize: '0.95rem' }}>
                    <span>{meal.mealType}: {meal.recipe?.name}</span>
                    <span>₹{meal.estimatedCost} (~{meal.recipe?.estimatedCalories} kcal)</span>
                  </div>
                  <p style={{ fontSize: '0.8rem', color: '#555', margin: '0.2rem 0' }}>Portion: {meal.recipe?.portionSize}</p>
                  <p style={{ fontSize: '0.8rem', color: '#333' }}>Skin note: {meal.recipe?.skinHealthHighlights || meal.customNotes}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Medical disclaimer note */}
      <div className="no-print" style={{ marginTop: '2rem' }}>
        <MedicalDisclaimer compact={true} />
      </div>
    </div>
  );
};

export default DietPlanPage;
