'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiChevronLeft, FiChevronRight, FiPlus, FiFilter } from 'react-icons/fi';
import CriminalCard from './CriminalCard';
import Spinner from '../ui/Spinner';

const CriminalsList = () => {
  const [criminals, setCriminals] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({ status: 'all', threat: 'all' });
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading,setIsLoading] = useState(false);
  const criminalsPerPage = 8;

  const fetchCriminals = async () => {
    try {
      setIsLoading(true)
      const res = await fetch('/api/criminals');
      const data = await res.json();
      setCriminals(data);
    } catch (error) {
      console.error('Error fetching criminals:', error);
    } finally{
      setIsLoading(false)
    }
  };
  useEffect(() => {
  fetchCriminals();
  
  }, []);
   
  const deleteCriminal = async (id) => {
    try {
      const res = await fetch(`/api/criminals/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      setCriminals((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      console.error(error);
    } finally{
      alert("Criminal deleted successfully")
      fetchCriminals();
      
    }
  };
  // if (criminals.length === 0) {
  //   return (
  //     <div className="bg-white rounded-lg shadow-md p-6 text-center">
  //       <p className="text-gray-500">Criminal details not found.</p>
  //       <Link href="/criminals" className="mt-4 inline-block text-primary-600 hover:text-#0369a1">
  //         Back to Criminals List
  //       </Link>
  //     </div>
  //   );
  // }
  
  const filteredCriminals = criminals?.filter((criminal) => {
    const matchesSearch =
      criminal.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      criminal.crimes.some((crime) => crime.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesStatus = filters.status === 'all' || criminal.status === filters.status;
    const matchesThreat = filters.threat === 'all' || criminal.threat === filters.threat;
    return matchesSearch && matchesStatus && matchesThreat;
  });

  const totalPages = Math.ceil(filteredCriminals.length / criminalsPerPage);
  const paginatedCriminals = filteredCriminals.slice(
    (currentPage - 1) * criminalsPerPage,
    currentPage * criminalsPerPage
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-800 mb-2 md:mb-0">Criminal Database</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/criminals/add"
            className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-md hover:bg-primary-700"
          >
            <FiPlus className="mr-2" size={16} /> Add Criminal
          </Link>
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50">
            <FiFilter className="mr-2" size={16} /> Filters
          </button>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-4 border-t border-gray-200 pt-4">
        <div className="w-full sm:w-auto flex items-center">
          <span className="text-sm text-gray-500 mr-2">Status:</span>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
            className="form-select rounded-md border-gray-300 text-sm"
          >
            <option value="all">All</option>
            <option value="wanted">Wanted</option>
            <option value="apprehended">Apprehended</option>
          </select>
        </div>
        <div className="w-full sm:w-auto flex items-center">
          <span className="text-sm text-gray-500 mr-2">Threat Level:</span>
          <select
            value={filters.threat}
            onChange={(e) => setFilters({ ...filters, threat: e.target.value })}
            className="form-select rounded-md border-gray-300 text-sm"
          >
            <option value="all">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>
      {
        isLoading && (
          <Spinner/>
        )
      }
      {paginatedCriminals.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            {paginatedCriminals.map((criminal) => (
              <CriminalCard key={criminal._id} criminal={criminal} onDelete={deleteCriminal} />
            ))}
          </div>
          <div className="flex items-center justify-between mt-6 border-t border-gray-200 pt-4">
            <div className="text-sm text-gray-500">
              Showing {(currentPage - 1) * criminalsPerPage + 1} to {Math.min(currentPage * criminalsPerPage, filteredCriminals.length)} of {filteredCriminals.length} criminals
            </div>
            <div className="flex items-center">
              <button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="mx-3 text-sm text-gray-700">Page {currentPage} of {totalPages || 1}</span>
              <button
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages || totalPages === 0}
                className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
              >
                <FiChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-gray-500">No criminals found matching your criteria.</p>
        </div>
      )}
    </div>
  );
};

export default CriminalsList;
