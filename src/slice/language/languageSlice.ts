import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { setApiLanguage } from '@services/tmdbApi';

interface LanguageState {
  currentLanguage: 'en' | 'es';
}

const getInitialLanguage = (): 'en' | 'es' => {
  const saved = localStorage.getItem('language');
  if (saved === 'en' || saved === 'es') {
    return saved;
  }
  return 'en';
};

const initialState: LanguageState = {
  currentLanguage: getInitialLanguage(),
};

const languageSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {
    setLanguage: (state, action: PayloadAction<'en' | 'es'>) => {
      const newLang = action.payload;
      state.currentLanguage = newLang;
      localStorage.setItem('language', newLang);
      setApiLanguage(newLang);
    },
  },
});

export const { setLanguage } = languageSlice.actions;
export default languageSlice.reducer;
