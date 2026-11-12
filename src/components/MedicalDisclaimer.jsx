import React from 'react';
import { AlertCircle } from 'lucide-react';

const MedicalDisclaimer = ({ compact = false }) => {
  if (compact) {
    return (
      <div className="alert alert-info" style={{ margin: 0, padding: '0.65rem 1rem', fontSize: '0.8rem' }}>
        <AlertCircle size={16} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div>
          <strong>Wellness Notice:</strong> Skinwise diet recommendations support general nutrition and skin barrier health. They are not medical treatments or cures for skin disorders.
        </div>
      </div>
    );
  }

  return (
    <div className="alert alert-info" style={{ borderRadius: 'var(--radius-lg)' }}>
      <AlertCircle size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
      <div>
        <strong style={{ display: 'block', fontSize: '0.95rem', marginBottom: '0.2rem' }}>
          Educational & Nutrition Support Disclaimer
        </strong>
        <p style={{ fontSize: '0.85rem', lineHeight: '1.4' }}>
          Skinwise provides personalized, budget-conscious dietary suggestions formulated with nutrient-dense regional foods to support general skin health and balanced nutrition. This system is <strong>not a medical diagnostic, prescriptive, or therapeutic tool</strong>. It does not promise to cure acne, eczema, psoriasis, fungal infections, or any other medical condition. Always consult a certified dermatologist or healthcare professional for clinical diagnoses and medical treatments.
        </p>
      </div>
    </div>
  );
};

export default MedicalDisclaimer;
