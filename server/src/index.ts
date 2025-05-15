import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import productRoutes from './routes/products';
import reviewRoutes from './routes/reviews';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/products', productRoutes);
app.use('/', reviewRoutes); // 添加这一行

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
