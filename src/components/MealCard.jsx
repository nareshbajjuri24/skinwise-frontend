import React, { useState } from 'react';
import { 
  CheckCircle2, 
  Circle, 
  ChevronDown, 
  ChevronUp, 
  Clock, 
  Sparkles, 
  DollarSign, 
  AlertTriangle, 
  Repeat,
  ChefHat
} from 'lucide-react';

const MealCard = ({ mealItem, onToggleComplete, isUpdating = false }) => {
  const [expanded, setExpanded] = useState(false);
  const recipe = mealItem.recipe || {};

  const getMealTypeBadgeClass = (type) => {
    switch (type) {
      case 'BREAKFAST': return 'badge-primary';
      case 'MORNING_SNACK': return 'badge-info';
      case 'LUNCH': return 'badge-warning';
      case 'EVENING_SNACK': return 'badge-info';
      case 'DINNER': return 'badge-primary';
      default: return 'badge-neutral';
    }
  };

  const formatMealSlot = (slot) => {
    return slot ? slot.replace('_', ' ') : 'MEAL';
  };

  return (
    <div 
      className="card" 
      style={{
        borderLeft: mealItem.completed ? '5px solid var(--success)' : '5px solid var(--border)',
        backgroundColor: mealItem.completed ? '#f0fdf4' : 'var(--surface)',
        transition: 'all 0.25s ease',
        padding: '1.25rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
            <span className={`badge ${getMealTypeBadgeClass(mealItem.mealType)}`}>
              {formatMealSlot(mealItem.mealType)}
            </span>
            {recipe.dietaryType && (
              <span className="badge badge-neutral">
                {recipe.dietaryType}
              </span>
            )}
            {recipe.prepTimeMinutes && (
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'inline-flex', alignItems: 'center', gap: '0.2rem' }}>
                <Clock size={12} /> {recipe.prepTimeMinutes} mins
              </span>
            )}
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: 'var(--text-main)', marginBottom: '0.25rem' }}>
            {recipe.name || 'Custom Meal Serving'}
          </h3>
          <p style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Portion: <strong>{recipe.portionSize || '1 balanced portion'}</strong>
          </p>
        </div>

        {/* Completion Action Toggle */}
        <button
          onClick={() => onToggleComplete(mealItem.id)}
          disabled={isUpdating}
          title={mealItem.completed ? "Mark as skipped/pending" : "Mark as completed/followed"}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.35rem',
            padding: '0.4rem 0.75rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: mealItem.completed ? 'var(--success-bg)' : 'var(--surface-alt)',
            color: mealItem.completed ? 'var(--success)' : 'var(--text-muted)',
            fontWeight: '600',
            fontSize: '0.8rem',
            border: '1px solid ' + (mealItem.completed ? 'var(--success)' : 'var(--border)'),
            transition: 'all 0.2s ease',
            flexShrink: 0
          }}
        >
          {mealItem.completed ? (
            <>
              <CheckCircle2 size={16} /> Followed
            </>
          ) : (
            <>
              <Circle size={16} /> Mark Done
            </>
          )}
        </button>
      </div>

      {/* Nutrient & Cost Pill Summary */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '0.5rem',
        alignItems: 'center',
        padding: '0.6rem 0.8rem',
        backgroundColor: mealItem.completed ? 'rgba(255,255,255,0.7)' : 'var(--surface-alt)',
        borderRadius: 'var(--radius-md)',
        marginBottom: '0.75rem',
        fontSize: '0.8rem'
      }}>
        {recipe.estimatedCalories && (
          <span style={{ fontWeight: '600' }}>
            🔥 ~{recipe.estimatedCalories} kcal
          </span>
        )}
        {recipe.proteinGrams != null && (
          <span style={{ color: 'var(--text-muted)' }}>• Protein: <strong>{recipe.proteinGrams}g</strong></span>
        )}
        {recipe.carbsGrams != null && (
          <span style={{ color: 'var(--text-muted)' }}>• Carbs: <strong>{recipe.carbsGrams}g</strong></span>
        )}
        {recipe.fiberGrams != null && (
          <span style={{ color: 'var(--text-muted)' }}>• Fiber: <strong>{recipe.fiberGrams}g</strong></span>
        )}
        <span style={{ marginLeft: 'auto', fontWeight: '700', color: 'var(--primary-dark)', display: 'inline-flex', alignItems: 'center' }}>
          ₹{recipe.estimatedCost ? Number(recipe.estimatedCost).toFixed(2) : '0.00'}
        </span>
      </div>

      {/* Skin Health Highlight Note */}
      {(recipe.skinHealthHighlights || mealItem.customNotes) && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.45rem',
          fontSize: '0.82rem',
          color: 'var(--primary-dark)',
          backgroundColor: 'var(--primary-light)',
          padding: '0.5rem 0.75rem',
          borderRadius: 'var(--radius-sm)',
          marginBottom: '0.5rem'
        }}>
          <Sparkles size={15} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--primary)' }} />
          <span>{recipe.skinHealthHighlights || mealItem.customNotes}</span>
        </div>
      )}

      {/* Allergen Tag if any */}
      {recipe.allergenInfo && recipe.allergenInfo !== 'NONE' && (
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.775rem',
          color: 'var(--warning)',
          marginBottom: '0.5rem'
        }}>
          <AlertTriangle size={13} />
          <span>Contains allergens: <strong>{recipe.allergenInfo}</strong></span>
        </div>
      )}

      {/* Expand/Collapse Preparation & Substitutes */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          paddingTop: '0.4rem',
          borderTop: '1px solid var(--border)',
          fontSize: '0.8rem',
          color: 'var(--text-muted)',
          fontWeight: '600'
        }}
      >
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
          <ChefHat size={14} /> {expanded ? 'Hide Recipe Instructions' : 'View Preparation & Substitutes'}
        </span>
        {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>

      {expanded && (
        <div style={{
          marginTop: '0.75rem',
          paddingTop: '0.75rem',
          borderTop: '1px dashed var(--border)',
          fontSize: '0.825rem',
          color: 'var(--text-main)',
          lineHeight: '1.5'
        }}>
          {recipe.instructions && (
            <div style={{ marginBottom: '0.65rem' }}>
              <strong style={{ display: 'block', marginBottom: '0.3rem', color: 'var(--text-main)' }}>
                Quick Preparation:
              </strong>
              <p style={{ whiteSpace: 'pre-line', color: 'var(--text-muted)' }}>
                {recipe.instructions}
              </p>
            </div>
          )}

          {recipe.substitutes && (
            <div style={{
              backgroundColor: 'var(--surface-alt)',
              padding: '0.5rem 0.75rem',
              borderRadius: 'var(--radius-sm)',
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.4rem',
              color: 'var(--text-muted)'
            }}>
              <Repeat size={14} style={{ flexShrink: 0, marginTop: '2px', color: 'var(--secondary)' }} />
              <div>
                <strong style={{ color: 'var(--text-main)' }}>Budget & Allergen Swap: </strong>
                {recipe.substitutes}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default MealCard;
