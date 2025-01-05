import Dexie, { Table } from 'dexie';
import { TastingEntry } from '../types';

export class TastingDB extends Dexie {
  tastings!: Table<TastingEntry>;

  constructor() {
    super('TastingDB');
    this.version(1).stores({
      tastings: 'id, type, name, overallScore, createdAt'
    });
  }
}

export const db = new TastingDB();

// Helper functions for common database operations
export const addTasting = async (tasting: Omit<TastingEntry, 'id' | 'createdAt' | 'updatedAt'>) => {
  const now = new Date().toISOString();
  const entry: TastingEntry = {
    ...tasting,
    id: crypto.randomUUID(),
    createdAt: now,
    updatedAt: now,
  };
  await db.tastings.add(entry);
  return entry;
};

export const updateTasting = async (id: string, tasting: Partial<TastingEntry>) => {
  const updatedTasting = {
    ...tasting,
    updatedAt: new Date().toISOString(),
  };
  await db.tastings.update(id, updatedTasting);
  return updatedTasting;
};

export const deleteTasting = async (id: string) => {
  await db.tastings.delete(id);
};

export const getAllTastings = () => {
  return db.tastings.orderBy('createdAt').reverse().toArray();
};

export const getTastingsByType = (type: TastingEntry['type']) => {
  return db.tastings.where('type').equals(type).toArray();
};

// Export/Import functionality
export const exportTastings = async () => {
  const tastings = await getAllTastings();
  const exportData = {
    version: 1,
    timestamp: new Date().toISOString(),
    tastings,
  };
  
  const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement('a');
  a.href = url;
  a.download = `sipscribe-export-${new Date().toISOString().split('T')[0]}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

export const importTastings = async (file: File): Promise<{ added: number; updated: number; errors: number }> => {
  try {
    const text = await file.text();
    const data = JSON.parse(text);
    
    if (!data.tastings || !Array.isArray(data.tastings)) {
      throw new Error('Invalid import file format');
    }

    let added = 0;
    let updated = 0;
    let errors = 0;

    await db.transaction('rw', db.tastings, async () => {
      for (const tasting of data.tastings) {
        try {
          const existing = await db.tastings.get(tasting.id);
          if (existing) {
            await db.tastings.update(tasting.id, {
              ...tasting,
              updatedAt: new Date().toISOString(),
            });
            updated++;
          } else {
            await db.tastings.add({
              ...tasting,
              id: tasting.id || crypto.randomUUID(),
              createdAt: tasting.createdAt || new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
            added++;
          }
        } catch (error) {
          console.error('Error importing tasting:', error);
          errors++;
        }
      }
    });

    return { added, updated, errors };
  } catch (error) {
    console.error('Error parsing import file:', error);
    throw new Error('Failed to parse import file. Please make sure it is a valid SipScribe export file.');
  }
}; 