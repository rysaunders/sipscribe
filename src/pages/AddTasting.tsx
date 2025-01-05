import { useNavigate } from 'react-router-dom';
import TastingForm from '../components/TastingForm';
import { TastingFormData } from '../types';
import { addTasting } from '../lib/db';

export default function AddTasting() {
  const navigate = useNavigate();

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
        <h2 className="text-2xl font-bold text-gray-900">Add New Tasting</h2>
      </div>
      <TastingForm onSubmit={handleSubmit} />
    </div>
  );
} 