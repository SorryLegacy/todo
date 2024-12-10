import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SplitBackgroundLayout from '../laylout/SplitBackgroundLayout'
import { useToast } from '../services/toast';
import authService from '../services/auth';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { showToast } = useToast()
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const response = await authService.loginUser(email, password, showToast)
    if (typeof response === 'object' && response !== null && 'access_token' in response) {
      localStorage.setItem('accessToken', response.access_token);
      navigate('/');
    } 
  };

  return (
    <SplitBackgroundLayout>
        <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
          <h2 className="mb-6 text-2xl font-bold text-center">Login</h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <button
              onClick={handleSubmit}
              className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600"
            >
              Login
            </button>
            <p className="text-sm text-gray-600 py-2">
              Don't have an account?{' '}
              <button
                onClick={() => navigate('/register')}
                className="text-blue-500 underline hover:text-blue-700"
              >
                Sign up
              </button>
            </p>
          </form>
        </div>
    </SplitBackgroundLayout>


  );
};

export default Login;
