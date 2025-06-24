import React, { useState, useEffect, useRef } from 'react';
import { Code, Database, Cpu, Globe, Palette } from 'lucide-react';
import './component-style/PokemonCard.scss';

const iconComponents = { Code, Database, Cpu, Globe, Palette };

const PokemonCard = ({ title = '', content = '', className, style, componentName, position, ...otherProps }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isFlipping, setIsFlipping] = useState(false);
  const [pointerPosition, setPointerPosition] = useState({ x: 50, y: 50 });
  const [backgroundPosition, setBackgroundPosition] = useState({ x: 50, y: 50 });
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [distanceFromCenter, setDistanceFromCenter] = useState(0);
  const [isInitialized, setIsInitialized] = useState(false);
  const [originalPosition, setOriginalPosition] = useState({ top: 0, left: 0, width: 0, height: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current || isFullscreen || isFlipping) return;

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

  const handleMouseEnter = (e) => {
    if (isFullscreen || isFlipping) return;
    
    // Calculate initial position based on where the mouse entered
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      // Set initial rotation based on entry point to prevent jumping
      const rotateY = (x - 0.5) * 20;
      const rotateX = (y - 0.5) * -20;
      setRotation({ x: rotateX, y: rotateY });
      
      // Set pointer position
      setPointerPosition({ x: x * 100, y: y * 100 });
      
      // Set background position
      setBackgroundPosition({
        x: adjust(x * 100, 0, 100, 37, 63),
        y: adjust(y * 100, 0, 100, 33, 67)
      });
      
      // Calculate distance from center
      const centerX = 0.5;
      const centerY = 0.5;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      setDistanceFromCenter(distance);
    }
    
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    if (isFullscreen || isFlipping) return;
    
    // Smoothly transition back to neutral position
    setIsHovered(false);
    
    // Reset positions after transition completes
    if (!isHovered) {
      setPointerPosition({ x: 50, y: 50 });
      setBackgroundPosition({ x: 50, y: 50 });
      setRotation({ x: 0, y: 0 });
      setDistanceFromCenter(0);
    }
  };

  const handleCardClick = () => {
    if (isFlipping) return;
    
    setIsFlipping(true);
    
    if (!isFullscreen) {
      // Store the original position before going fullscreen
      const rect = cardRef.current.getBoundingClientRect();
      setOriginalPosition({
        top: rect.top,
        left: rect.left,
        width: rect.width,
        height: rect.height
      });
      
      // Reset rotation for the flip animation
      setRotation({ x: 0, y: 0 });
      
      // Add a small delay before setting fullscreen to allow the flip animation to start
      setTimeout(() => {
        setIsFullscreen(true);
        
        // After the flip animation completes, reset the flipping state
        setTimeout(() => {
          setIsFlipping(false);
        }, 600);
      }, 50);
    } else {
      // Reset rotation for the flip back animation
      setRotation({ x: 0, y: 0 });
      
      // Add a small delay before removing fullscreen to allow the flip animation to start
      setTimeout(() => {
        setIsFullscreen(false);
        
        // After the flip animation completes, reset the flipping state
        setTimeout(() => {
          setIsFlipping(false);
        }, 600);
      }, 50);
    }
  };

  // Handle escape key to exit fullscreen
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === 'Escape' && isFullscreen && !isFlipping) {
        handleCardClick();
      }
    };
    
    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [isFullscreen, isFlipping]);

  useEffect(() => {
    const card = cardRef.current;
    if (card) {
      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseenter', handleMouseEnter);
      card.addEventListener('mouseleave', handleMouseLeave);
      
      // Set initialized after first render
      setIsInitialized(true);
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
    return IconComponent ? <IconComponent size={16} /> : null;
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
    // Let the CSS handle transitions based on hover state
  };

  // Skills data with progress values
  const skills = [
    { name: 'Frontend', value: 90, icon: 'Code' },
    { name: 'Backend', value: 85, icon: 'Database' },
    { name: 'DevOps', value: 75, icon: 'Cpu' },
    { name: 'UI/UX', value: 80, icon: 'Palette' },
    { name: 'Web3', value: 70, icon: 'Globe' }
  ];

  return (
    <>
      <div 
        ref={cardRef} 
        className={`pokemon-card ${className || ''} ${isHovered ? 'hovered' : ''} ${isInitialized ? 'initialized' : ''} ${isFullscreen ? 'fullscreen' : ''} ${isFlipping ? 'flipping' : ''}`}
        style={cardStyle}
        onClick={handleCardClick}
        {...otherProps}
      >
        <div className="card__shine"></div>
        <div className="card__glare"></div>
        <div className="card-content">
          {/* Card Header */}
          <div className="card-header">
            <div className="name-type-container">
              <h2 className="card-title">{title || 'Thomas Skjerdal'}</h2>
              <span className="type">Developer</span>
            </div>
            <div className="hp-container">
              <span className="hp">HP 100</span>
            </div>
          </div>
          
          {/* Card Image */}
          <div className="card-image-container">
            <div className="card-image">
              <img src="./profil.jpg" alt="Profile" />
            </div>
            <div className="card-subtitle">
              <span>Full-Stack Developer</span>
            </div>
          </div>
          
          {/* Card Description - truncate long content */}
          <div className="card-description">
            <p>{(content || 'A passionate full-stack developer with a love for creating interactive and engaging web experiences.').substring(0, 120)}{(content || '').length > 120 ? '...' : ''}</p>
          </div>
          
          {/* Skills Section - limited to top 4 skills when not fullscreen */}
          <div className="card-skills">
            {skills.slice(0, isFullscreen ? skills.length : 4).map((skill, index) => (
              <div key={index} className="skill-item">
                <div className="skill-header">
                  {renderIcon(skill.icon)}
                  <span className="skill-name">{skill.name}</span>
                  <span className="skill-value">{skill.value}</span>
                </div>
                <div className="skill-bar-container">
                  <div className="skill-bar" style={{ width: `${skill.value}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          
          {/* Card Footer */}
          <div className="card-footer">
            <div className="special-attack">
              <span className="attack-cost">⚡⚡</span>
              <span className="attack-name">Code Mastery</span>
              <span className="attack-damage">90+</span>
            </div>
            <div className="card-info">
              <span className="info-text">Rare Holo • Developer • #001 ⭐</span>
            </div>
          </div>
        </div>
      </div>
      {isFullscreen && (
        <div className="card-overlay" onClick={handleCardClick}></div>
      )}
    </>
  );
};

export default PokemonCard;