import React, { useEffect, useState } from 'react';
import { getUsernameFromToken } from '../utils/auth';
import './styles/headersell.css';

const Header = () => {
  const username = getUsernameFromToken();
  const [backgroundUrl, setBackgroundUrl] = useState(
    'https://storage.googleapis.com/grandelo.appspot.com/1732717512234-Untitled design.png'
  );
  const [isVideo, setIsVideo] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBackground = async () => {
      try {
        const response = await fetch('/api/getBackground');
        const data = await response.json();
        if (data.url) {
          setBackgroundUrl(data.url);
          setIsVideo(data.isVideo);
        }
      } catch (error) {
        console.error('Error fetching background:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchBackground();
  }, []);

  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour < 12) return 'Good Morning';
    if (currentHour < 18) return 'Good Afternoon';
    if (currentHour < 22) return 'Good Evening';
    return 'Good Night';
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="shdr-container">
      <header className="shdr-header">
        {/* Background media */}
        {isVideo ? (
          <video
            className="shdr-bg-video"
            src={backgroundUrl}
            autoPlay
            loop
            muted
            aria-label="Background video"
          />
        ) : (
          <img
            className="shdr-bg-image"
            src={backgroundUrl}
            alt="Dynamic background"
          />
        )}
        {/* Overlay gradient */}
        <div className="shdr-overlay"></div>

        {/* Header content */}
        <div className="shdr-content">
          <h1 className="shdr-title">{`${getGreeting()}, ${username}!`}</h1>
          <p className="shdr-subtitle">Welcome to our platform</p>
        </div>

        {/* Floating logo */}
        <div className="shdr-logo">
          <img
            src="https://storage.googleapis.com/grandelo.appspot.com/1732717512225-Ícone de perfil de usuário em estilo plano Ilustração em vetor avatar membro em fundo isolado Conceito de negócio de sinal de permissão humana _ Vetor Premium.jpeg"
            alt="Owner's Logo"
            className="shdr-logo-img"
          />
        </div>
      </header>
    </div>
  );
};

export default Header;
