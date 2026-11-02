export const CATEGORY_MAP = {
  1: 'Одежда',
  2: 'Электроника',
  3: 'Мебель',
  4: 'Обувь',
  5: 'Разное',
  6: 'Аксессуары',
};

export const getCategoryName = (category) => {
  if (!category) return '';
  if (typeof category === 'string') {
    return category;
  }
  return CATEGORY_MAP[category.id] || category.name || '';
};
