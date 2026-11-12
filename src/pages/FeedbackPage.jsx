import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { feedbackApi } from '../api/feedbackApi';
import { dietPlanApi } from '../api/dietPlanApi';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { 
  MessageSquare, 
  Sparkles, 
  DollarSign, 
  Clock, 
  Smile, 
  CheckCircle2, 
  AlertCircle,
  HelpCircle,
  RefreshCw,
  Star,
  ArrowRight
} from 'lucide-react';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [mealsFollowed, setMealsFollowed] = useState(30);
  const [mealsSkipped, setMealsSkipped] = useState(5);
  const [difficultyRating, setDifficultyRating] = useState(2);
  const [hungerRating, setHungerRating] = useState('BALANCED');
  const [affordabilityRating, setAffordabilityRating] = useState('MODERATE');
  const [availabilityRating, setAvailabilityRating] = useState('GENERALLY_AVAILABLE');
  const [overallSatisfaction, setOverallSatisfaction] = useState(4);
  const [likedFoods, setLikedFoods] = useState('');
  const [dislikedFoods, setDislikedFoods] = useState('');
  const [comments, setComments] = useState('');

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const planRes = await dietPlanApi.getCurrentPlan();
        if (planRes?.data) {
          const week = planRes.data.weekNumber || 1;
          setCurrentWeek(week);

          // Calculate completed meals
          const meals = planRes.data.meals || [];
          const followed = meals.filter(m => m.completed).length;
          setMealsFollowed(followed > 0 ? followed : 28);
          setMealsSkipped(Math.max(0, meals.length - followed));

          // Try checking if feedback for this week was already submitted
          try {
            const fbRes = await feedbackApi.getFeedbackByWeek(week);
            if (fbRes?.data) {
              const fb = fbRes.data;
              setMealsFollowed(fb.mealsFollowedCount || 28);
              setMealsSkipped(fb.mealsSkippedCount || 7);
              setDifficultyRating(fb.difficultyRating || 2);
              setHungerRating(fb.hungerFullnessRating || 'BALANCED');
              setAffordabilityRating(fb.affordabilityRating || 'MODERATE');
              setAvailabilityRating(fb.ingredientAvailabilityRating || 'GENERALLY_AVAILABLE');
              setOverallSatisfaction(fb.overallSatisfaction || 4);
              setLikedFoods(fb.likedFoods || '');
              setDislikedFoods(fb.dislikedFoods || '');
              setComments(fb.comments || '');
            }
          } catch (e) {
            // No prior feedback for this week
          }
        }
      } catch (err) {
        console.warn('Could not load current plan week', err);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      setSubmitting(true);
      const payload = {
        weekNumber: currentWeek,
        mealsFollowedCount: parseInt(mealsFollowed, 10),
        mealsSkippedCount: parseInt(mealsSkipped, 10),
        difficultyRating: parseInt(difficultyRating, 10),
        hungerFullnessRating: hungerRating,
        affordabilityRating: affordabilityRating,
        ingredientAvailabilityRating: availabilityRating,
        overallSatisfaction: parseInt(overallSatisfaction, 10),
        likedFoods,
        dislikedFoods,
        comments
      };

      await feedbackApi.submitFeedback(payload);
      setSuccessMsg(`Week ${currentWeek} feedback recorded! The adaptive engine has formulated Week ${Math.min(12, currentWeek + 1)} based on your responses.`);

      setTimeout(() => {
        navigate('/diet-plan');
      }, 1500);
    } catch (err) {
      setErrorMsg(err.message || 'Failed to submit weekly feedback. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderColor: 'rgba(5, 150, 105, 0.2)', borderTopColor: 'var(--primary)' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading weekly review...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="badge badge-primary">Week {currentWeek} Review</span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Weekly Nutrition & Adherence Review
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Your honest weekly review powers our transparent adaptive diet engine. We use your ratings to optimize costs, simplify recipes, and swap disliked ingredients for the next week.
        </p>
      </div>

      <div style={{ marginBottom: '1.5rem' }}>
        <MedicalDisclaimer />
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

      <form onSubmit={handleSubmit}>
        {/* Section 1: Meal Completion */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <CheckCircle2 size={18} color="var(--primary)" /> 1. Plan Adherence (Out of 35 Total Meals)
          </h2>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="mealsFollowed">Meals Followed / Completed</label>
              <input
                id="mealsFollowed"
                type="number"
                min="0"
                max="35"
                className="form-input"
                value={mealsFollowed}
                onChange={(e) => setMealsFollowed(e.target.value)}
                required
              />
              <span className="form-helper">How many of the 35 weekly meals did you consume as planned?</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="mealsSkipped">Meals Skipped or Substituted</label>
              <input
                id="mealsSkipped"
                type="number"
                min="0"
                max="35"
                className="form-input"
                value={mealsSkipped}
                onChange={(e) => setMealsSkipped(e.target.value)}
                required
              />
            </div>
          </div>
        </div>

        {/* Section 2: Affordability & Sourcing */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} color="var(--primary)" /> 2. Budget & Ingredient Availability
          </h2>

          <div className="form-group">
            <label className="form-label">How did the weekly grocery cost feel against your budget?</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {[
                { value: 'TOO_EXPENSIVE', label: 'Too Expensive', desc: 'Engine will swap out nuts/paneer for roasted chana/sprouts' },
                { value: 'MODERATE', label: 'Balanced / Just Right', desc: 'Maintains current price-to-nutrition ratio' },
                { value: 'VERY_AFFORDABLE', label: 'Very Affordable', desc: 'Room for premium regional seeds and pulses' }
              ].map(opt => (
                <label
                  key={opt.value}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: affordabilityRating === opt.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: affordabilityRating === opt.value ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <input
                      type="radio"
                      name="affordabilityRating"
                      value={opt.value}
                      checked={affordabilityRating === opt.value}
                      onChange={() => setAffordabilityRating(opt.value)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <strong style={{ fontSize: '0.9rem' }}>{opt.label}</strong>
                  </div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', paddingLeft: '1.4rem' }}>
                    {opt.desc}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Were the ingredients accessible at your local market / kirana store?</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {[
                { value: 'HARD_TO_FIND', label: 'Hard to Find', desc: 'Prefers universal Indian staples only' },
                { value: 'GENERALLY_AVAILABLE', label: 'Generally Available', desc: 'Most common grocers carry them' },
                { value: 'EASILY_AVAILABLE', label: 'Easily Available', desc: 'Found in every neighborhood shop' }
              ].map(opt => (
                <label
                  key={opt.value}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: availabilityRating === opt.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: availabilityRating === opt.value ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <input
                      type="radio"
                      name="availabilityRating"
                      value={opt.value}
                      checked={availabilityRating === opt.value}
                      onChange={() => setAvailabilityRating(opt.value)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <strong style={{ fontSize: '0.9rem' }}>{opt.label}</strong>
                  </div>
                  <span style={{ fontSize: '0.775rem', color: 'var(--text-muted)', display: 'block', paddingLeft: '1.4rem' }}>
                    {opt.desc}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Difficulty & Hunger Satiety */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Clock size={18} color="var(--primary)" /> 3. Recipe Feasibility & Hunger Balance
          </h2>

          <div className="form-group">
            <label className="form-label">
              Recipe Cooking Difficulty (1 = Very Easy / Fast, 5 = Too Complicated)
            </label>
            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', margin: '0.75rem 0' }}>
              {[1, 2, 3, 4, 5].map(rating => (
                <button
                  type="button"
                  key={rating}
                  onClick={() => setDifficultyRating(rating)}
                  style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: 'var(--radius-md)',
                    border: difficultyRating === rating ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: difficultyRating === rating ? 'var(--primary)' : 'var(--surface)',
                    color: difficultyRating === rating ? '#ffffff' : 'var(--text-main)',
                    fontWeight: '800',
                    fontSize: '1.1rem',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease'
                  }}
                >
                  {rating}
                </button>
              ))}
            </div>
            <span className="form-helper">
              Ratings of 4 or 5 automatically tell the engine to prefer quick one-pot meals (chilla, upma, dalia, khichdi) under 20 minutes.
            </span>
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Satiety & Hunger Feelings Throughout the Day</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.75rem' }}>
              {[
                { value: 'TOO_HUNGRY', label: 'Felt Hungry', desc: 'Adds high-fiber complex carbs & protein' },
                { value: 'SLIGHTLY_HUNGRY', label: 'Slightly Hungry', desc: 'Increases portion sizing gently' },
                { value: 'BALANCED', label: 'Perfect Satiety', desc: 'Energized & well-balanced' },
                { value: 'TOO_FULL', label: 'Felt Too Full', desc: 'Lightens evening dinners & snacks' }
              ].map(opt => (
                <label
                  key={opt.value}
                  style={{
                    display: 'block',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: hungerRating === opt.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: hungerRating === opt.value ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                    <input
                      type="radio"
                      name="hungerRating"
                      value={opt.value}
                      checked={hungerRating === opt.value}
                      onChange={() => setHungerRating(opt.value)}
                      style={{ accentColor: 'var(--primary)' }}
                    />
                    <strong style={{ fontSize: '0.85rem' }}>{opt.label}</strong>
                  </div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', paddingLeft: '1.3rem' }}>
                    {opt.desc}
                  </span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Taste Feedback & Satisfaction */}
        <div className="card" style={{ marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Smile size={18} color="var(--primary)" /> 4. Taste, Dislikes & Satisfaction
          </h2>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="likedFoods">Meals / Ingredients You Enjoyed</label>
              <input
                id="likedFoods"
                type="text"
                className="form-input"
                placeholder="e.g. moong dal chilla, roasted makhana, rajma"
                value={likedFoods}
                onChange={(e) => setLikedFoods(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="dislikedFoods">Any Specific Food to Exclude Next Week?</label>
              <input
                id="dislikedFoods"
                type="text"
                className="form-input"
                placeholder="e.g. oats, bottle gourd, soya chunks"
                value={dislikedFoods}
                onChange={(e) => setDislikedFoods(e.target.value)}
              />
              <span className="form-helper">The engine will blacklist these from future recipe selections.</span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Overall Week Satisfaction</label>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', margin: '0.5rem 0' }}>
              {[1, 2, 3, 4, 5].map(star => (
                <button
                  type="button"
                  key={star}
                  onClick={() => setOverallSatisfaction(star)}
                  style={{
                    backgroundColor: 'transparent',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                  title={`${star} Star${star > 1 ? 's' : ''}`}
                >
                  <Star
                    size={28}
                    fill={star <= overallSatisfaction ? '#f59e0b' : 'none'}
                    color={star <= overallSatisfaction ? '#f59e0b' : 'var(--text-light)'}
                  />
                </button>
              ))}
              <span style={{ marginLeft: '0.75rem', fontWeight: '700', fontSize: '0.95rem' }}>
                {overallSatisfaction} / 5 Stars
              </span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="comments">Additional Personal Notes (Optional)</label>
            <textarea
              id="comments"
              rows={3}
              className="form-textarea"
              placeholder="How your digestion felt, personal schedule constraints, etc."
              value={comments}
              onChange={(e) => setComments(e.target.value)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '3rem' }}>
          <button
            type="submit"
            className="btn btn-primary btn-lg"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <span className="spinner"></span> Updating Engine & Formulating Week {currentWeek + 1}...
              </>
            ) : (
              <>
                <RefreshCw size={18} /> Submit Review & Adapt Week {currentWeek + 1} Plan <ArrowRight size={18} />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default FeedbackPage;
