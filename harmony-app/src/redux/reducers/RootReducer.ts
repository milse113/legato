import { PaletteType, Color } from "@material-ui/core";
import { red, lightBlue } from "@material-ui/core/colors";
import { createAction, createReducer } from "@reduxjs/toolkit";

export interface IRootState {
  theme: {
    type: PaletteType;
    primary: Color;
    secondary: Color;
  };
}

const initialState: IRootState = {
  theme: {
    type: "dark",
    primary: red,
    secondary: lightBlue,
  },
};

export const setThemeType = createAction<PaletteType>("SET_THEME_TYPE");
export const setPrimary = createAction<Color>("SET_PRIMARY");
export const setSecondary = createAction<Color>("SET_SECONDARY");

export const rootReducer = createReducer(initialState, (builder) =>
  builder
    .addCase(setThemeType, (state, action) => ({
      ...state,
      theme: {
        ...state.theme,
        type: action.payload,
      },
    }))
    .addCase(setPrimary, (state, action) => ({
      ...state,
      theme: {
        ...state.theme,
        primary: action.payload,
      },
    }))
    .addCase(setSecondary, (state, action) => ({
      ...state,
      theme: {
        ...state.theme,
        secondary: action.payload,
      },
    }))
);
