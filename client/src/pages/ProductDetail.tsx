import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Dropdown from '../components/Dropdown';

// Type definitions
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

interface Review {
  id: number;
  productId: number;
  author: string;
  rating: number;
  comment: string;
  date: string;
}

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);

  const [author, setAuthor] = useState('');
  const [comment, setComment] = useState('');
  const [editId, setEditId] = useState<number | null>(null);

  const ratingOptions = ['5 - Excellent', '4 - Good', '3 - Fair', '2 - Poor', '1 - Terrible'];
  const [selectedRating, setSelectedRating] = useState('5 - Excellent');

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [showConfirm, setShowConfirm] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  useEffect(() => {
    if (!id) return;
    fetchProduct();
    fetchReviews();
  }, [id]);

  const fetchProduct = async () => {
    const res = await fetch(`http://localhost:3001/products/${id}`);
    const data = await res.json();
    setProduct(data);
  };

  const fetchReviews = async () => {
    const res = await fetch(`http://localhost:3001/products/${id}/reviews`);
    const data = await res.json();
    setReviews(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!author.trim() || !comment.trim()) {
      setError('Author and comment are required.');
      return;
    }

    const rating = parseInt(selectedRating[0]);

    try {
      const url = editId
        ? `http://localhost:3001/products/${id}/reviews/${editId}`
        : `http://localhost:3001/products/${id}/reviews`;
      const method = editId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ author, rating, comment })
      });

      if (!res.ok) throw new Error('Failed');

      await fetchReviews();
      await fetchProduct();
      setAuthor('');
      setSelectedRating('5 - Excellent');
      setComment('');
      setEditId(null);
      setSuccess(editId ? 'Review updated!' : 'Review submitted!');
    } catch {
      setError('Failed to submit review. Please try again.');
    }
  };

  const confirmDelete = async () => {
    if (!pendingDeleteId || !id) return;
    try {
      await fetch(`http://localhost:3001/products/${id}/reviews/${pendingDeleteId}`, {
        method: 'DELETE'
      });
      await fetchReviews();
      await fetchProduct();
    } catch {
      alert('Delete failed.');
    } finally {
      setShowConfirm(false);
      setPendingDeleteId(null);
    }
  };

  const handleDelete = (reviewId: number) => {
    setPendingDeleteId(reviewId);
    setShowConfirm(true);
  };

  const startEdit = (review: Review) => {
    setAuthor(review.author);
    setSelectedRating(
      `${review.rating} - ${['Excellent', 'Good', 'Fair', 'Poor', 'Terrible'][5 - review.rating]}`
    );
    setComment(review.comment);
    setEditId(review.id);
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditId(null);
    setAuthor('');
    setSelectedRating('5 - Excellent');
    setComment('');
  };

  const renderStars = (rating: number) => {
    const full = Math.floor(rating);
    const half = rating - full >= 0.25 && rating - full < 0.75;
    const empty = 5 - full - (half ? 1 : 0);
    return (
      <span className="text-yellow-500">
        {'★'.repeat(full)}
        {half ? '☆' : ''}
        {'☆'.repeat(empty)}
      </span>
    );
  };

  if (!product) return <div className="p-6 text-red-600">Product not found!</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <div className="flex flex-col md:flex-row gap-8 bg-white shadow rounded-xl p-6 mb-10">
        <img
          src={product.image}
          alt={product.name}
          className="w-full md:w-1/2 h-auto rounded-xl object-contain"
        />
        <div className="flex-1 space-y-3">
          <h1 className="text-2xl font-bold text-gray-800">{product.name}</h1>
          <p className="text-gray-600 text-sm">{product.description}</p>
          <p className="text-lg font-semibold text-blue-700">${Number(product.price).toFixed(2)}</p>
          <div className="flex items-center space-x-2">
            {renderStars(Number(product.averageRating))}
            <span className="text-gray-500 text-sm">
              ({Number(product.averageRating).toFixed(1)})
            </span>
          </div>
          <button
            onClick={() => navigate('/products')}
            className="mt-4 inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded"
          >
            ← Back to Product List
          </button>
        </div>
      </div>

      <div className="bg-white p-6 shadow rounded-xl mb-8">
        <h2 className="text-lg font-semibold mb-3">Customer Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-gray-500 text-sm">No reviews yet.</p>
        ) : (
          <ul className="space-y-4">
            {reviews.map((r) => (
              <li key={r.id} className="border-b pb-3">
                <div className="flex justify-between items-center">
                  <p className="font-semibold text-gray-800">{r.author}</p>
                  <div className="space-x-2 text-sm text-blue-600">
                    <button onClick={() => startEdit(r)}>Edit</button>
                    <button onClick={() => handleDelete(r.id)}>Delete</button>
                  </div>
                </div>
                <div className="text-yellow-500 text-sm">
                  {renderStars(r.rating)} <span className="text-gray-500">({r.rating}/5)</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{r.comment}</p>
                <p className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString()}</p>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="bg-white p-6 shadow rounded-xl">
        <h2 className="text-lg font-semibold mb-3">{editId ? 'Edit Review' : 'Add a Review'}</h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}
        {success && <p className="text-green-600 text-sm mb-2">{success}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Your name"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            className={`w-full rounded-xl border px-4 py-2 shadow-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              error && !author.trim() ? 'border-red-500' : 'border-gray-300'
            }`}
          />

          <Dropdown
            options={ratingOptions}
            selected={selectedRating}
            onSelect={setSelectedRating}
          />

          <textarea
            placeholder="Write your comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className={`w-full rounded-xl border px-4 py-2 shadow-sm text-gray-800 placeholder-gray-400 min-h-[100px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition ${
              error && !comment.trim() ? 'border-red-500' : 'border-gray-300'
            }`}
          />

          <div className="flex space-x-3">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            >
              {editId ? 'Update Review' : 'Submit Review'}
            </button>
            {editId && (
              <button
                type="button"
                onClick={cancelEdit}
                className="bg-gray-300 hover:bg-gray-400 text-black px-4 py-2 rounded"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 bg-black/10 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl p-6 w-[300px] text-center">
            <p className="text-gray-800 mb-4">Are you sure you want to delete this review?</p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setPendingDeleteId(null);
                }}
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 text-black"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
