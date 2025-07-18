import { createContext, type ActionDispatch } from 'react';

export type AppContextState = {
	collapse: boolean;
	active: string;
};

export const actionType = ['collapse', 'active'] as const;

export type AppContextValue = AppContextState & {
	dispath: ActionDispatch<[action: Action]>;
};

export type Action = {
	type: (typeof actionType)[number];
	payload: any;
};

export const AppContext = createContext<AppContextValue>({} as AppContextValue);
