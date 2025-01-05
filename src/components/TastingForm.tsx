import { useState, useEffect } from 'react';
import { TastingFormData } from '../types';

interface TastingFormProps {
  initialData?: Partial<TastingFormData>;
  onSubmit: (data: TastingFormData) => void;
  isEditing?: boolean;
}

export default function TastingForm({ initialData, onSubmit, isEditing = false }: TastingFormProps) {
  const [formData, setFormData] = useState<Partial<TastingFormData>>({
    type: 'wine',
    name: '',
    noseNotes: '',
    palateNotes: '',
    finishNotes: '',
    colorNotes: '',
    pairingSuggestions: '',
    aromaScore: 5,
    palateScore: 5,
    finishScore: 5,
    ...initialData,
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: Number(value),
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          imageBase64: reader.result as string,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as TastingFormData);
  };

  const calculateOverallScore = () => {
    const { aromaScore = 0, palateScore = 0, finishScore = 0 } = formData;
    return ((aromaScore + palateScore + finishScore) / 3).toFixed(1);
  };

  const isWine = formData.type === 'wine';
  const accentColor = isWine ? 'burgundy' : 'whiskey';

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className={`bg-${accentColor}-50 border border-${accentColor}-100 rounded-lg p-6`}>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-700">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleInputChange}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
            >
              <option value="wine">Wine</option>
              <option value="whisky">Whisky</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
              placeholder={isWine ? "e.g., Château Margaux 2015" : "e.g., Macallan 18"}
            />
          </div>

          {isWine ? (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Vintage</label>
                <input
                  type="number"
                  name="vintage"
                  value={formData.vintage || ''}
                  onChange={handleNumberChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
                  placeholder="e.g., 2015"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Varietal</label>
                <input
                  type="text"
                  name="varietal"
                  value={formData.varietal || ''}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
                  placeholder="e.g., Cabernet Sauvignon"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Region</label>
                <input
                  type="text"
                  name="region"
                  value={formData.region || ''}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
                  placeholder="e.g., Bordeaux, France"
                />
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-700">Distillery</label>
                <input
                  type="text"
                  name="distillery"
                  value={formData.distillery || ''}
                  onChange={handleInputChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
                  placeholder="e.g., The Macallan"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Age Statement</label>
                <input
                  type="number"
                  name="ageStatement"
                  value={formData.ageStatement || ''}
                  onChange={handleNumberChange}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
                  placeholder="e.g., 18"
                />
              </div>
            </>
          )}
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <div className="mt-1 flex items-center">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            />
          </div>
          {formData.imageBase64 && (
            <div className="mt-2 relative rounded-lg overflow-hidden">
              <img
                src={formData.imageBase64}
                alt="Preview"
                className="w-full h-48 object-cover"
              />
            </div>
          )}
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900">Scoring</h3>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-3">
            <div>
              <label className="block text-sm font-medium text-gray-700">Aroma Score (1-10)</label>
              <input
                type="number"
                name="aromaScore"
                min="1"
                max="10"
                value={formData.aromaScore}
                onChange={handleNumberChange}
                required
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Palate Score (1-10)</label>
              <input
                type="number"
                name="palateScore"
                min="1"
                max="10"
                value={formData.palateScore}
                onChange={handleNumberChange}
                required
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Finish Score (1-10)</label>
              <input
                type="number"
                name="finishScore"
                min="1"
                max="10"
                value={formData.finishScore}
                onChange={handleNumberChange}
                required
                className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
              />
            </div>
          </div>

          <div className="mt-4">
            <span className="block text-sm font-medium text-gray-700">Overall Score</span>
            <div className={`mt-1 text-3xl font-bold text-${accentColor}-600`}>
              {calculateOverallScore()}/10
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Tasting Notes</h3>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700">Color Notes</label>
            <textarea
              name="colorNotes"
              value={formData.colorNotes}
              onChange={handleInputChange}
              required
              rows={2}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
              placeholder={isWine ? "e.g., Deep ruby red with purple highlights" : "e.g., Rich amber with copper highlights"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Nose Notes</label>
            <textarea
              name="noseNotes"
              value={formData.noseNotes}
              onChange={handleInputChange}
              required
              rows={3}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
              placeholder={isWine ? "e.g., Black cherries, vanilla, tobacco" : "e.g., Honey, dried fruits, oak spices"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Palate Notes</label>
            <textarea
              name="palateNotes"
              value={formData.palateNotes}
              onChange={handleInputChange}
              required
              rows={3}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
              placeholder={isWine ? "e.g., Full-bodied, rich tannins, dark fruit" : "e.g., Rich sherry, dark chocolate, orange peel"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Finish Notes</label>
            <textarea
              name="finishNotes"
              value={formData.finishNotes}
              onChange={handleInputChange}
              required
              rows={3}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
              placeholder={isWine ? "e.g., Long, persistent with hints of mocha" : "e.g., Long, warming with lingering spices"}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Pairing Suggestions</label>
            <textarea
              name="pairingSuggestions"
              value={formData.pairingSuggestions}
              onChange={handleInputChange}
              required
              rows={2}
              className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-${accentColor}-500 focus:ring-${accentColor}-500`}
              placeholder={isWine ? "e.g., Grilled ribeye, aged cheeses" : "e.g., Dark chocolate, blue cheese, cigars"}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className={`px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-gradient-to-r from-${accentColor}-600 to-${accentColor}-700 hover:from-${accentColor}-700 hover:to-${accentColor}-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-${accentColor}-500`}
        >
          {isEditing ? 'Update Tasting' : 'Add Tasting'}
        </button>
      </div>
    </form>
  );
} 