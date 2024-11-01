import React, { useState, useEffect, useRef } from 'react';
import { Clock, Bell, Music, ExternalLink } from 'lucide-react';

function App() {
  const [youtubeLink, setYoutubeLink] = useState('');
  const [alarmTime, setAlarmTime] = useState('');
  const [currentTime, setCurrentTime] = useState('');
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const [isAlarmRinging, setIsAlarmRinging] = useState(false);
  const [videoId, setVideoId] = useState('');
  const alarmOpenedRef = useRef(false);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());

      if (isAlarmSet && now.toLocaleTimeString().slice(0, 5) === alarmTime && !alarmOpenedRef.current) {
        setIsAlarmRinging(true);
        openYouTubeLink();
        alarmOpenedRef.current = true;
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [isAlarmSet, alarmTime]);

  const handleYoutubeLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const link = e.target.value;
    setYoutubeLink(link);
    const id = extractVideoId(link);
    setVideoId(id);
  };

  const extractVideoId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : '';
  };

  const handleSetAlarm = () => {
    if (alarmTime && youtubeLink) {
      setIsAlarmSet(true);
      alarmOpenedRef.current = false;
    } else {
      alert('Please set both alarm time and YouTube video link');
    }
  };

  const handleStopAlarm = () => {
    setIsAlarmRinging(false);
    setIsAlarmSet(false);
    alarmOpenedRef.current = false;
  };

  const openYouTubeLink = () => {
    if (!alarmOpenedRef.current) {
      window.open(youtubeLink, '_blank');
      alarmOpenedRef.current = true;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white p-4 sm:p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-center text-indigo-700 flex items-center justify-center">
          <Music className="mr-2" /> Music Alarm Clock
        </h1>
        <p className="text-center text-indigo-600 mb-4 sm:mb-6">Wake Up with the Music You Love</p>
        <div className="mb-4 sm:mb-6 text-center">
          <label className="block text-sm font-medium text-indigo-600 mb-1">
            Current Time
          </label>
          <div className="text-2xl sm:text-3xl font-semibold text-indigo-800">{currentTime}</div>
        </div>
        <div className="mb-4 sm:mb-6">
          <label htmlFor="alarmTime" className="block text-sm font-medium text-indigo-600 mb-1">
            Set Alarm Time
          </label>
          <input
            type="time"
            id="alarmTime"
            className="w-full p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={alarmTime}
            onChange={(e) => setAlarmTime(e.target.value)}
          />
        </div>
        <div className="mb-4 sm:mb-6">
          <label htmlFor="youtubeLink" className="block text-sm font-medium text-indigo-600 mb-1">
            YouTube Video Link
          </label>
          <input
            type="text"
            id="youtubeLink"
            className="w-full p-2 border border-indigo-300 rounded focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
            value={youtubeLink}
            onChange={handleYoutubeLinkChange}
            placeholder="https://www.youtube.com/watch?v=..."
          />
        </div>
        {videoId && (
          <div className="mb-4 sm:mb-6">
            <label className="block text-sm font-medium text-indigo-600 mb-1">
              Video Preview
            </label>
            <div className="aspect-w-16 aspect-h-9">
              <img
                src={`https://img.youtube.com/vi/${videoId}/0.jpg`}
                alt="YouTube video thumbnail"
                className="rounded-lg object-cover w-full h-full"
              />
            </div>
          </div>
        )}
        {!isAlarmSet ? (
          <button
            onClick={handleSetAlarm}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition-colors flex items-center justify-center"
          >
            <Bell className="mr-2" /> Set Alarm
          </button>
        ) : (
          <button
            onClick={handleStopAlarm}
            className="w-full bg-red-500 text-white p-3 rounded-lg font-semibold hover:bg-red-600 transition-colors flex items-center justify-center"
          >
            {isAlarmRinging ? <Bell className="mr-2" /> : <Clock className="mr-2" />}
            {isAlarmRinging ? 'Stop Alarm' : 'Cancel Alarm'}
          </button>
        )}
        {isAlarmSet && !isAlarmRinging && (
          <p className="mt-4 text-sm text-indigo-600 flex items-center justify-center">
            <Bell className="mr-1" size={16} />
            Alarm set for {alarmTime}
          </p>
        )}
        {isAlarmRinging && (
          <p className="mt-4 text-sm text-green-600 flex items-center justify-center">
            <ExternalLink className="mr-1" size={16} />
            Alarm is ringing! Check your new browser tab.
          </p>
        )}
      </div>
      <div className="mt-8 w-full max-w-md bg-gray-200 p-4 rounded-lg">
        <p className="text-center text-gray-600">Advertisement Space</p>
      </div>
    </div>
  );
}

export default App;