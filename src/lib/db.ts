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