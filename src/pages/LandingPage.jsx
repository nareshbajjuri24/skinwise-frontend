import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import MedicalDisclaimer from '../components/MedicalDisclaimer';
import { 
  Sparkles, 
  DollarSign, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight, 
  CheckCircle2, 
  HeartHandshake, 
  CalendarCheck,
  Scale
} from 'lucide-react';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        padding: '3.5rem 1.5rem',
        textAlign: 'center',
        background: 'radial-gradient(ellipse at top, #ecfdf5 0%, #f8fafc 70%)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: '3rem',
        border: '1px solid var(--border)'
      }}>
        <div style={{ maxWidth: '850px', margin: '0 auto' }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.4rem',
            padding: '0.35rem 0.85rem',
            backgroundColor: 'var(--primary-light)',
            color: 'var(--primary-dark)',
            borderRadius: '9999px',
            fontSize: '0.8rem',
            fontWeight: '700',
            marginBottom: '1.25rem',
            border: '1px solid #a7f3d0'
          }}>
            <Sparkles size={14} color="var(--primary)" />
            Personalized Skin Wellness • Budget-First Nutrition
          </div>

          <h1 style={{
            fontSize: '2.75rem',
            fontWeight: '800',
            lineHeight: '1.2',
            letterSpacing: '-0.03em',
            color: 'var(--text-main)',
            marginBottom: '1.25rem'
          }}>
            Smart Diet Planning Tailored to Your{' '}
            <span style={{
              background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              Skin Health & Budget
            </span>
          </h1>

          <p style={{
            fontSize: '1.15rem',
            color: 'var(--text-muted)',
            lineHeight: '1.6',
            marginBottom: '2rem',
            maxWidth: '720px',
            margin: '0 auto 2rem auto'
          }}>
            Skinwise formulates practical 12-week vegetarian and non-vegetarian diet plans using affordable regional staples (dal, sprouts, seasonal greens, curd, seeds). It dynamically adapts each week based on your actual budget, satiety, and ingredient feedback.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
            {isAuthenticated ? (
              <Link to="/dashboard" className="btn btn-primary btn-lg">
                Go to Your Dashboard <ArrowRight size={18} />
              </Link>
            ) : (
              <>
                <Link to="/register" className="btn btn-primary btn-lg">
                  Start Your 12-Week Journey <ArrowRight size={18} />
                </Link>
                <Link to="/login" className="btn btn-secondary btn-lg">
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Transparent Medical Disclaimer Banner */}
          <div style={{ maxWidth: '780px', margin: '0 auto', textAlign: 'left' }}>
            <MedicalDisclaimer />
          </div>
        </div>
      </section>

      {/* Main Features */}
      <section id="features" style={{ marginBottom: '4rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
            Engineered for Real Lives, Real Budgets
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
            Nutritional science meets practical economics. You never need expensive exotic supplements to nourish your skin.
          </p>
        </div>

        <div className="grid-3">
          <div className="card">
            <div style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <DollarSign size={24} />
            </div>
            <h3 className="card-title">Budget-First Optimization</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Set your real weekly food budget (e.g. ₹1,000–₹1,500). Skinwise selects economical, nutrient-dense local alternatives (roasted chana, moong, peanuts, buttermilk) without compromising essential micronutrients.
            </p>
          </div>

          <div className="card">
            <div style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--info-bg)',
              color: 'var(--info)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <RefreshCw size={24} />
            </div>
            <h3 className="card-title">12-Week Adaptive Feedback</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Did a recipe feel too costly? Was an ingredient difficult to source? Too hungry? Submit weekly feedback, and our rule-based engine immediately adjusts the upcoming week's plan with transparent rationale.
            </p>
          </div>

          <div className="card">
            <div style={{
              width: '2.75rem',
              height: '2.75rem',
              borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--warning-bg)',
              color: 'var(--warning)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem'
            }}>
              <ShieldCheck size={24} />
            </div>
            <h3 className="card-title">Allergy & Preference Safe</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
              Select Dairy-Free, Gluten-Free, Nut-Free, Vegetarian, Vegan, Eggetarian, or Non-Vegetarian. Skinwise rigorously filters allergens and disliked foods at the database level.
            </p>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" style={{
        backgroundColor: 'var(--surface)',
        borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)',
        padding: '3rem 2rem',
        marginBottom: '4rem'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <span style={{ color: 'var(--primary)', fontWeight: '700', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Simple 4-Step System
          </span>
          <h2 style={{ fontSize: '1.85rem', fontWeight: '800', color: 'var(--text-main)', marginTop: '0.25rem' }}>
            How Skinwise Works
          </h2>
        </div>

        <div className="grid-4">
          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-dark)',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              1
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.4rem' }}>Assessment</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Specify age, skin concerns, dietary preference, allergies, and realistic food budget.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-dark)',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              2
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.4rem' }}>7-Day Smart Plan</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Get 5 daily meals (Breakfast, 2 Snacks, Lunch, Dinner) with portions, cost estimates & prep guides.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-dark)',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              3
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.4rem' }}>Track & Follow</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Check off meals with 1-click. Export or print clean weekly meal sheets for your kitchen fridge.
            </p>
          </div>

          <div style={{ textAlign: 'center', padding: '1rem' }}>
            <div style={{
              width: '2.5rem',
              height: '2.5rem',
              borderRadius: '50%',
              backgroundColor: 'var(--primary-light)',
              color: 'var(--primary-dark)',
              fontWeight: '800',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 1rem auto'
            }}>
              4
            </div>
            <h4 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '0.4rem' }}>Adaptive Refinement</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Submit weekly reviews. The algorithm automatically tailors next week's meal substitutions.
            </p>
          </div>
        </div>
      </section>

      {/* Call to action card */}
      <section style={{
        background: 'linear-gradient(135deg, var(--primary-dark), #0f766e)',
        color: '#ffffff',
        borderRadius: 'var(--radius-xl)',
        padding: '3rem 2rem',
        textAlign: 'center',
        marginBottom: '2rem'
      }}>
        <h2 style={{ fontSize: '2rem', fontWeight: '800', marginBottom: '1rem' }}>
          Ready to Build Your Personalized Skin Diet Plan?
        </h2>
        <p style={{ fontSize: '1.05rem', opacity: 0.9, maxWidth: '650px', margin: '0 auto 2rem auto', lineHeight: '1.6' }}>
          Join Skinwise today to generate an evidence-informed, budget-conscious meal plan designed around your regional food accessibility.
        </p>
        <Link to="/register" className="btn btn-lg" style={{ backgroundColor: '#ffffff', color: 'var(--primary-dark)' }}>
          Create Your Free Account <ArrowRight size={18} />
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;
