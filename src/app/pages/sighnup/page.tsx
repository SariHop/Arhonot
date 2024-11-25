"use client"
import React, { useState } from 'react';

const SignUp = () => {
  const [formData, setFormData] = useState({
    userName: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: '',
    sensitive: '',
    birthDate: '',
  });

  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Reset error message
    setError('');

    // Password match validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match!');
      return;
    }

    // Simulate form submission
    console.log('Form submitted:', formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 shadow-md rounded-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">Registration</h2>

        {/* UserName */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="userName">
            User Name
          </label>
          <input
            id="userName"
            name="userName"
            type="text"
            value={formData.userName}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="mb-4">
          <label
            className="block text-sm font-medium text-gray-700"
            htmlFor="confirmPassword"
          >
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="birthDate">
            Date of Birth
          </label>
          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={formData.birthDate}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-white text-gray-800 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>


        {/* Gender */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="gender">
            Gender
          </label>
          <select
            id="gender"
            name="gender"
            value={formData.gender}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        {/* Sensitive */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700" htmlFor="sensitive">
            Are you sensitive to:
          </label>
          <select
            id="sensitive"
            name="sensitive"
            value={formData.sensitive}
            onChange={handleChange}
            className="mt-1 p-2 w-full border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="none">None</option>
            <option value="heat">Heat</option>
            <option value="cold">Cold</option>
          </select>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 text-red-500 text-sm">
            {error}
          </div>
        )}

        {/* Submit */}
        <button
          type="submit"
          className='button-submit'
        >
          Register
        </button>
      </form>
    </div>
  );
};

export default SignUp;
