'use client';

import { useState } from 'react';

export default function TestPage() {
  const [result, setResult] = useState<{
    status?: string;
    message?: string;
    error?: string;
    details?: unknown;
  } | null>(null);
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/test-db');
      const data = await response.json();
      setResult(data);
    } catch (error) {
      setResult({ error: 'Failed to test connection', details: error });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto">
        <h1 className="text-2xl font-bold mb-4">MongoDB Connection Test</h1>
        
        <button 
          onClick={testConnection}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? 'Testing...' : 'Test Connection'}
        </button>

        {result && (
          <div className="mt-4 p-4 border rounded">
            <h2 className="font-bold mb-2">Result:</h2>
            <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <h3 className="font-bold mb-2">Troubleshooting:</h3>
          <ul className="list-disc list-inside space-y-1">
            <li>Make sure MONGODB_URI environment variable is set</li>
            <li>Check if your MongoDB Atlas cluster is running</li>
            <li>Verify your connection string format</li>
            <li>Ensure your IP is whitelisted in MongoDB Atlas</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 