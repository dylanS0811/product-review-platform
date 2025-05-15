import express, { Request, Response, NextFunction } from 'express';
import { db } from '../config/db';

const router = express.Router();

// 类型定义
interface ReviewBody {
  author: string;
  rating: number;
  comment: string;
}

// 工具函数：更新平均评分
async function updateAverageRating(productId: number): Promise<void> {
  await db.query(
    `UPDATE products
     SET averageRating = (
       SELECT ROUND(AVG(rating), 2)
       FROM reviews
       WHERE productId = ?
     )
     WHERE id = ?`,
    [productId, productId]
  );
}

/**
 * GET /products/:id/reviews
 */
router.get(
  '/products/:id/reviews',
  async (req: Request<{ id: string }>, res: Response, _next: NextFunction): Promise<void> => {
    const productId = parseInt(req.params.id);

    try {
      const [rows] = await db.query(
        `SELECT id, productId, author, rating, comment, date
         FROM reviews
         WHERE productId = ?
         ORDER BY date DESC`,
        [productId]
      );
      res.json(rows);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * POST /products/:id/reviews
 */
router.post(
  '/products/:id/reviews',
  async (
    req: Request<{ id: string }, {}, ReviewBody>,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const productId = parseInt(req.params.id);
    const { author, rating, comment } = req.body;

    if (!author || !comment || !rating) {
      res.status(400).json({ message: 'Missing required fields.' });
      return;
    }

    try {
      const [result] = await db.query(
        `INSERT INTO reviews (productId, author, rating, comment)
         VALUES (?, ?, ?, ?)`,
        [productId, author, rating, comment]
      );

      await updateAverageRating(productId);

      res.status(201).json({
        id: (result as any).insertId,
        productId,
        author,
        rating,
        comment,
        date: new Date().toISOString()
      });
    } catch (error) {
      console.error('Error adding review:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * PUT /products/:productId/reviews/:id
 */
router.put(
  '/products/:productId/reviews/:id',
  async (
    req: Request<{ productId: string; id: string }, {}, ReviewBody>,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const productId = parseInt(req.params.productId);
    const reviewId = parseInt(req.params.id);
    const { author, rating, comment } = req.body;

    if (!author || !comment || !rating) {
      res.status(400).json({ message: 'Missing required fields.' });
      return;
    }

    try {
      await db.query(
        `UPDATE reviews
         SET author = ?, rating = ?, comment = ?
         WHERE id = ? AND productId = ?`,
        [author, rating, comment, reviewId, productId]
      );

      await updateAverageRating(productId);

      res.json({ id: reviewId, productId, author, rating, comment });
    } catch (error) {
      console.error('Error updating review:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

/**
 * DELETE /products/:productId/reviews/:id
 */
router.delete(
  '/products/:productId/reviews/:id',
  async (
    req: Request<{ productId: string; id: string }>,
    res: Response,
    _next: NextFunction
  ): Promise<void> => {
    const productId = parseInt(req.params.productId);
    const reviewId = parseInt(req.params.id);

    try {
      await db.query(`DELETE FROM reviews WHERE id = ? AND productId = ?`, [reviewId, productId]);

      await updateAverageRating(productId);

      res.status(204).send();
    } catch (error) {
      console.error('Error deleting review:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
