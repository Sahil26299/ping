# Landing Page Configuration Guide

## Overview
The landing page is now fully config-driven through `src/utilities/json/landingConfig.json`. You can modify all aspects of the landing page without touching any component code.

## Configuration Structure

### Meta Information
```json
"meta": {
  "title": "Ping - Connect & Chat Instantly",
  "description": "Experience real-time messaging...",
  "keywords": ["messaging", "chat", "real-time"]
}
```

### Branding
```json
"branding": {
  "logo": {
    "text": "P",
    "size": "w-8 h-8",
    "color": "bg-primary",
    "textColor": "text-primary-foreground",
    "textSize": "text-sm font-bold"
  },
  "companyName": "Ping",
  "companyNameSize": "text-xl font-bold"
}
```

### Hero Section
- **enabled**: Toggle the entire hero section
- **heading**: Configure the main headline with highlighted words
- **description**: Hero section description
- **ctaButtons**: Array of call-to-action buttons
- **stats**: Display statistics (users, messages, uptime)
- **animation**: Lottie animation configuration

### Features Section
- **enabled**: Toggle the features section
- **heading**: Section title and description
- **items**: Array of feature cards with:
  - `id`: Unique identifier
  - `icon`: Icon name (lightning, lock, users)
  - `title`: Feature title
  - `description`: Feature description

### CTA Section
- **enabled**: Toggle the call-to-action section
- **heading**: CTA title
- **description**: CTA description
- **buttons**: Array of CTA buttons
- **background**: Background gradient class

### Footer
- **enabled**: Toggle the footer
- **copyright**: Copyright text
- **className**: Footer styling classes

### Layout
- **container**: Main container classes
- **background**: Background pattern classes
- **sections**: Spacing and container classes

## How to Modify

### Adding a New Feature
1. Open `src/utilities/json/landingConfig.json`
2. Add a new item to the `features.items` array:
```json
{
  "id": "new-feature",
  "icon": "lightning",
  "title": "New Feature",
  "description": "Description of the new feature."
}
```

### Changing Hero Content
Edit the `hero` section:
```json
"hero": {
  "heading": {
    "text": "Your New Heading",
    "highlightedWord": "New",
    "highlightedWordIndex": 1
  },
  "description": "Your new description"
}
```

### Modifying Buttons
Edit button properties in `hero.ctaButtons` or `cta.buttons`:
```json
{
  "id": "button-id",
  "text": "Button Text",
  "href": "/path",
  "variant": "primary",
  "className": "your-custom-classes"
}
```

### Adding New Stats
Add items to `hero.stats`:
```json
{
  "id": "stat-id",
  "value": "100K+",
  "label": "New Metric"
}
```

## HTML Semantics Improvements

The landing page now uses proper semantic HTML:
- `<header>` for section headers
- `<article>` for feature cards
- `<section>` for page sections
- `<footer>` for the footer
- `<nav>` for navigation (handled by Navbar component)

## Navbar Component

The Navbar is now reusable for both landing page and dashboard:
- **Landing variant**: `variant="landing"` - Shows logo and auth buttons
- **Dashboard variant**: `variant="dashboard"` (default) - Shows sidebar trigger and user info

Usage:
```tsx
// Landing page
<Navbar variant="landing" />

// Dashboard
<Navbar variant="dashboard" recipientDetails={recipientDetails} />
```

## Benefits

1. **Easy Customization**: Change content without touching code
2. **SEO Friendly**: Proper semantic HTML structure
3. **Accessible**: ARIA-friendly structure
4. **Maintainable**: Single source of truth for content
5. **Scalable**: Easy to add new sections or features
6. **Type-Safe**: Full TypeScript support

## File Structure

```
src/
├── components/
│   ├── landing/
│   │   ├── LandingPage.tsx (Main component)
│   │   └── AnimatedSVGs.tsx (SVG animations)
│   └── navbar/
│       └── Navbar.tsx (Reusable navbar)
├── utilities/
│   ├── json/
│   │   └── landingConfig.json (Configuration)
│   └── commonFunctions/
│       └── landingConfig.ts (TypeScript interfaces)
```

## Next Steps

1. Modify `landingConfig.json` to customize your landing page
2. Add new features by extending the `features.items` array
3. Customize styling by modifying className properties
4. Add new sections by extending the configuration structure
