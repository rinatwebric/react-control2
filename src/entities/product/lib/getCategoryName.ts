import type { Category } from '../model/types';

export const CATEGORY_MAP: Record<number, string> = {
  1: 'Одежда',
  2: 'Электроника',
  3: 'Мебель',
  4: 'Обувь',
  5: 'Разное',
  6: 'Аксессуары',
};

export const getCategoryName = (category?: Category | string): string => {
  if (!category) return '';
  if (typeof category === 'string') {
    return category;
  }
  return CATEGORY_MAP[category.id] || category.name || '';
};
