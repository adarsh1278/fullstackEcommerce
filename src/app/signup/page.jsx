
// pages/signup.js
"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Signup = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    username: '',
    Name: '',
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async () => {
    try {
      const response = await fetch('/api/user/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message);
        router.push('/login');
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error('Error during signup:', error);
      toast.error('Internal Server Error');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md">
        <h1 className="text-3xl font-bold mb-6">Sign Up</h1>
        <div className="mb-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={formData.username}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="text"
            name="Name"
            placeholder="Name"
            value={formData.Name}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-4">
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="border p-2 w-full"
          />
        </div>
        <button
          onClick={handleSignup}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-700 w-full"
        >
          Sign Up
        </button>
        <div className="mt-4 text-center">
          Already have an account?{' '}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={() => router.push('/login')}
          >
            Login here
          </span>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Signup;
