import express, { Request, Response, NextFunction } from 'express';
import { db } from '../config/db';

const router = express.Router();

/**
 * GET /products
 */
router.get('/', async (_req: Request, res: Response): Promise<void> => {
  try {
    const [rows] = await db.query('SELECT * FROM products ORDER BY dateAdded DESC');
    res.json(rows);
  } catch (err) {
    console.error('Error fetching products:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

/**
 * GET /products/:id
 */
router.get(
  '/:id',
  async (req: Request<{ id: string }>, res: Response, _next: NextFunction): Promise<void> => {
    const id = req.params.id;

    try {
      const [rows] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
      const result = Array.isArray(rows) && rows.length > 0 ? rows[0] : null;

      if (!result) {
        res.status(404).json({ message: 'Product not found' });
        return;
      }

      res.json(result);
    } catch (error) {
      console.error('Error fetching product by ID:', error);
      res.status(500).json({ message: 'Server error' });
    }
  }
);

export default router;
