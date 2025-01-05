import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import TastingForm from '../components/TastingForm';
import { TastingEntry, TastingFormData } from '../types';
import { db, updateTasting } from '../lib/db';

export default function EditTasting() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [tasting, setTasting] = useState<TastingEntry | null>(null);

  useEffect(() => {
    const loadTasting = async () => {
      if (!id) return;
      const entry = await db.tastings.get(id);
      if (entry) {
        setTasting(entry);
      } else {
        navigate('/');
      }
    };
    loadTasting();
  }, [id, navigate]);

  const handleSubmit = async (data: TastingFormData) => {
    if (!id) return;
    await updateTasting(id, {
      ...data,
      overallScore: (data.aromaScore + data.palateScore + data.finishScore) / 3,
    });
    navigate('/');
  };

  if (!tasting) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Edit Tasting</h2>
      </div>
      <TastingForm
        initialData={tasting}
        onSubmit={handleSubmit}
        isEditing
      />
    </div>
  );
} 