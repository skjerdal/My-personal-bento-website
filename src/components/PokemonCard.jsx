import React, { useState, useEffect, useRef } from 'react';
import { Code, Database, Cpu, Globe, Palette } from 'lucide-react';
import './component-style/PokemonCard.scss';

const iconComponents = { Code, Database, Cpu, Globe, Palette };

const PokemonCard = ({ title = '', content = '', className, style, componentName, position, ...otherProps }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const xNorm = (e.clientX - rect.left) / rect.width; // 0–1
    const yNorm = (e.clientY - rect.top) / rect.height; // 0–1

    // Pre-compute frequently used values
    const pointerX = xNorm * 100;
    const pointerY = yNorm * 100;
    const bgX = adjust(pointerX, 0, 100, 37, 63);
    const bgY = adjust(pointerY, 0, 100, 33, 67);
    const rotateY = (xNorm - 0.5) * 20;   // -10° → +10°
    const rotateX = (yNorm - 0.5) * -20;  // +10° → -10°
    const distance = Math.hypot(xNorm - 0.5, yNorm - 0.5);

    // Update CSS custom properties directly – no React re-render
    const style = cardRef.current.style;
    style.setProperty('--pointer-x', `${pointerX}%`);
    style.setProperty('--pointer-y', `${pointerY}%`);
    style.setProperty('--background-x', `${bgX}%`);
    style.setProperty('--background-y', `${bgY}%`);
    style.setProperty('--rotate-x', `${rotateX}deg`);
    style.setProperty('--rotate-y', `${rotateY}deg`);
    style.setProperty('--hyp', distance);
  };

  const adjust = (value, fromMin, fromMax, toMin, toMax) => {
    return toMin + (toMax - toMin) * ((value - fromMin) / (fromMax - fromMin));
  };

  const handleMouseEnter = (e) => {
    
    // Calculate initial position based on where the mouse entered
    if (cardRef.current) {
      const rect = cardRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      
      // Set initial rotation based on entry point to prevent jumping
      const rotateY = (x - 0.5) * 20;
      const rotateX = (y - 0.5) * -20;
      const style = cardRef.current.style;
      style.setProperty('--rotate-x', `${rotateX}deg`);
      style.setProperty('--rotate-y', `${rotateY}deg`);
      
      // Set pointer position
      const pointerX = x * 100;
      const pointerY = y * 100;
      const bgX = adjust(pointerX, 0, 100, 37, 63);
      const bgY = adjust(pointerY, 0, 100, 33, 67);
      style.setProperty('--pointer-x', `${pointerX}%`);
      style.setProperty('--pointer-y', `${pointerY}%`);
      style.setProperty('--background-x', `${bgX}%`);
      style.setProperty('--background-y', `${bgY}%`);
      
      // Calculate distance from center
      const centerX = 0.5;
      const centerY = 0.5;
      const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
      cardRef.current.style.setProperty('--hyp', distance);
    }
    
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    
    // Smoothly transition back to neutral position
    setIsHovered(false);
    
    // Reset positions after transition completes
    if (!isHovered) {
      const style = cardRef.current?.style;
      if (style) {
        style.setProperty('--pointer-x', '50%');
        style.setProperty('--pointer-y', '50%');
        style.setProperty('--background-x', '50%');
        style.setProperty('--background-y', '50%');
        style.setProperty('--rotate-x', '0deg');
        style.setProperty('--rotate-y', '0deg');
        style.setProperty('--hyp', '0');
      }
    }
  };

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
    '--pointer-x': '50%',
    '--pointer-y': '50%',
    '--background-x': '50%',
    '--background-y': '50%',
    '--card-opacity': isHovered ? 1 : 0,
    '--hyp': 0,
    '--rotate-x': '0deg',
    '--rotate-y': '0deg',
    '--scale-factor': 1,
  };

  // Skills data with progress values
  // const skills = [
  //   { name: 'Attack', value: 90, icon: 'Code' }, // Frontend as Attack
  //   { name: 'Defense', value: 85, icon: 'Database' }, // Backend as Defense
  //   { name: 'Speed', value: 75, icon: 'Cpu' }, // DevOps as Speed
  //   { name: 'Special', value: 80, icon: 'Palette' }, // UI/UX as Special
  //   { name: 'HP', value: 330, icon: 'Globe' } // Web3 as something, but HP is separate
  // ];

  return (
    <>
      <div 
        ref={cardRef} 
        className={`pokemon-card ${className || ''} ${isHovered ? 'hovered' : ''} ${isInitialized ? 'initialized' : ''}`}
        style={cardStyle}
        {...otherProps}
      >
        <div className="card-inner">
          {/* FRONT */}
          <div className="card-face card-front">
            <div className="card__shine"></div>
            <div className="card__glare"></div>
            <div className="card-content">
              <div className="card-bg-layer" />
              {/* Card Header */}
              <div className="card-header">
                <div className="name-type-container">
                  <h2 className="card-title">{title || 'Thomas Skjerdal'}</h2>
                  <span className="evolution">Evolves from Junior Dev</span>
                  <span className="type">Developer</span>
                </div>
                <div className="hp-container">
                  <img src="./computertype.png" alt="Computer Type" className="type-icon" />
                  <div className="hp">
                    <span className="hp-text">HP</span>
                    <span className="hp-value">340</span>
                  </div>
                </div>
              </div>
              
              {/* Card Image */}
              <div className="card-image-container">
                <div className="card-image">
                  <img src="./profil.jpg" alt="Profile" />
                </div>
                {/* <div className="card-subtitle">
                  <span>Full-Stack Developer</span>
                </div> */}
              </div>
              
              {/* Ability Section */}
              <div className="card-ability">
                <div className="ability-header">
                  <span className="ability-badge">Ability</span>
                  <span className="ability-name"> Code Surge</span>
                </div>
                <p>Once per turn, draw an extra idea from your inspiration deck.</p>
              </div>
              
              {/* Attacks */}
              <div className="card-attacks">
                <div className="attack">
                  <div className="attack-header">
                    <div className="attack-cost">
                      <img src="/caffeineicon.png" alt="cost" />
                    </div>
                    <span className="attack-name">Quick Fix</span>
                    <span className="attack-damage">30</span>
                  </div>
                  <p>Flip a coin. If heads, prevent all effects of an attack during your opponent's next turn.</p>
                </div>
                <div className="attack">
                  <div className="attack-header">
                    <div className="attack-cost">
                      <img src="/caffeineicon.png" alt="cost" />
                      <img src="/caffeineicon.png" alt="cost" />
                      <img src="/caffeineicon.png" alt="cost" />
                    </div>
                    <span className="attack-name">Full Deployment</span>
                    <span className="attack-damage">90</span>
                  </div>
                  <p>This attack does 20 more damage for each bug fixed this turn.</p>
                </div>
              </div>
              
              {/* Weakness/Resistance/Retreat */}
              <div className="card-weakness">
                <div>
                  <span>Weakness</span>
                  <span className="weakness-type">Monster Shortage ×2</span>
                </div>
                <div>
                  <span>Resistance</span>
                  <span className="resistance-type">Deadline Pressure -20</span>
                </div>
                <div>
                  <span>Retreat Cost</span>
                  <div className="retreat-cost">
                    <img src="/caffeineicon.png" alt="cost" />
                    <img src="/caffeineicon.png" alt="cost" />
                  </div>
                </div>
              </div>
              
              {/* Card Footer */}
              <div className="card-footer">
                <div className="card-set-row">
                  <span className="set-number">001/001</span>
                  <div className="rarity-symbol">
                    <span className="star">★</span>
                  </div>
                  <img src="/caffeineicon.png" alt="Set icon" className="set-icon" />
                </div>
                <div className="card-info-row">
                  <span className="illus">Illus. Thomas Skjerdal</span>
                  <span className="copyright">© 2025 T. Skjerdal</span>
                </div>
              </div>
            </div>
          </div>
        </div>{/* end card-inner */}
      </div>
    </>
  );
};

export default PokemonCard;