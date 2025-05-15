import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';

interface Product {
  id: string;
  name: string;
  description: string;
  category: string;
  price: string;
  image: string;
  dateAdded: string;
  averageRating: string;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filtered, setFiltered] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  useEffect(() => {
    fetch('http://localhost:3001/products')
      .then((res) => res.json() as Promise<Product[]>)
      .then((data) => {
        setProducts(data);
        setFiltered(data);
        const cats = Array.from(new Set(data.map((p) => p.category)));
        setCategories(['All', ...cats]);
      })
      .catch((err) => console.error('Fetch failed:', err));
  }, []);

  useEffect(() => {
    const searchLower = search.toLowerCase();
    const filteredData = products.filter((p) => {
      const matchCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchLower);
      return matchCategory && matchSearch;
    });
    setFiltered(filteredData);
  }, [search, selectedCategory, products]);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">🛒 Product Review</h2>

      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 mb-6 space-y-4 md:space-y-0">
        <input
          type="text"
          placeholder="🔍 Search by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full md:w-1/2 border border-gray-300 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <Dropdown
          options={categories}
          selected={selectedCategory}
          onSelect={(value) => setSelectedCategory(value)}
        />
      </div>

      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => {
          const rating = parseFloat(p.averageRating);
          const fullStars = Math.floor(rating);
          const hasHalfStar = rating - fullStars >= 0.25 && rating - fullStars < 0.75;
          const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

          return (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="block bg-white border border-gray-200 rounded-xl shadow-md hover:shadow-lg transition p-4"
            >
              <img
                src={p.image}
                alt={p.name}
                className="w-full h-48 object-contain rounded-md mb-4"
              />
              <h3 className="text-lg font-semibold text-gray-900 mb-1">{p.name}</h3>
              <p className="text-sm text-gray-500 mb-2 line-clamp-2">{p.description}</p>
              <p className="text-blue-700 font-bold mb-1 text-md">${Number(p.price).toFixed(2)}</p>
              <div className="text-yellow-500 text-sm flex items-center">
                {Array.from({ length: fullStars }).map((_, i) => (
                  <span key={`full-${i}`}>★</span>
                ))}
                {hasHalfStar && <span>☆</span>}
                {Array.from({ length: emptyStars }).map((_, i) => (
                  <span key={`empty-${i}`}>☆</span>
                ))}
                <span className="ml-2 text-gray-600">({rating.toFixed(1)})</span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
