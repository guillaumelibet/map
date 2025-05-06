'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    router.push('/map.html');
  }, [router]);

  const handleRegenerate = async () => {
    try {
      setIsRegenerating(true);
      setMessage('Régénération de la carte en cours...');
      
      const response = await fetch('/api/regenerate-map', {
        method: 'POST',
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setMessage('Carte régénérée avec succès ! Rafraîchissement...');
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      } else {
        setMessage('Erreur lors de la régénération : ' + data.error);
      }
    } catch (error) {
      setMessage('Erreur lors de la régénération : ' + error);
    } finally {
      setIsRegenerating(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="text-center">
        <p className="mb-4">Redirection vers la carte...</p>
        <button
          onClick={handleRegenerate}
          disabled={isRegenerating}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400"
        >
          {isRegenerating ? 'Régénération...' : 'Régénérer la carte'}
        </button>
        {message && (
          <p className="mt-4 text-sm text-gray-600">{message}</p>
        )}
      </div>
    </main>
  );
}
