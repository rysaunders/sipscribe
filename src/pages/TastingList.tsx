import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { TastingEntry, BeverageType } from '../types';
import { getAllTastings, exportTastings, importTastings } from '../lib/db';

export default function TastingList() {
  const [tastings, setTastings] = useState<TastingEntry[]>([]);
  const [filter, setFilter] = useState<BeverageType | 'all'>('all');
  const [importStatus, setImportStatus] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const loadTastings = async () => {
      const entries = await getAllTastings();
      setTastings(entries);
    };
    loadTastings();
  }, []);

  const handleExport = async () => {
    await exportTastings();
  };

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleImportFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await importTastings(file);
      setImportStatus(`Successfully imported: ${result.added} new, ${result.updated} updated${result.errors ? `, ${result.errors} errors` : ''}`);
      // Refresh the list
      const entries = await getAllTastings();
      setTastings(entries);
    } catch (error) {
      setImportStatus(error instanceof Error ? error.message : 'Failed to import file');
    }

    // Clear the file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

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
        <div className="flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4">
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
          <div className="flex space-x-2">
            <button
              onClick={handleExport}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-burgundy-600 to-whiskey-700 hover:from-burgundy-700 hover:to-whiskey-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy-500 shadow-sm transition-all duration-150 ease-in-out"
            >
              Export Collection
            </button>
            <button
              onClick={handleImportClick}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-whiskey-700 to-burgundy-600 hover:from-whiskey-800 hover:to-burgundy-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-burgundy-500 shadow-sm transition-all duration-150 ease-in-out"
            >
              Import Collection
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImportFile}
              accept=".json"
              className="hidden"
            />
          </div>
        </div>
      </div>

      {importStatus && (
        <div className={`mb-4 p-4 rounded-md ${importStatus.includes('Successfully') ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
          {importStatus}
        </div>
      )}

      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          to="/add"
          state={{ type: 'wine' }}
          className="flex items-center justify-center p-6 border-2 border-dashed border-burgundy-300 rounded-lg bg-burgundy-50 hover:bg-burgundy-100 transition-colors group"
        >
          <div className="text-center">
            <div className="text-burgundy-600 font-serif text-lg font-medium group-hover:text-burgundy-700">
              Add Wine Tasting
            </div>
            <p className="mt-1 text-sm text-burgundy-500">
              Record your wine tasting experience
            </p>
          </div>
        </Link>

        <Link
          to="/add"
          state={{ type: 'whisky' }}
          className="flex items-center justify-center p-6 border-2 border-dashed border-whiskey-300 rounded-lg bg-whiskey-50 hover:bg-whiskey-100 transition-colors group"
        >
          <div className="text-center">
            <div className="text-whiskey-600 font-serif text-lg font-medium group-hover:text-whiskey-700">
              Add Whisky Tasting
            </div>
            <p className="mt-1 text-sm text-whiskey-500">
              Record your whisky tasting experience
            </p>
          </div>
        </Link>
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
          <div className="flex justify-center gap-4">
            <Link
              to="/add"
              state={{ type: 'wine' }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-burgundy-600 to-burgundy-700 hover:from-burgundy-700 hover:to-burgundy-800"
            >
              Add Wine Tasting
            </Link>
            <Link
              to="/add"
              state={{ type: 'whisky' }}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-gradient-to-r from-whiskey-600 to-whiskey-700 hover:from-whiskey-700 hover:to-whiskey-800"
            >
              Add Whisky Tasting
            </Link>
          </div>
        </div>
      )}
    </div>
  );
} 