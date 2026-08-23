import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
    },
  },
  // Die beiden Kontext-Dateien geben neben der Komponente auch den
  // passenden Haken heraus (useAuth, useSprache). ESLint mahnt das an,
  // weil dann das Nachladen im Entwicklungsmodus nicht mehr ohne
  // Neuladen der Seite geht. Beides zu trennen hiesse zwei zusaetzliche
  // Dateien fuer je zwei Zeilen Inhalt - dafuer ist der Nachteil zu
  // klein. Die Regel gilt darum nur hier nicht.
  {
    files: ['src/context/*.tsx'],
    rules: { 'react-refresh/only-export-components': 'off' },
  },
])
