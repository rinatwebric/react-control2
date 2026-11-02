export const getCleanImageUrl = (url) => {
  if (!url) return 'https://placehold.co/400x300?text=No+Image';
  try {
    const clean = url.replace(/^[["']+|[\]"']+$/g, '');
    if (!clean.startsWith('http')) return 'https://placehold.co/400x300?text=No+Image';
    return clean;
  } catch {
    return 'https://placehold.co/400x300?text=No+Image';
  }
};
