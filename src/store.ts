import { configureStore } from '@reduxjs/toolkit';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers, type PreloadedState } from 'redux';
import ui from './state/ui';

const rootReducer = combineReducers({
  ui,
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
  return configureStore({
    middleware: getDefaultMiddleware => (
      getDefaultMiddleware({
        thunk: false,
        serializableCheck: false,
      })
    ),
    reducer: rootReducer,
    preloadedState,
  });
}

const store = setupStore();

export default store;

export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
