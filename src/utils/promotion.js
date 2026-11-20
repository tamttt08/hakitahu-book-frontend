export function applyPromotionsToBooks(books = [], promotions = []) {
  const promosByBookId = new Map();

  promotions.forEach((promo) => {
    (promo.books || []).forEach((b) => {
      if (!promosByBookId.has(b.bookId)) {
        promosByBookId.set(b.bookId, []);
      }
      promosByBookId.get(b.bookId).push(promo);
    });
  });

  return books.map((book) => {
    const originalPrice = Number(book.price || 0);
    const applicablePromos = promosByBookId.get(book.bookId) || [];

    let bestSalePrice = originalPrice;
    let bestPromo = null;

    applicablePromos.forEach((promo) => {
      const val = Number(promo.discountValue || 0);
      const candidatePrice =
        promo.discountType === 'PERCENT'
          ? Math.max(0, Math.round((originalPrice * (100 - val)) / 100))
          : Math.max(0, originalPrice - val);

      if (candidatePrice < bestSalePrice) {
        bestSalePrice = candidatePrice;
        bestPromo = promo;
      }
    });

    const hasDiscount = bestPromo !== null && bestSalePrice < originalPrice;
    const discountPercent =
      hasDiscount && originalPrice > 0
        ? Math.max(1, Math.round(((originalPrice - bestSalePrice) / originalPrice) * 100))
        : 0;

    return {
      ...book,
      originalPrice,
      salePrice: bestSalePrice,
      discountPercent,
      hasDiscount,
      promotionName: hasDiscount ? bestPromo.name : null
    };
  });
}