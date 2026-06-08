import { createContext, useContext } from 'react'

interface PageColorContextType {
  color: string
}

export const PageColorContext = createContext<PageColorContextType>({
  color: '#e63946'
})

export function usePageColor() {
  return useContext(PageColorContext)
}