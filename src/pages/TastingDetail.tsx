import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { TastingEntry } from '../types';
import { db, deleteTasting } from '../lib/db';

export default function TastingDetail() {
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

  const handleDelete = async () => {
    if (!id) return;
    if (window.confirm('Are you sure you want to delete this tasting?')) {
      await deleteTasting(id);
      navigate('/');
    }
  };

  if (!tasting) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-burgundy-600"></div>
      </div>
    );
  }

  const isWine = tasting.type === 'wine';
  const accentColor = isWine ? 'burgundy' : 'whiskey';

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900">{tasting.name}</h2>
          <div className="mt-2 flex items-center space-x-2">
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
              isWine ? 'bg-burgundy-100 text-burgundy-800' : 'bg-whiskey-100 text-whiskey-800'
            }`}>
              {tasting.type}
            </span>
            <span className="text-gray-400">•</span>
            <span className="text-sm text-gray-500">
              {new Date(tasting.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex space-x-4">
          <Link
            to={`/edit/${id}`}
            className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-gradient-to-r from-${accentColor}-600 to-${accentColor}-700 hover:from-${accentColor}-700 hover:to-${accentColor}-800`}
          >
            Edit Tasting
          </Link>
          <button
            onClick={handleDelete}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>

      <div className="space-y-8">
        {tasting.imageBase64 && (
          <div className="relative h-96 rounded-xl overflow-hidden shadow-lg">
            <img
              src={tasting.imageBase64}
              alt={tasting.name}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
          </div>
        )}

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
          <div className={`bg-${accentColor}-50 border border-${accentColor}-100 rounded-lg p-6`}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Details</h3>
            <div className="space-y-4">
              {isWine ? (
                <>
                  {tasting.vintage && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Vintage</span>
                      <p className="mt-1 text-lg text-gray-900">{tasting.vintage}</p>
                    </div>
                  )}
                  {tasting.varietal && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Varietal</span>
                      <p className="mt-1 text-lg text-gray-900">{tasting.varietal}</p>
                    </div>
                  )}
                  {tasting.region && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Region</span>
                      <p className="mt-1 text-lg text-gray-900">{tasting.region}</p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {tasting.distillery && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Distillery</span>
                      <p className="mt-1 text-lg text-gray-900">{tasting.distillery}</p>
                    </div>
                  )}
                  {tasting.ageStatement && (
                    <div>
                      <span className="text-sm font-medium text-gray-500">Age Statement</span>
                      <p className="mt-1 text-lg text-gray-900">{tasting.ageStatement} Years</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          <div className={`bg-${accentColor}-50 border border-${accentColor}-100 rounded-lg p-6`}>
            <h3 className="text-lg font-medium text-gray-900 mb-4">Scores</h3>
            <div className="space-y-6">
              <div>
                <span className="text-sm font-medium text-gray-500">Overall Score</span>
                <p className={`mt-1 text-4xl font-bold text-${accentColor}-600`}>
                  {tasting.overallScore.toFixed(1)}/10
                </p>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-500">Aroma</span>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{tasting.aromaScore}/10</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Palate</span>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{tasting.palateScore}/10</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-500">Finish</span>
                  <p className="mt-1 text-xl font-semibold text-gray-900">{tasting.finishScore}/10</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-6">Tasting Notes</h3>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <span className="block text-sm font-medium text-gray-500">Color</span>
              <p className="mt-2 text-gray-900">{tasting.colorNotes}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Nose</span>
              <p className="mt-2 text-gray-900">{tasting.noseNotes}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Palate</span>
              <p className="mt-2 text-gray-900">{tasting.palateNotes}</p>
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-500">Finish</span>
              <p className="mt-2 text-gray-900">{tasting.finishNotes}</p>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Pairing Suggestions</h3>
          <p className="text-gray-900">{tasting.pairingSuggestions}</p>
        </div>
      </div>
    </div>
  );
} 