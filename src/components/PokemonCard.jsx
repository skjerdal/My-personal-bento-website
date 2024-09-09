import React, { useState, useEffect, useRef } from 'react';
import { Camera, Code, Database } from 'lucide-react';
import './component-style/PokemonCard.scss';

const iconComponents = { Camera, Code, Database };

const PokemonCard = ({ title = '', content = '', className, style, componentName, position, ...otherProps }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [pointerPosition, setPointerPosition] = useState({ x: 50, y: 50 });
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 50, y: 50 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [distanceFromCenter, setDistanceFromCenter] = useState(0);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

     // Set pointer position
    setPointerPosition({ x: x * 100, y: y * 100 });


    // Set background position (with adjusted range and smoothing)
    setBackgroundPosition(prev => ({
      x: prev.x + (adjust(x * 100, 0, 100, 37, 63) - prev.x) * 0.1,
      y: prev.y + (adjust(y * 100, 0, 100, 33, 67) - prev.y) * 0.1
    }));


    // Calculate rotation
    const rotateY = (x - 0.5) * 20; // -10 to +10 degrees
    const rotateX = (y - 0.5) * -20; // +10 to -10 degrees

    setRotation({ x: rotateX, y: rotateY });

    // Calc distance from center
    const centerX = 0.5;
    const centerY = 0.5;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    setDistanceFromCenter(distance);
  };

  const adjust = (value, fromMin, fromMax, toMin, toMax) => {
    return toMin + (toMax - toMin) * ((value - fromMin) / (fromMax - fromMin));
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setPointerPosition({ x: 50, y: 50 });
    setBackgroundPosition({ x: 50, y: 50 });
    setRotation({ x: 0, y: 0 });
    setDistanceFromCenter(0);
  };

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
    }
    return () => {
      if (card) {
        card.removeEventListener('mousemove', handleMouseMove);
        card.removeEventListener('mouseenter', handleMouseEnter);
        card.removeEventListener('mouseleave', handleMouseLeave);
      }
    };
  }, []);

  const renderIcon = (iconName) => {
    const IconComponent = iconComponents[iconName];
    return IconComponent ? <IconComponent size={20} /> : null;
  };

  const cardStyle = {
    ...style,
    '--pointer-x': `${pointerPosition.x}%`,
    '--pointer-y': `${pointerPosition.y}%`,
    '--background-x': `${backgroundPosition.x}%`,
    '--background-y': `${backgroundPosition.y}%`,
    '--card-opacity': isHovered ? 1 : 0,
    '--hyp': distanceFromCenter,
    '--rotate-x': `${rotation.x}deg`,
    '--rotate-y': `${rotation.y}deg`,
    transition: isHovered ? 'none' : 'all 0.5s ease-out',
  };

  return (
    <div 
      ref={cardRef} 
      className={`pokemon-card ${className || ''} ${isHovered ? 'hovered' : ''}`}
      style={cardStyle}
      {...otherProps}
    >
      <div className="card__shine"></div>
      <div className="card__glare"></div>
      <div className="card-content">
        <div className="card-header">
          <h2>{title || 'Your Name'}</h2>
          <span className="type">Developer</span>
        </div>
        <div className="card-image">
          <img src="./Default_pfp.png" alt="Profile" />
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
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;