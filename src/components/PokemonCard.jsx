import React, { useState, useEffect, useRef } from 'react';
import { Camera, GitHub, Code, Database } from 'lucide-react';
import './component-style/PokemonCard.scss';

const iconComponents = { Camera, GitHub, Code, Database };

const PokemonCard = ({ title, content, className, style, ...otherProps }) => {
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [glowPosition, setGlowPosition] = useState({ x: 50, y: 50 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotateX = (y - centerY) / 10;
      const rotateY = (centerX - x) / 10;

      setRotation({ x: rotateX, y: rotateY });
      setGlowPosition({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
    }
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
    setGlowPosition({ x: 50, y: 50 });
  };

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  
  const renderIcon = (iconName) => {
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  return (
    <div 
      ref={cardRef} 
      className={`pokemon-card`} // kan legge til om ein vil ha card stylen og:  ${className || ''}
      style={{
        ...style,
        transform: `perspective(1000px) rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
        backgroundPosition: `${glowPosition.x}% ${glowPosition.y}%`
      }}
      {...otherProps}
    >
      <div className="card-content">
        <div className="card-header">
          <h2>{title || 'Your Name'}</h2>
          <span className="type">Developer</span>
        </div>
        <div className="card-image">
          <img src="/api/placeholder/150/150" alt="Profile" />
        </div>
        <div className="card-body">
          <p>{content || 'A passionate developer with a love for creating interactive and engaging web experiences.'}</p>
        </div>
        <div className="card-stats">
          <div className="stat">
            {renderIcon('Camera')}
            <span>Front-end: 90</span>
          </div>
          <div className="stat">
            {renderIcon('Database')}
            <span>Back-end: 85</span>
          </div>
          <div className="stat">
            {renderIcon('Code')}
            <span>Algorithms: 80</span>
          </div>
          <div className="stat">
            {renderIcon('GitHub')}
            <span>Open Source: 75</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;