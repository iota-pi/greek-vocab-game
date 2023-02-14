import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type UiState = {
  username: string,
};
export const initialState: UiState = {
  username: '',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setUsername: (state, action: PayloadAction<string>) => ({
      ...state,
      username: action.payload,
    }),
  },
});

export const {
  setUsername,
} = uiSlice.actions;

export default uiSlice.reducer;
