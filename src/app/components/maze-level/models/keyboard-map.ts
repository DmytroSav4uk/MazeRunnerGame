export type Direction = 'Up' | 'Down' | 'Left' | 'Right';

export const keyboardMap: Record<string, Direction> = {
  ArrowLeft: 'Left',
  ArrowRight: 'Right',
  ArrowUp: 'Up',
  ArrowDown: 'Down'
};

export const actionMap: Record<string, 'Use' | 'Sprint' | 'Inventory'> = {
  F: 'Use',
  f: 'Use',
  А:'Use',
  а:'Use',
  Shift: 'Sprint',
  I:'Inventory',
  i:'Inventory',
  Ш:'Inventory',
  ш:'Inventory'
};
