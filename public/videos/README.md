# Video Assets for Bento Grid Hover Effects

This directory contains MP4 video files that provide animated 3D object effects on card hover. **Videos are completely optional** - only add them to cards where you want video hover effects.

## Video Requirements

### Technical Specifications
- **Format**: MP4
- **Background**: Perfect white background (#FFFFFF)
- **Loop**: Perfect seamless loop
- **Size**: Optimized for web (recommended: 720p or lower)
- **Duration**: 2-5 seconds for smooth looping
- **File Size**: Keep under 2MB per video for fast loading

### Naming Convention
Videos should be named according to the card they correspond to:
- `work-loop.mp4` - Work Experience card
- `contact-loop.mp4` - Contact & Social card
- `education-loop.mp4` - Education card
- `status-loop.mp4` - Current Status card (optional)
- `other-loop.mp4` - Other Large card (optional)
- `resume-loop.mp4` - Download Resume card (optional)
- `extra-loop.mp4` - Extra Card (optional)

### Important Notes
- **PokemonCard (About)**: Does not need a video - it has its own unique 3D hover effects
- **Optional Videos**: Only create videos for cards where you want the effect
- **Graceful Fallback**: Cards without videos work normally

### Content Guidelines
- **3D Objects**: Rotating or animated 3D objects work best
- **Abstract Shapes**: Geometric shapes, particles, or abstract animations
- **Brand Elements**: Icons or symbols related to the card content
- **Smooth Motion**: Avoid jarring movements or cuts
- **Subtle Effects**: The video should enhance, not distract from content

### Integration
The videos are automatically loaded and played on hover with:
- Smooth fade-in/out transitions
- Screen blend mode for better integration
- Proper z-index layering
- Responsive scaling

### Performance Notes
- Videos are preloaded with `preload="metadata"` for faster hover response
- Videos are muted to comply with autoplay policies
- Failed video loads are gracefully handled with console warnings
- Videos are only loaded when `videoPath` is specified in card data 