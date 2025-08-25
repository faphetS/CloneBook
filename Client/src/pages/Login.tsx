import { AxiosError } from 'axios';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';
import { useAuthStore } from '../store/useAuthStore';

const Login = () => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/login', form);
      const { user, accessToken, refreshToken } = res.data;
      login(user, accessToken, refreshToken);
      navigate('/');
    } catch (err) {
      const error = err as AxiosError<{ message?: string }>;
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white font-montserrat">
      <div className="bg-neutral-900 w-full max-w-[400px] rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-4">CloneBook</h1>

        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              disabled={loading}
              className="w-full px-4 py-2 bg-neutral-800 rounded-lg border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              disabled={loading}
              className="w-full px-4 py-2 bg-neutral-800 rounded-lg border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:opacity-50"
              required
            />
          </div>

          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 disabled:bg-blue-400 hover:bg-blue-700 rounded-lg py-2 font-semibold transition-colors"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>
        <div></div>

        <p className="text-sm text-center text-neutral-300">
          Don't have an account?{' '}
          <Link to='/signup'>
            <span className="text-blue-400 hover:underline cursor-pointer">
              Sign up
            </span>
          </Link>
        </p>
      </div>
    </div>
  )
}

export default Login