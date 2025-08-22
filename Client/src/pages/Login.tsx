import { Link } from 'react-router-dom';

const Login = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-neutral-900 via-neutral-800 to-neutral-700 text-white font-montserrat">
      <div className="bg-neutral-900 w-full max-w-[400px] rounded-xl shadow-lg p-8 space-y-6">
        <h1 className="text-4xl font-bold text-center mb-4">CloneBook</h1>

        <form className="flex flex-col space-y-4">
          <div>
            <label className="block mb-1 text-sm font-medium">Email</label>
            <input
              name="email"
              type="email"
              className="w-full px-4 py-2 bg-neutral-800 rounded-lg border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              name="password"
              type="password"
              className="w-full px-4 py-2 bg-neutral-800 rounded-lg border border-neutral-600 focus:outline-none focus:ring-1 focus:ring-blue-500"
              required
            />
          </div>

          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 rounded-lg py-2 font-semibold transition-colors"
          >
            Log In
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