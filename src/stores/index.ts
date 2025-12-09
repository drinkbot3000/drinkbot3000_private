/**
 * Stores Index
 * Exports all store contexts and hooks
 */

export { UserProvider, useUser } from './UserStore';
export type { UserState } from './UserStore';

export { BACProvider, useBAC } from './BACStore';
export type { BACState, DrinkRecord } from './BACStore';

export { UIProvider, useUI } from './UIStore';
export type { UIState, TabType } from './UIStore';

export { ModalProvider, useModal } from './ModalStore';
export type { ModalState } from './ModalStore';

export { CustomDrinksProvider, useCustomDrinks } from './CustomDrinksStore';
export type { CustomDrinksState, SavedCustomDrink } from './CustomDrinksStore';

export { ReceiptsProvider, useReceipts } from './ReceiptsStore';
export type { ReceiptsState } from './ReceiptsStore';
