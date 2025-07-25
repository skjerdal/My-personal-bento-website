# Dynamic Bento Grid Personal Website

A modern, responsive personal website built with Astro and Vue.js that features a dynamic bento grid layout. The website is designed to be as dynamic as possible, with all content managed through a centralized data file that mimics a JSON response from a database.

## 🎯 Key Features

- **Dynamic Bento Grid Layout**: Responsive grid system that adapts to different screen sizes
- **Fixed Card Sizing**: Cards maintain perfect proportions and don't alter width when squeezed
- **Component-Based Architecture**: Each card can be filled with custom Vue components
- **Data-Driven Content**: All content is managed through `cardContent.ts` file
- **Custom Card Styling**: Flexible theming with CSS variables, classes, and custom CSS injection
- **Flexible Positioning**: Cards can span multiple grid columns
- **Unique Card Support**: Special wrapper for custom, non-template cards
- **Responsive Design**: Automatically adjusts grid layout for different screen sizes
- **Video Hover Effects**: Animated 3D video loops that play on card hover

## 🏗️ Architecture Overview

### Core Components

- **`CardWrapper.astro`**: Main wrapper that handles card positioning and responsive behavior
- **`Card.vue`**: Dynamic component loader that renders card content based on component name
- **`cardContent.ts`**: Central data file that defines all cards and their properties
- **`card-components/`**: Directory containing individual card components

### Grid System

The bento grid uses CSS Grid with the following responsive breakpoints:
- **Large screens**: 4 columns
- **Medium screens**: 3 columns  
- **Small screens**: 2 columns
- **Mobile**: 1 column

Cards can span 1, 2, or 3 columns and automatically adjust their span on smaller screens.

## 📁 Project Structure

```
src/
├── components/
│   ├── card-components/          # Individual card components
│   │   ├── AboutMe.vue
│   │   ├── ContactSocial.vue
│   │   ├── CurrentStatus.vue
│   │   ├── DownloadResume.vue
│   │   ├── Education.vue
│   │   ├── ExtraCard.vue
│   │   ├── OtherLarge.vue
│   │   └── WorkExperience.vue
│   ├── Card.vue                  # Dynamic component loader
│   ├── CardWrapper.astro         # Card positioning wrapper
│   └── PokemonCard.jsx           # Unique card example
├── data/
│   └── cardContent.ts            # Central data file
├── pages/
│   └── index.astro               # Main page
└── styles/                       # SCSS styles and variables
```

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd Meg
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run astro` - Run Astro CLI commands

## 📝 Adding New Cards

### Method 1: Using the Template System

1. **Add card data to `src/data/cardContent.ts`**:

```typescript
{
  id: 'my-new-card',
  title: 'My New Card',
  content: 'Description of the card',
  component: 'MyNewComponent', // Must match component filename
  position: { span: 1 }, // 1, 2, or 3 columns
  data: {
    // Any data you want to pass to your component
    customField: 'value'
  }
}
```

2. **Create a new component in `src/components/card-components/`**:

```vue
<template>
  <div class="my-new-component">
    <h3>{{ title }}</h3>
    <p>{{ content }}</p>
    <!-- Your custom content here -->
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    content: String,
    // Add any other props you need
  }
}
</script>

<style scoped>
.my-new-component {
  height: 100%;
  /* Your styles here */
}
</style>
```

### Method 2: Creating Unique Cards

For cards that don't follow the template pattern:

1. **Set `isUnique: true` in cardContent.ts**:

```typescript
{
  id: 'unique-card',
  title: 'Unique Card',
  content: 'This is a unique card',
  component: 'UniqueComponent',
  position: { span: 2 },
  isUnique: true
}
```

2. **Create your unique component** (e.g., in `src/components/UniqueComponent.vue`)

3. **Import and use it in `CardWrapper.astro`**

## 🎨 Card Styling & Customization

### Custom Card Styling

The system supports flexible custom styling for individual cards while maintaining core functionality. You can customize cards using CSS variables, classes, or inject custom CSS directly.

#### Basic Custom Styling

Add a `customStyle` property to any card in `cardContent.ts`:

```typescript
{
  id: 'contact',
  title: 'Contact',
  component: 'ContactSocial',
  position: { span: 1 },
  customStyle: {
    // CSS Variables - cleanest approach
    cssVariables: {
      '--card-bg': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      '--text-color': '#ffffff',
      '--shadow-color': 'rgba(102, 126, 234, 0.4)'
    },
    
    // CSS Classes - for reusable themes
    cssClasses: ['premium-card', 'animated-border'],
    
    // Custom CSS - for unique styling
    customCSS: `
      .custom-contact-glow {
        box-shadow: 0 0 30px var(--shadow-color, rgba(0,0,0,0.1));
        animation: pulse 2s infinite;
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.8; }
      }
    `
  }
}
```

#### Styling Options

1. **CSS Variables** (`cssVariables`)
   - Cleanest approach for theming
   - Inherits all base functionality
   - Easy to maintain and modify

2. **CSS Classes** (`cssClasses`)
   - Perfect for reusable themes
   - Define classes in your global styles
   - Can be combined with CSS variables

3. **Custom CSS** (`customCSS`)
   - Most flexible for unique designs
   - Injected directly into the component
   - Use for complex animations or layouts

#### Styling Examples

**Gradient Background Card:**
```typescript
{
  id: 'premium-work',
  component: 'WorkExperience',
  customStyle: {
    cssVariables: {
      '--card-bg': 'linear-gradient(45deg, #ff6b6b, #4ecdc4)',
      '--text-color': 'white',
      '--border-radius': '20px'
    }
  }
}
```

**Neon Glow Effect:**
```typescript
{
  id: 'neon-status',
  component: 'CurrentStatus',
  customStyle: {
    cssClasses: ['neon-glow'],
    customCSS: `
      .neon-glow {
        box-shadow: 0 0 20px #00ffff, 0 0 40px #00ffff;
        border: 2px solid #00ffff;
        background: #001122;
      }
    `
  }
}
```

**Dark Theme Card:**
```typescript
{
  id: 'dark-education',
  component: 'Education',
  customStyle: {
    cssVariables: {
      '--card-bg': '#1a1a1a',
      '--text-color': '#e0e0e0',
      '--accent-color': '#bb86fc',
      '--shadow-intensity': '0.3'
    }
  }
}
```

#### What Gets Inherited vs. Customized

**✅ Always Inherited:**
- Card size and positioning
- Grid responsiveness
- Fly-in animations
- Basic structure and layout

**🎨 Fully Customizable:**
- Background colors/gradients
- Text colors and fonts
- Shadows and effects
- Borders and border radius
- Custom animations
- Component-specific styling

### Card Positioning

Cards can span different numbers of columns:

- `position: { span: 1 }` - Single column (default)
- `position: { span: 2 }` - Two columns wide
- `position: { span: 3 }` - Three columns wide

On smaller screens, cards automatically adjust:
- Medium screens: 3-span cards become 2-span
- Small screens: All multi-span cards become 1-span

## 📊 Data Structure

The `cardContent.ts` file uses TypeScript interfaces:

```typescript
type CardPosition = {
  span: number;
};

type CustomStyle = {
  cssVariables?: Record<string, string>;
  cssClasses?: string[];
  customCSS?: string;
};

type Card = {
  id: string;
  title: string;
  content: string;
  component: string;
  position: CardPosition;
  isUnique?: boolean;
  data?: any; // Custom data for your components
  videoPath?: string; // Path to hover animation video
  customStyle?: CustomStyle; // Custom styling options
};
```

## 🎯 Best Practices

### Component Development

1. **Fixed Height**: All card components should work within the fixed card height (433px - 1.5rem)
2. **Responsive Design**: Components should adapt to different card sizes
3. **Overflow Handling**: Use proper overflow handling for content that might exceed card bounds
4. **Props Interface**: Define clear props interfaces for your components

### Data Management

1. **Centralized Data**: Keep all card data in `cardContent.ts`
2. **Type Safety**: Use TypeScript interfaces for data structures
3. **Component Naming**: Component names in data must match component filenames
4. **Data Validation**: Validate data structures to prevent runtime errors

### Styling

1. **CSS Variables**: Use CSS custom properties for theming
2. **SCSS Mixins**: Leverage existing mixins for responsive design
3. **Consistent Spacing**: Follow the established spacing system
4. **Accessibility**: Ensure proper contrast ratios and keyboard navigation
5. **Custom Styling**: Prefer CSS variables over custom CSS for maintainability
6. **Theme Reusability**: Use cssClasses for themes that will be used across multiple cards

## 🔧 Customization

### Themes

The website supports theme customization through CSS variables. Modify `src/styles/color-theme.scss` to change the color scheme.

### Grid Layout

Adjust the grid system in `CardWrapper.astro`:
- Change column counts for different breakpoints
- Modify gap sizes
- Adjust card spanning behavior

### Card Styling

Modify card appearance in `Card.vue`:
- Change border radius
- Adjust padding and margins
- Modify background effects
- Update shadow styles

## 🚀 Deployment

The project is configured for deployment on Vercel:

1. Connect your repository to Vercel
2. Vercel will automatically detect the Astro configuration
3. Deploy with `npm run build`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 🆘 Support

If you encounter any issues or have questions:

1. Check the existing issues in the repository
2. Create a new issue with detailed information
3. Include steps to reproduce the problem
4. Provide your environment details (OS, Node.js version, etc.)

## 🎬 Video Hover Effects

The website supports animated video icons that appear next to card headlines and play on hover, creating engaging 3D object effects. **Videos are completely optional** - cards work perfectly without them.

### Adding Videos to Cards

1. **Place your MP4 videos in `public/videos/`** with the naming convention:
   - `work-loop.mp4` for Work Experience card
   - `contact-loop.mp4` for Contact & Social card
   - `education-loop.mp4` for Education card
   - etc.

2. **Add videoPath to card data** in `src/data/cardContent.ts`:
   ```typescript
   {
     id: 'work',
     title: 'Work Experience',
     component: 'WorkExperience',
     position: { span: 2 },
     videoPath: '/videos/work-loop.mp4' // Optional - only add if you have a video
   }
   ```


---

Built with ❤️ using [Astro](https://astro.build) and [Vue.js](https://vuejs.org/)
