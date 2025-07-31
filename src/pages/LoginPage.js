import React, { useState } from 'react';
import { loginUser } from '../api/authApi';
import { useNavigate } from 'react-router-dom'; // Import useNavigate

const LoginPage = () => {
  const [userName, setUserName] = useState(''); // Changed from email to userName
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const navigate = useNavigate(); // Initialize useNavigate

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({}); // Clear previous errors
    setSuccessMessage(''); // Clear previous success message

    // Client-side validation
    const newErrors = {};
    if (!userName.trim()) {
      newErrors.UserName = ['User Name is required.'];
    }
    if (!password.trim()) {
      newErrors.Password = ['Password is required.'];
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await loginUser({ userName, password });
      setSuccessMessage(response.data.message || 'Login successful!');
      console.log('Login successful response:', response.data);
      // Store the JWT token in localStorage
      if (response.data.token) {
        localStorage.setItem('jwtToken', response.data.token);
        console.log('Token stored in localStorage:', localStorage.getItem('jwtToken'));
      }
      // Redirect to dashboard on successful login
      navigate('/');
    } catch (error) {
      if (error.response && error.response.data && error.response.data.errors) {
        // Backend returns a dictionary of errors (e.g., validation errors)
        setErrors(error.response.data.errors);
      } else if (error.response && error.response.data && error.response.data.message) {
        // Backend returns a single message error (e.g., invalid credentials)
        setErrors({ general: error.response.data.message });
      } else {
        setErrors({ general: 'An unexpected error occurred.' });
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <input type="hidden" name="remember" defaultValue="true" />
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">User Name</label> {/* Changed label */}
              <input
                id="username" // Changed id
                name="username" // Changed name
                type="text" // Changed type to text
                autoComplete="username"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="User Name" // Changed placeholder
                value={userName} // Changed value
                onChange={(e) => setUserName(e.target.value)} // Changed onChange
              />
              {errors.UserName && <p className="text-red-500 text-xs mt-1">{(Array.isArray(errors.UserName) ? errors.UserName[0] : errors.UserName)}</p>} {/* Updated error display */}
            </div>
            <div>
              <label htmlFor="password" className="sr-only">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {errors.Password && <p className="text-red-500 text-xs mt-1">{(Array.isArray(errors.Password) ? errors.Password[0] : errors.Password)}</p>} {/* Updated error display */}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>

            <div className="text-sm">
              <a href="#" className="font-medium text-purple-600 hover:text-purple-500">
                Forgot your password?
              </a>
            </div>
          </div>

          {errors.general && <p className="text-red-500 text-xs mt-2 text-center">{(Array.isArray(errors.general) ? errors.general[0] : errors.general)}</p>} {/* Updated error display */}
          {successMessage && <p className="text-green-500 text-xs mt-2 text-center">{successMessage}</p>}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
