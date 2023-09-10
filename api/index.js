import express from "express";
import { reviewData } from "../reviews.js";
import { productData } from "../product_data.js";
import { personas } from "../personas.js";
import cors from "cors";

import { calculateSimilarity } from "../helpers.js";

const app = express();
app.use(express.json());
app.use(cors());
const users = personas.user_personas;
const reviews = reviewData.reviews;

app.get("/users", (req, res) => {
  res.json({ users: users });
});

app.get("/products", (req, res) => {
  res.json({ products: productData.appliances });
});

app.post("/recommendations", (req, res) => {
  const { userId, productId } = req.body;
  const similarUsers = users.filter((user) => user.user_id !== userId);

  // Calculate user similarity scores
  const userSimilarities = similarUsers.map((user) => ({
    userId: user.user_id,
    similarity: calculateSimilarity(userId, user.user_id, reviews),
  }));

  // Sort similar users by similarity score
  userSimilarities.sort((a, b) => b.similarity - a.similarity);

  // Find prodcuts liked by similar users that the current user hasnt viewed
  const recommendedProducts = productData.appliances.filter((product) => {
    if (product.product_id === productId) return false; // Exclude the viewed product itself

    return reviews.some((review) => {
      return userSimilarities
        .filter((similarity) => similarity.similarity > 0.1) // Adjust similarity threshold as needed
        .some(
          (similarity) =>
            review.user_id === similarity.userId &&
            review.product_id === product.product_id
        );
    });
  });

  res.json({ recommendations: recommendedProducts });
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
