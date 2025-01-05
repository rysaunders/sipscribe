import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { TastingEntry, BeverageType } from '../types';
import { getAllTastings } from '../lib/db';

export default function TastingList() {
  const [tastings, setTastings] = useState<TastingEntry[]>([]);
  const [filter, setFilter] = useState<BeverageType | 'all'>('all');

  useEffect(() => {
    const loadTastings = async () => {
      const entries = await getAllTastings();
      setTastings(entries);
    };
    loadTastings();
  }, []);

  const filteredTastings = filter === 'all' 
    ? tastings 
    : tastings.filter(t => t.type === filter);

  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
        <div>
          <h2 className="font-serif text-3xl font-bold text-gray-900">Tasting Journal</h2>
          <p className="mt-1 text-sm text-gray-500">
            Your personal collection of wine and whisky experiences
          </p>
        </div>
        <div className="w-full sm:w-64">
          <label className="block text-sm font-medium text-gray-700 mb-1">Filter by Type</label>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as BeverageType | 'all')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-burgundy-500 focus:ring-burgundy-500"
          >
            <option value="all">All Tastings</option>
            <option value="wine">Wine Only</option>
            <option value="whisky">Whisky Only</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredTastings.map((tasting) => (
          <Link
            key={tasting.id}
            to={`/tasting/${tasting.id}`}
            className={`block bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow overflow-hidden ${
              tasting.type === 'wine' ? 'bg-wine-pattern' : 'bg-whiskey-pattern'
            }`}
          >
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-serif text-xl font-medium text-gray-900">{tasting.name}</h3>
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  tasting.type === 'wine'
                    ? 'bg-burgundy-100 text-burgundy-800'
                    : 'bg-whiskey-100 text-whiskey-800'
                }`}>
                  {tasting.type}
                </span>
              </div>
              
              {tasting.imageBase64 && (
                <div className="relative h-48 -mx-6 -mt-4 mb-4">
                  <img
                    src={tasting.imageBase64}
                    alt={tasting.name}
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm font-medium text-gray-500">Overall Score</span>
                  <span className={`text-2xl font-bold ${
                    tasting.type === 'wine' ? 'text-burgundy-600' : 'text-whiskey-600'
                  }`}>
                    {tasting.overallScore.toFixed(1)}/10
                  </span>
                </div>

                <div className="text-sm text-gray-600">
                  {tasting.type === 'wine' ? (
                    <div className="flex flex-wrap gap-2">
                      {tasting.vintage && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-burgundy-50 text-burgundy-700">
                          {tasting.vintage}
                        </span>
                      )}
                      {tasting.varietal && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-burgundy-50 text-burgundy-700">
                          {tasting.varietal}
                        </span>
                      )}
                      {tasting.region && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-burgundy-50 text-burgundy-700">
                          {tasting.region}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {tasting.distillery && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-whiskey-50 text-whiskey-700">
                          {tasting.distillery}
                        </span>
                      )}
                      {tasting.ageStatement && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded bg-whiskey-50 text-whiskey-700">
                          {tasting.ageStatement} Years
                        </span>
                      )}
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <div className="flex justify-between text-sm">
                    <div>
                      <span className="text-gray-500">Aroma</span>
                      <p className="font-medium">{tasting.aromaScore}/10</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Palate</span>
                      <p className="font-medium">{tasting.palateScore}/10</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Finish</span>
                      <p className="font-medium">{tasting.finishScore}/10</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>

      {filteredTastings.length === 0 && (
        <div className="text-center py-12">
          <div className="font-serif text-2xl font-medium text-gray-900 mb-2">
            No tastings found
          </div>
          <p className="text-gray-500 mb-6">
            Start your journey by adding your first tasting note
          </p>
          <Link
            to="/add"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-burgundy-600 to-whiskey-700 hover:from-burgundy-700 hover:to-whiskey-800"
          >
            Add New Tasting
          </Link>
        </div>
      )}
    </div>
  );
} 