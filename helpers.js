export const calculateSimilarity = (userA, userB, reviews) => {
  const sharedProducts = reviews
    .filter((review) => review.user_id === userA || review.user_id === userB)
    .map((review) => review.product_id);

  if (sharedProducts.length === 0) {
    return 0; // No shared products
  }
  const userARatings = {};
  const userBRatings = {};

  sharedProducts.forEach((productId) => {
    const userARating =
      reviews.find(
        (review) => review.user_id === userA && review.product_id === productId
      )?.rating || 0;
    const userBRating =
      reviews.find(
        (review) => review.user_id === userB && review.product_id === productId
      )?.rating || 0;
    userARatings[productId] = userARating;
    userBRatings[productId] = userBRating;
  });

  const avgUserARating =
    Object.values(userARatings).reduce((sum, rating) => sum + rating, 0) /
    sharedProducts.length;
  const avgUserBRating =
    Object.values(userBRatings).reduce((sum, rating) => sum + rating, 0) /
    sharedProducts.length;

  let numerator = 0;
  let denominatorA = 0;
  let denominatorB = 0;

  sharedProducts.forEach((productId) => {
    numerator +=
      (userARatings[productId] - avgUserARating) *
      (userBRatings[productId] - avgUserBRating);
    denominatorA += Math.pow(userARatings[productId] - avgUserARating, 2);
    denominatorB += Math.pow(userBRatings[productId] - avgUserBRating, 2);
  });

  const similarity =
    numerator / (Math.sqrt(denominatorA) * Math.sqrt(denominatorB));
  return isNaN(similarity) ? 0 : similarity;
};
