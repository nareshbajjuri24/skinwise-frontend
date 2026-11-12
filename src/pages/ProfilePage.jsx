import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { profileApi } from '../api/profileApi';
import { dietPlanApi } from '../api/dietPlanApi';
import { useAuth } from '../context/AuthContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { 
  User, 
  Sparkles, 
  ShieldAlert, 
  DollarSign, 
  MapPin, 
  Activity, 
  Save, 
  RefreshCw, 
  AlertCircle,
  CheckCircle2,
  Heart
} from 'lucide-react';

const SKIN_TYPES = [
  { value: 'OILY', label: 'Oily (Prone to excess sebum & shine)' },
  { value: 'DRY', label: 'Dry (Flaky, tight, lacks hydration)' },
  { value: 'COMBINATION', label: 'Combination (Oily T-zone, dry cheeks)' },
  { value: 'SENSITIVE', label: 'Sensitive (Prone to redness & reactivity)' },
  { value: 'NORMAL', label: 'Normal (Relatively balanced)' }
];

const SKIN_CONCERNS = [
  { id: 'ACNE', label: 'Acne & Active Breakouts' },
  { id: 'ECZEMA', label: 'Eczema & Atopic Sensitivity' },
  { id: 'DRYNESS', label: 'Dehydration & Barrier Impairment' },
  { id: 'DULLNESS', label: 'Dull Complexion & Uneven Tone' },
  { id: 'INFLAMMATION', label: 'Facial Redness & Inflammation' },
  { id: 'HYPERPIGMENTATION', label: 'Post-Inflammatory Hyperpigmentation' },
  { id: 'AGING', label: 'Fine Lines & Collagen Support' }
];

const ALLERGIES_LIST = [
  { id: 'DAIRY', label: 'Dairy / Lactose' },
  { id: 'GLUTEN', label: 'Gluten / Wheat' },
  { id: 'NUTS', label: 'Peanuts & Tree Nuts' },
  { id: 'SOY', label: 'Soy / Soya' },
  { id: 'EGGS', label: 'Eggs' },
  { id: 'FISH', label: 'Fish & Seafood' }
];

const HEALTH_CONDITIONS_LIST = [
  { id: 'PCOS', label: 'PCOS / PCOD' },
  { id: 'DIABETES', label: 'Pre-Diabetes / High Blood Sugar' },
  { id: 'HYPERTENSION', label: 'High Blood Pressure' },
  { id: 'THYROID', label: 'Thyroid Imbalance' }
];

const REGIONS = [
  'India - North (Wheat, Rajma, Dal, Seasonal greens)',
  'India - South (Rice, Lentils, Coconut, Millets)',
  'India - West (Jowar, Bajra, Moong, Groundnuts)',
  'India - East (Rice, Moong, Freshwater fish, Greens)',
  'India - General (Standard affordable staples)',
  'Global (International accessible staples)'
];

const ProfilePage = () => {
  const { setHasProfile } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    age: 26,
    gender: 'FEMALE',
    skinType: 'COMBINATION',
    skinConcerns: ['ACNE'],
    allergies: [],
    dietaryPreference: 'VEGETARIAN',
    healthConditions: [],
    dislikedFoods: '',
    weeklyBudget: 1400,
    currency: 'INR',
    countryRegion: 'India - General',
    activityLevel: 'MODERATE',
    mealsPerDay: 5,
    targetCalories: 1900
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await profileApi.getProfile();
        if (res?.data) {
          setFormData(prev => ({
            ...prev,
            ...res.data,
            skinConcerns: res.data.skinConcerns || [],
            allergies: res.data.allergies || [],
            healthConditions: res.data.healthConditions || []
          }));
          setHasProfile(true);
        }
      } catch (err) {
        // If profile doesn't exist yet, form remains with sensible defaults
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [setHasProfile]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxToggle = (category, itemValue) => {
    setFormData(prev => {
      const currentList = prev[category] || [];
      const updated = currentList.includes(itemValue)
        ? currentList.filter(item => item !== itemValue)
        : [...currentList, itemValue];
      return { ...prev, [category]: updated };
    });
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.age || formData.age < 12 || formData.age > 120) {
      setErrorMsg('Please enter a valid age between 12 and 120');
      return;
    }
    if (!formData.weeklyBudget || formData.weeklyBudget < 100) {
      setErrorMsg('Please specify a weekly budget of at least ₹100');
      return;
    }

    try {
      setSaving(true);
      await profileApi.saveProfile(formData);
      setHasProfile(true);
      setSuccessMsg('Profile and dietary assessment saved successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save profile. Please check inputs.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAndGenerate = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    try {
      setGenerating(true);
      // First save profile
      await profileApi.saveProfile(formData);
      setHasProfile(true);
      // Then generate diet plan
      await dietPlanApi.generatePlan();
      navigate('/diet-plan');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to generate plan. Please try again.');
      setGenerating(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh', flexDirection: 'column', gap: '1rem' }}>
        <div className="spinner" style={{ width: '2.5rem', height: '2.5rem', borderColor: 'rgba(5, 150, 105, 0.2)', borderTopColor: 'var(--primary)' }}></div>
        <p style={{ color: 'var(--text-muted)' }}>Loading dietary profile...</p>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto' }}>
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.02em', marginBottom: '0.4rem' }}>
          Personal Assessment & Diet Profile
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Tell us about your skin characteristics, dietary boundaries, and weekly food budget. Our smart engine optimizes your 7-day meal plan accordingly.
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
        {/* Section 1: Demographics */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <User size={18} color="var(--primary)" /> 1. Personal Profile
          </h2>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="age">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                min="12"
                max="120"
                className="form-input"
                value={formData.age}
                onChange={handleInputChange}
                required
              />
              <span className="form-helper">Calorie targets adjust for age and life stage.</span>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="gender">Gender / Profile</label>
              <select
                id="gender"
                name="gender"
                className="form-select"
                value={formData.gender}
                onChange={handleInputChange}
                required
              >
                <option value="FEMALE">Female</option>
                <option value="MALE">Male</option>
                <option value="OTHER">Non-binary / Other</option>
                <option value="PREFER_NOT_TO_SAY">Prefer not to say</option>
              </select>
            </div>
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="activityLevel">Daily Physical Activity</label>
              <select
                id="activityLevel"
                name="activityLevel"
                className="form-select"
                value={formData.activityLevel}
                onChange={handleInputChange}
              >
                <option value="SEDENTARY">Sedentary (Desk work, little exercise)</option>
                <option value="MODERATE">Moderate (Active daily, 3-4 workouts/wk)</option>
                <option value="ACTIVE">Very Active (Labor, intense training daily)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="countryRegion">Regional Food Accessibility</label>
              <select
                id="countryRegion"
                name="countryRegion"
                className="form-select"
                value={formData.countryRegion}
                onChange={handleInputChange}
              >
                {REGIONS.map(reg => (
                  <option key={reg} value={reg}>{reg}</option>
                ))}
              </select>
              <span className="form-helper">Informs which staple ingredients are cheapest and easiest to source.</span>
            </div>
          </div>
        </div>

        {/* Section 2: Skin Health Profile */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Sparkles size={18} color="var(--primary)" /> 2. Skin Characteristics & Concerns
          </h2>

          <div className="form-group">
            <label className="form-label">Primary Skin Type</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
              {SKIN_TYPES.map(type => (
                <label
                  key={type.value}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.75rem 1rem',
                    borderRadius: 'var(--radius-md)',
                    border: formData.skinType === type.value ? '2px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: formData.skinType === type.value ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer',
                    fontSize: '0.875rem'
                  }}
                >
                  <input
                    type="radio"
                    name="skinType"
                    value={type.value}
                    checked={formData.skinType === type.value}
                    onChange={handleInputChange}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>{type.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1.5rem' }}>
            <label className="form-label">Specific Skin Concerns to Support (Select all that apply)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.65rem' }}>
              {SKIN_CONCERNS.map(concern => (
                <label
                  key={concern.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.6rem',
                    padding: '0.65rem 0.85rem',
                    borderRadius: 'var(--radius-md)',
                    border: formData.skinConcerns.includes(concern.id) ? '1.5px solid var(--primary)' : '1px solid var(--border)',
                    backgroundColor: formData.skinConcerns.includes(concern.id) ? 'var(--primary-light)' : 'var(--surface)',
                    cursor: 'pointer',
                    fontSize: '0.85rem'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.skinConcerns.includes(concern.id)}
                    onChange={() => handleCheckboxToggle('skinConcerns', concern.id)}
                    style={{ accentColor: 'var(--primary)' }}
                  />
                  <span>{concern.label}</span>
                </label>
              ))}
            </div>
            <span className="form-helper" style={{ marginTop: '0.5rem', display: 'block' }}>
              The engine prioritizes micronutrients (e.g., zinc for acne, omega-3 for inflammation, vitamin C for dullness).
            </span>
          </div>
        </div>

        {/* Section 3: Dietary Boundaries & Budget */}
        <div className="card" style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.15rem', fontWeight: '700', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <DollarSign size={18} color="var(--primary)" /> 3. Diet Preference, Allergies & Budget
          </h2>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label" htmlFor="dietaryPreference">Dietary Preference</label>
              <select
                id="dietaryPreference"
                name="dietaryPreference"
                className="form-select"
                value={formData.dietaryPreference}
                onChange={handleInputChange}
                required
              >
                <option value="VEGETARIAN">Vegetarian (Plant-based + Dairy)</option>
                <option value="VEGAN">100% Vegan (Plant-based only)</option>
                <option value="EGGETARIAN">Eggetarian (Vegetarian + Eggs)</option>
                <option value="NON_VEGETARIAN">Non-Vegetarian (Vegetarian + Eggs, Fish, Poultry)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="weeklyBudget">Weekly Food Budget (INR ₹)</label>
              <div style={{ position: 'relative' }}>
                <input
                  id="weeklyBudget"
                  name="weeklyBudget"
                  type="number"
                  min="200"
                  step="50"
                  className="form-input"
                  style={{ paddingLeft: '2rem' }}
                  value={formData.weeklyBudget}
                  onChange={handleInputChange}
                  required
                />
                <span style={{ position: 'absolute', left: '0.85rem', top: '50%', transform: 'translateY(-50%)', fontWeight: '700', color: 'var(--text-muted)' }}>₹</span>
              </div>
              <span className="form-helper">e.g. ₹1,200 to ₹1,800/week (covers 35 nutritious meals).</span>
            </div>
          </div>

          {/* Allergies checkboxes */}
          <div className="form-group">
            <label className="form-label">Food Allergies & Intolerances (Recipes will exclude these)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem' }}>
              {ALLERGIES_LIST.map(allergy => (
                <label
                  key={allergy.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: formData.allergies.includes(allergy.id) ? '1.5px solid var(--danger)' : '1px solid var(--border)',
                    backgroundColor: formData.allergies.includes(allergy.id) ? 'var(--danger-bg)' : 'var(--surface)',
                    cursor: 'pointer',
                    fontSize: '0.825rem'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.allergies.includes(allergy.id)}
                    onChange={() => handleCheckboxToggle('allergies', allergy.id)}
                    style={{ accentColor: 'var(--danger)' }}
                  />
                  <span>{allergy.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Health conditions */}
          <div className="form-group">
            <label className="form-label">Pre-existing Metabolic Conditions (Optional)</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.5rem' }}>
              {HEALTH_CONDITIONS_LIST.map(cond => (
                <label
                  key={cond.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.55rem 0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    border: formData.healthConditions.includes(cond.id) ? '1.5px solid var(--warning)' : '1px solid var(--border)',
                    backgroundColor: formData.healthConditions.includes(cond.id) ? 'var(--warning-bg)' : 'var(--surface)',
                    cursor: 'pointer',
                    fontSize: '0.825rem'
                  }}
                >
                  <input
                    type="checkbox"
                    checked={formData.healthConditions.includes(cond.id)}
                    onChange={() => handleCheckboxToggle('healthConditions', cond.id)}
                    style={{ accentColor: 'var(--warning)' }}
                  />
                  <span>{cond.label}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="dislikedFoods">Disliked Foods to Avoid (Comma-separated)</label>
            <input
              id="dislikedFoods"
              name="dislikedFoods"
              type="text"
              className="form-input"
              placeholder="e.g. bitter gourd, mushroom, brinjal"
              value={formData.dislikedFoods || ''}
              onChange={handleInputChange}
            />
            <span className="form-helper">The planning algorithm will avoid recipes containing these items.</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'flex-end',
          flexWrap: 'wrap',
          marginBottom: '3rem'
        }}>
          <button
            type="submit"
            className="btn btn-secondary btn-lg"
            disabled={saving || generating}
          >
            {saving ? <span className="spinner"></span> : <Save size={18} />}
            Save Assessment
          </button>

          <button
            type="button"
            onClick={handleSaveAndGenerate}
            className="btn btn-primary btn-lg"
            disabled={saving || generating}
          >
            {generating ? (
              <>
                <span className="spinner"></span> Formulating 7-Day Plan...
              </>
            ) : (
              <>
                <RefreshCw size={18} /> Save & Generate 7-Day Plan
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProfilePage;
