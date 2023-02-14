import { createSlice, PayloadAction } from '@reduxjs/toolkit';


type PeopleState = {
};
export const initialState: PeopleState = {
};

const peopleSlice = createSlice({
  name: 'people',
  initialState,
  reducers: {
    // set: (state, action: PayloadAction<GroupMember[]>) => ({
    //   ...state,
    //   people: action.payload,
    // }),
    // update: (state, action: PayloadAction<MemberEdit[]>) => {
    //   const newState: PeopleState['edits'] = { ...state.edits };
    //   for (const person of action.payload) {
    //     newState[person.ccbId] = { ...newState[person.ccbId], ...person };
    //   }
    //   return {
    //     ...state,
    //     edits: newState,
    //   };
    // },
    // setEdits: (state, action: PayloadAction<Record<string, MemberEdit>>) => ({
    //   ...state,
    //   edits: action.payload,
    // }),
    // patchEdits: (state, action: PayloadAction<Delta>): PeopleState => ({
    //   ...state,
    //   customPeople: patcher.patch(patcher.clone(state), action.payload),
    // }),
    // reset: (state, action: PayloadAction<string[]>) => ({
    //   ...state,
    //   edits: Object.fromEntries(
    //     Object.entries(state.edits).filter(([id]) => !action.payload.includes(id)),
    //   ),
    // }),
    // setCustom: (state, action: PayloadAction<GroupMember[]>) => ({
    //   ...state,
    //   customPeople: ensureUniqueCustomPeople(action.payload),
    // }),
    // patchCustom: (state, action: PayloadAction<Delta>): PeopleState => ({
    //   ...state,
    //   customPeople: patcher.patch(patcher.clone(state), action.payload),
    // }),
    // updateCustom: (state, action: PayloadAction<GroupMember[]>) => {
    //   const newState = [...state.customPeople];
    //   for (const person of action.payload) {
    //     const index = newState.findIndex(p => p.responseId === person.responseId);
    //     if (index > -1) {
    //       newState[index] = { ...newState[index], ...person };
    //     } else {
    //       newState.push(person);
    //     }
    //   }
    //   return {
    //     ...state,
    //     customPeople: newState,
    //   };
    // },
    // removeCustom: (state, action: PayloadAction<string[]>) => ({
    //   ...state,
    //   customPeople: state.customPeople.filter(p => !action.payload.includes(p.responseId)),
    // }),
    // updateCarpls: (state, action: PayloadAction<Record<string, string>>) => ({
    //   ...state,
    //   carpls: { ...state.carpls, ...action.payload },
    // }),
  },
});

export const {
} = peopleSlice.actions;

export default peopleSlice.reducer;
