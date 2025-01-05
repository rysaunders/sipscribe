import { useNavigate, useLocation } from 'react-router-dom';
import TastingForm from '../components/TastingForm';
import { TastingFormData, BeverageType } from '../types';
import { addTasting } from '../lib/db';

interface LocationState {
  type?: BeverageType;
}

export default function AddTasting() {
  const navigate = useNavigate();
  const location = useLocation();
  const { type } = (location.state as LocationState) || {};

  const handleSubmit = async (data: TastingFormData) => {
    await addTasting({
      ...data,
      overallScore: (data.aromaScore + data.palateScore + data.finishScore) / 3,
    });
    navigate('/');
  };

  return (
    <div>
      <div className="mb-6">
        <h2 className="font-serif text-3xl font-bold text-gray-900">
          Add {type ? `${type.charAt(0).toUpperCase()}${type.slice(1)} Tasting` : 'New Tasting'}
        </h2>
      </div>
      <TastingForm onSubmit={handleSubmit} initialData={type ? { type } : undefined} />
    </div>
  );
} 