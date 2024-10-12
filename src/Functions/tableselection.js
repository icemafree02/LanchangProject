//tableselection.js
import { useState, useEffect } from 'react';

export function useTableSelection() {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTableData = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/table');
      if (!response.ok) throw new Error('Failed to fetch table data');
      const data = await response.json();
      setTables(data);  // Store fetched table data locally in the component state
    } catch (error) {
      console.error('Error fetching table data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTableData();  // Fetch table data when the component mounts
  }, []);

  return { tables, loading, error };
}
