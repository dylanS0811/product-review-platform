import { Link } from 'react-router-dom';

export default function Navbar() {
  return (
    <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
      <h1 className="text-2xl font-bold text-blue-600">Product Review</h1>
      <div className="space-x-4">
        <Link className="text-gray-700 hover:text-blue-600" to="/">Home</Link>
        <Link className="text-gray-700 hover:text-blue-600" to="/products">Products</Link>
        <Link className="text-gray-700 hover:text-blue-600" to="/login">Login</Link>
      </div>
    </nav>
  );
}
