import { StateProvider as BuilderStateProvider } from '@builder.io/react';

export interface StateProviderProps {
  state?: object;
  context?: object;
  children: React.ReactNode;
}

export const StateProvider =
  BuilderStateProvider as React.FC<StateProviderProps>;