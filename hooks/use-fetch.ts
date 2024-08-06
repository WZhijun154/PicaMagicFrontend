import { useState, useEffect } from 'react';
import { useIsMounted } from './use-is-mounted';

interface FetchOptions extends RequestInit {
  // Add any custom options here if needed
}

interface FetchResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

const useFetch = <T = unknown>(url: string, options: FetchOptions = {}): FetchResult<T> => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const isMounted = useIsMounted();

  const fetchData = async () => {
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const result: T = await response.json();
      setData(result);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isMounted) {
      return;
    }
    fetchData();
  }, [isMounted]);

  return { data, loading, error };
};

export default useFetch;
