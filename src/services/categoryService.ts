// Category Service - Category management

import { db } from '@db/schema'
import type { Category } from '@/types/entities'

/**
 * Get all categories
 */
export async function getCategories(): Promise<Category[]> {
  return db.categories.toArray()
}

/**
 * Get category by ID
 */
export async function getCategory(id: string): Promise<Category | undefined> {
  return db.categories.get(id)
}

/**
 * Add new category
 */
export async function addCategory(name: string): Promise<Category> {
  const category: Category = {
    id: `category_${Date.now()}`,
    name,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  await db.categories.add(category)
  return category
}

/**
 * Edit category
 */
export async function editCategory(
  id: string,
  updates: Partial<Category>,
): Promise<Category> {
  const existing = await db.categories.get(id)
  if (!existing) throw new Error('Category not found')

  const updated: Category = {
    ...existing,
    ...updates,
    id: existing.id,
    createdAt: existing.createdAt,
    updatedAt: new Date(),
  }

  await db.categories.update(id, updated)
  return updated
}

/**
 * Delete category (only if no transactions use it)
 */
export async function deleteCategory(id: string): Promise<void> {
  const count = await db.transactions.where('categoryId').equals(id).count()
  if (count > 0) {
    throw new Error('Cannot delete category with existing transactions')
  }

  await db.categories.delete(id)
}

export default {
  getCategories,
  getCategory,
  addCategory,
  editCategory,
  deleteCategory,
}
