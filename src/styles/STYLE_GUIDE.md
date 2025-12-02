# DrinkBot3000 Style Guide

This document outlines the styling conventions and best practices for the DrinkBot3000 application.

## Overview

We use **Tailwind CSS** as our styling framework with centralized design tokens for consistency.

## Design Tokens

Import design tokens from `./designTokens.js`:

```javascript
import { COLORS, SPACING, SHADOWS, RADIUS, TYPOGRAPHY, COMPONENT_STYLES } from './styles/designTokens';
```

## Brand Colors

### Primary Color: Indigo
Use indigo as the primary brand color throughout the application.

```javascript
// ✅ Correct
<button className={COLORS.primary.bg}>Click me</button>

// ❌ Avoid
<button className="bg-blue-600">Click me</button>
<button className="bg-purple-600">Click me</button>
```

### Color Palette

- **Primary**: Indigo (indigo-600, indigo-700)
- **Secondary**: Purple (purple-600, purple-700) - Use for gender selection (female)
- **Success**: Green
- **Danger**: Red
- **Warning**: Amber

### Gender-Specific Colors

```javascript
// Male button
className="bg-indigo-600 hover:bg-indigo-700"

// Female button
className="bg-purple-600 hover:bg-purple-700"
```

## Component Usage

### Buttons

**Always use the `Button` component** instead of inline-styled buttons.

```javascript
import { Button } from './components/common';

// ✅ Correct
<Button variant="primary" onClick={handleClick}>
  Save
</Button>

<Button variant="outline" fullWidth>
  Cancel
</Button>

// ❌ Avoid
<button className="bg-indigo-600 text-white py-3 px-6 rounded-lg">
  Save
</button>
```

#### Button Variants

- `primary` - Main actions (indigo background)
- `secondary` - Secondary actions (gray background)
- `success` - Positive actions (green background)
- `danger` - Destructive actions (red background)
- `warning` - Warning actions (yellow background)
- `outline` - Outlined button (indigo border)

#### Button Sizes

- `sm` - Small buttons
- `md` - Default size
- `lg` - Large buttons
- `xl` - Extra large buttons

#### Button as Links

Use the `as` prop to render buttons as anchor tags:

```javascript
<Button
  as="a"
  href="/privacy.html"
  target="_blank"
  variant="outline"
>
  Privacy Policy
</Button>
```

## Spacing

### Card Padding

```javascript
// Standard card
className={SPACING.card.padding} // p-6

// Large/prominent card
className={SPACING.card.paddingLarge} // p-8
```

### Gaps

```javascript
// Small gap (0.5rem)
className={SPACING.gap.small} // gap-2

// Medium gap (1rem)
className={SPACING.gap.medium} // gap-4

// Large gap (1.5rem)
className={SPACING.gap.large} // gap-6
```

## Shadows

Use consistent shadow levels:

```javascript
// Standard card shadow
className={SHADOWS.card} // shadow-md

// Large card shadow
className={SHADOWS.cardLarge} // shadow-lg

// Modal shadow
className={SHADOWS.modal} // shadow-xl
```

## Border Radius

```javascript
// Small (buttons, inputs)
className={RADIUS.small} // rounded

// Medium (most cards)
className={RADIUS.medium} // rounded-lg

// Large (modals, prominent cards)
className={RADIUS.large} // rounded-xl

// Extra large (full-screen overlays)
className={RADIUS.extraLarge} // rounded-2xl
```

## Typography

### Headings

```javascript
className={TYPOGRAPHY.heading.h1} // text-3xl font-bold
className={TYPOGRAPHY.heading.h2} // text-2xl font-bold
className={TYPOGRAPHY.heading.h3} // text-xl font-semibold
className={TYPOGRAPHY.heading.h4} // text-lg font-semibold
```

### Body Text

```javascript
className={TYPOGRAPHY.body.large} // text-lg
className={TYPOGRAPHY.body.base} // text-base
className={TYPOGRAPHY.body.small} // text-sm
className={TYPOGRAPHY.body.tiny} // text-xs
```

## Common Patterns

### Card Styles

```javascript
// Standard card
<div className={COMPONENT_STYLES.card.base}>
  {/* Card content */}
</div>

// Prominent card
<div className={COMPONENT_STYLES.card.prominent}>
  {/* Card content */}
</div>

// Interactive card (with hover effect)
<div className={COMPONENT_STYLES.card.interactive}>
  {/* Card content */}
</div>
```

### Modal Structure

```javascript
<div className={COMPONENT_STYLES.modal.overlay}>
  <div className={COMPONENT_STYLES.modal.container}>
    {/* Modal content */}
  </div>
</div>
```

### Input Fields

```javascript
// Standard input
<input className={COMPONENT_STYLES.input.base} />

// Error state
<input className={COMPONENT_STYLES.input.error} />
```

## Best Practices

### ✅ Do

1. **Import design tokens** at the top of your component
2. **Use the Button component** for all buttons
3. **Use consistent spacing** from SPACING constants
4. **Use indigo** as the primary brand color
5. **Use semantic color names** (primary, success, danger)
6. **Combine tokens** for complex styles:
   ```javascript
   className={`${COLORS.neutral.white} ${RADIUS.medium} ${SHADOWS.card} ${SPACING.card.padding}`}
   ```

### ❌ Don't

1. **Don't use inline Tailwind classes** for buttons when Button component exists
2. **Don't mix color names** (avoid using both blue and indigo)
3. **Don't use arbitrary spacing** values (use SPACING constants)
4. **Don't create one-off button styles** (extend Button component instead)
5. **Don't use inconsistent shadows** across similar components

## Migration Guide

### Converting Inline Buttons

Before:
```javascript
<button className="w-full bg-indigo-600 text-white py-4 rounded-lg hover:bg-indigo-700">
  Continue
</button>
```

After:
```javascript
<Button variant="primary" fullWidth size="lg">
  Continue
</Button>
```

### Converting Card Styles

Before:
```javascript
<div className="bg-white rounded-lg shadow-md p-6">
  {/* content */}
</div>
```

After:
```javascript
import { COMPONENT_STYLES } from './styles/designTokens';

<div className={COMPONENT_STYLES.card.base}>
  {/* content */}
</div>
```

## Error Boundaries

All major sections of the app are wrapped in error boundaries. If you create a new high-level component, consider wrapping it in an ErrorBoundary:

```javascript
import ErrorBoundary from './components/ErrorBoundary';

<ErrorBoundary>
  <YourComponent />
</ErrorBoundary>
```

## Tailwind Config

Custom brand colors are defined in `tailwind.config.js`:

- `brand.primary` - #4f46e5 (Indigo-600)
- `brand.primaryDark` - #4338ca (Indigo-700)
- `brand.secondary` - #9333ea (Purple-600)

Custom spacing:
- `card` - 1.5rem (24px)
- `card-lg` - 2rem (32px)

## Questions?

If you're unsure about styling decisions:
1. Check this style guide
2. Look at similar existing components
3. Use design tokens from `designTokens.js`
4. Default to the Button component for buttons
