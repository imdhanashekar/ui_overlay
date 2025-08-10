import React, { useState, useEffect } from 'react';

// Use this hook for fetching data from the YouTube API
const useYouTubeData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // IMPORTANT: Replace this URL with the URL of your deployed YouTube worker.
  const workerUrl = 'https://your-youtube-worker.workers.dev';
  // IMPORTANT: Replace with your actual YouTube Channel ID.
  const channelId = 'YOUR_YOUTUBE_CHANNEL_ID';

  useEffect(() => {
    const fetchYouTubeData = async () => {
      try {
        // We check for the placeholder values to prevent unnecessary API calls
        if (workerUrl.includes('your-youtube-worker') || channelId === 'YOUR_YOUTUBE_CHANNEL_ID') {
          throw new Error('Please update the worker URL and channel ID.');
        }

        const response = await fetch(`${workerUrl}?channelId=${channelId}`);
        const result = await response.json();
        
        if (response.ok) {
          setData({
            subscribers: result.subscriberCount,
            liveViewers: 'N/A',
          });
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    
    // Fetch data initially and then every 5 minutes (300000ms)
    fetchYouTubeData();
    const interval = setInterval(fetchYouTubeData, 300000); 

    return () => clearInterval(interval); // Cleanup on unmount

  }, [channelId, workerUrl]);

  return { data, loading, error };
};

// Use this hook for fetching ELO data from the Faceit API
const useFaceitData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // IMPORTANT: Replace with the URL of your deployed Faceit worker
  const faceitWorkerUrl = 'https://your-faceit-worker.workers.dev';
  // IMPORTANT: Replace with your actual Faceit Player ID
  const playerId = 'YOUR_FACEIT_PLAYER_ID'; 

  useEffect(() => {
    const fetchEloData = async () => {
      try {
        if (playerId === 'YOUR_FACEIT_PLAYER_ID' || faceitWorkerUrl.includes('your-faceit-worker')) {
          throw new Error('Please enter your Faceit Player ID and worker URL.');
        }

        const response = await fetch(`${faceitWorkerUrl}/${playerId}`);
        const result = await response.json();
        
        if (response.ok) {
          setData({
            elo: result.games.cs2.faceit_elo || 'N/A',
            level: result.games.cs2.skill_level || 'N/A',
          });
        } else {
          setError(result.error);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    // Fetch data initially and then every 30 seconds
    fetchEloData();
    const interval = setInterval(fetchEloData, 30000);

    return () => clearInterval(interval);

  }, [playerId, faceitWorkerUrl]);

  return { data, loading, error };
};


// A simple component to display a data card.
const DataCard = ({ title, value, isLoading, error }) => (
  <div className="bg-gray-800 p-6 rounded-2xl shadow-xl flex flex-col items-center justify-center space-y-2 transform transition-transform hover:scale-105 duration-300">
    <h3 className="text-xl font-semibold text-gray-300">{title}</h3>
    {isLoading ? (
      <p className="text-4xl font-bold text-white">Loading...</p>
    ) : error ? (
      <p className="text-lg text-red-400">{error}</p>
    ) : (
      <p className="text-4xl font-bold text-white">{value}</p>
    )}
  </div>
);

const App = () => {
  const { data: youtubeData, loading: youtubeLoading, error: youtubeError } = useYouTubeData();
  const { data: faceitData, loading: faceitLoading, error: faceitError } = useFaceitData();

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-inter flex items-center justify-center">
      <div className="container max-w-5xl mx-auto text-center">
        <h1 className="text-5xl font-extrabold mb-8 text-blue-400 animate-pulse">
          YouTube & CS2 Stream Overlay
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {/* YouTube Subs Card */}
          <DataCard
            title="YouTube Subs"
            value={youtubeData?.subscribers || '...'}
            isLoading={youtubeLoading}
            error={youtubeError}
          />

          {/* CS2 ELO Card */}
          <DataCard
            title="CS2 ELO"
            value={faceitData?.elo || '...'}
            isLoading={faceitLoading}
            error={faceitError}
          />
        </div>
      </div>
    </div>
  );
};

export default App;
