import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SplitBackgroundLayout from '../laylout/SplitBackgroundLayout';
import { useToast } from '../services/toast';
import authService from '../services/auth';

const Register: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showToast } = useToast()
  const navigate = useNavigate();

  const isFormValid = password && confirmPassword && password === confirmPassword

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const response = await authService.signUp(email, password, confirmPassword, showToast)
    if (typeof response === 'object' && response !== null && 'access_token' in response) {
      localStorage.setItem('accessToken', response.access_token);
      navigate('/'); 
    } 
  };

  return (
    <SplitBackgroundLayout>
      <div className="w-full max-w-md p-8 bg-white rounded shadow-md">
        <h2 className="mb-6 text-2xl font-bold text-center">Sign Up</h2>
        <form onSubmit={handleSubmit}>
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
          <div className="mb-4">
            <label htmlFor="confirmPassword" className="block mb-2 text-sm font-medium text-gray-700">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring focus:ring-blue-300"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className={`w-full px-4 py-2 ${ isFormValid ? 'text-white bg-blue-500' :  'bg-gray-200 text-gray-500'} rounded-md`}
            disabled={!isFormValid}

          >
            Sign up
          </button>
        </form>
        <p className="text-sm text-gray-600 py-2">
            <button
              onClick={() => navigate('/login')}
              className='text-blue-500 underline hover:text-blue-700'
            >
            Already have an account?
            </button>
          </p>
      </div>
      </SplitBackgroundLayout>  
    );
};

export default Register;
