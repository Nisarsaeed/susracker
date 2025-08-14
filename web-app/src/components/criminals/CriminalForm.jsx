'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FiSave, FiX, FiCamera, FiUpload } from 'react-icons/fi';

const CriminalForm = ({ initialData = null, isEditing = false }) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const defaultData = {
    name: '',
    age: '',
    crimes: [],
    threat: 'low',
    status: 'wanted',
    image: null
  };
  
  const [formData, setFormData] = useState(initialData || defaultData);
  const [crimeInput, setCrimeInput] = useState('');
  const [previewImage, setPreviewImage] = useState(initialData?.image || null);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, image: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleAddCrime = () => {
    if (crimeInput.trim()) {
      setFormData(prev => ({
        ...prev,
        crimes: [...prev.crimes, crimeInput.trim()]
      }));
      setCrimeInput('');
    }
  };
  
  const handleRemoveCrime = (index) => {
    setFormData(prev => ({
      ...prev,
      crimes: prev.crimes.filter((_, i) => i !== index)
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Validate required fields before submission
      if (!formData.name || !formData.age || formData.crimes.length === 0 || !formData.threat || !formData.status || !formData.image) {
        throw new Error('Please fill all required fields');
      }
  
      // Create FormData object
      const submissionData = new FormData();
      
      // Append all required fields
      submissionData.append('name', formData.name);
      submissionData.append('age', formData.age);
      submissionData.append('threat', formData.threat);
      submissionData.append('status', formData.status);
      
      // Append crimes array (multiple entries with same key)
      formData.crimes.forEach(crime => {
        submissionData.append('crimes', crime);
      });
      
      // Append image file
      submissionData.append('image', formData.image);
  
      const apiUrl = isEditing 
        ? `/api/criminals/${initialData.id}`
        : '/api/criminals';
      const apiMethod = isEditing ? 'PUT' : 'POST';
  
      const method = isEditing ? 'PUT' : 'POST';
      console.log('Submitting data:', submissionData);
      const response = await fetch(apiUrl, {
        method: apiMethod,
        body: submissionData,
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit form');
      }
  
      const result = await response.json();
      alert(`Criminal ${isEditing ? 'updated' : 'registered'} successfully!`);
      // router.push('/criminals');
    } catch (error) {
      console.error('Submission error:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2">
          {isEditing ? 'Edit Criminal Record' : 'Add New Criminal Record'}
        </h2>
        <p className="text-gray-600">
          {isEditing ? 'Update the criminal information.' : 'Register a new criminal in the database.'}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Image Upload */}
        <div className="md:col-span-2">
          <div className="mb-4 flex items-center justify-center">
            <div className="relative">
              <label className="cursor-pointer">
                <div className="w-36 h-36 bg-gray-200 rounded-full flex items-center justify-center overflow-hidden">
                  {previewImage ? (
                    <img 
                      src={previewImage} 
                      alt="Criminal preview" 
                      className="w-full h-full object-cover"
                    />
                  ) : formData.image ? (
                    <img 
                      src={formData.image} 
                      alt="Criminal" 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FiCamera size={36} className="text-gray-400" />
                  )}
                </div>
                <input 
                  type="file" 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </label>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">
              Age <span className="text-red-500">*</span>
            </label>
            <input
              type="number"
              id="age"
              name="age"
              value={formData.age}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              required
              min="1"
            />
          </div>
        </div>
        
        {/* Status Information */}
        <div>
          <div className="mb-4">
            <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
              <option value="wanted">Wanted</option>
              <option value="apprehended">Apprehended</option>
            </select>
          </div>
          
          <div className="mb-4">
            <label htmlFor="threat" className="block text-sm font-medium text-gray-700 mb-1">
              Threat Level
            </label>
            <select
              id="threat"
              name="threat"
              value={formData.threat}
              onChange={handleChange}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </div>
        
        {/* Crimes Section */}
        <div className="md:col-span-2">
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Crimes <span className="text-red-500">*</span>
            </label>
            <div className="flex">
              <input
                type="text"
                value={crimeInput}
                onChange={(e) => setCrimeInput(e.target.value)}
                placeholder="Enter crime"
                className="flex-1 rounded-l-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-500 focus:ring-opacity-50"
              />
              <button
                type="button"
                onClick={handleAddCrime}
                className="px-4 bg-primary-600 text-white rounded-r-md hover:bg-primary-700 focus:outline-none"
              >
                Add
              </button>
            </div>
            
            <div className="mt-2 flex flex-wrap gap-2">
              {formData.crimes.length === 0 && (
                <p className="text-sm text-gray-500">No crimes added yet.</p>
              )}
              
              {formData.crimes.map((crime, index) => (
                <div
                  key={index}
                  className="inline-flex items-center bg-gray-100 text-gray-800 rounded-full px-3 py-1"
                >
                  <span className="text-sm">{crime}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveCrime(index)}
                    className="ml-1 text-gray-500 hover:text-red-500 focus:outline-none"
                  >
                    <FiX size={14} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 cursor-pointer"
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 flex items-center justify-center disabled:opacity-50"
        >
          {isSubmitting ? (
            <span>Processing...</span>
          ) : (
            <>
              <FiSave className="mr-2" size={16} />
              {isEditing ? 'Update Criminal' : 'Register Criminal'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default CriminalForm;