# Component Library

Modern React components extracted from App.js following best practices and modern patterns.

## Architecture

All components follow these modern patterns:
- **React.memo**: Every component is wrapped with `React.memo()` for performance optimization
- **PropTypes Documentation**: Clear JSDoc comments document all props
- **Single Responsibility**: Each component has one clear purpose
- **Composability**: Components are designed to be reusable and composable

## Component Categories

### Display Components (`/displays`)
Pure presentational components that display data:
- **BACDisplay**: Shows Blood Alcohol Content with color-coded status
- **RobotMessageDisplay**: Animated temporary messages from the robot
- **TimeInfoBox**: Displays elapsed time and estimated time until sober

### Form Components (`/forms`)
Interactive input and button components:
- **DrinkButtonGrid**: Grid of buttons for adding standard drink types

### Layout Components (`/layout`)
Structural components for app layout:
- **HeaderBar**: App header with branding and settings button

### Modal Components (`/modals`)
Overlay dialogs and modals:
- **SettingsModal**: Settings panel with user profile and app controls

## Usage Example

```javascript
import {
  BACDisplay,
  DrinkButtonGrid,
  HeaderBar,
  SettingsModal,
  RobotMessageDisplay,
  TimeInfoBox
} from './components';

function App() {
  const [bac, setBac] = useState(0);
  const status = getBACStatus(bac);

  return (
    <>
      <HeaderBar onSettingsClick={() => setShowSettings(true)} />

      <BACDisplay bac={bac} status={status} />

      <RobotMessageDisplay
        message="*beep boop* Welcome!"
        isVisible={true}
      />

      <TimeInfoBox
        elapsedTime="2h 15m"
        soberTime="3:45 PM"
        showWhen={drinks.length > 0}
      />

      <DrinkButtonGrid
        onAddBeer={() => addDrink('beer', 12, 5)}
        onAddWine={() => addDrink('wine', 5, 12)}
        onAddShot={() => addDrink('shot', 1.5, 40)}
        onShowCustom={() => setShowCustom(true)}
      />

      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        userProfile={{ gender: 'male', weight: '180' }}
        onReset={handleReset}
        onShowRefundPolicy={() => setShowRefund(true)}
        appVersion="1.0.0"
      />
    </>
  );
}
```

## Performance Optimizations

All components use `React.memo()` which prevents unnecessary re-renders when:
- Parent component re-renders but props haven't changed
- Sibling components update
- Context changes that don't affect the component

### When React.memo Helps

1. **Frequently Updating Components**: BACDisplay and TimeInfoBox update every second, but memo prevents re-renders when parent updates for other reasons

2. **Large Component Trees**: Prevents cascade re-renders down the component tree

3. **Expensive Renders**: Components with complex JSX benefit from skipped renders

### Custom Comparison Functions

For components with complex props, consider adding custom comparison:

```javascript
const MyComponent = React.memo(
  ({ data }) => { /* render */ },
  (prevProps, nextProps) => {
    // Return true if props are equal (skip render)
    return prevProps.data.id === nextProps.data.id;
  }
);
```

## Component Design Principles

1. **Props Over State**: Components receive data via props, manage minimal internal state
2. **Callback Props**: Use callback props for actions (e.g., `onClose`, `onAddBeer`)
3. **Conditional Rendering**: Components handle their own visibility logic when appropriate
4. **Accessibility**: Include ARIA labels and semantic HTML
5. **TypeScript Ready**: JSDoc comments enable TypeScript inference

## Next Steps

Additional components that could be extracted:
- **TabNavigation**: Tab switching between Tracker and Calculator
- **DrinkHistoryList**: List of recorded drinks
- **CustomDrinkForm**: Form for adding custom drinks
- **CalculatorForm**: BAC calculator interface
- **JokeDisplay**: Displays random jokes
- **ConfirmationModal**: Generic confirmation dialog
- **ReceiptModal**: Payment receipt display
- **RefundPolicyModal**: Refund policy information

## Utilities

The `/utils` directory contains shared utilities:
- **bacStatus.js**: BAC status calculation and messaging

## Testing

Each component should have corresponding tests:

```javascript
import { render, screen } from '@testing-library/react';
import BACDisplay from './BACDisplay';

test('displays BAC percentage', () => {
  const status = {
    label: 'Sober',
    bgColor: 'bg-green-500',
    message: 'You are sober'
  };

  render(<BACDisplay bac={0.000} status={status} />);
  expect(screen.getByText('0.000%')).toBeInTheDocument();
});
```
