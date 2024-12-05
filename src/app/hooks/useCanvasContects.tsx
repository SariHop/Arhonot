"use client"

// הקונטקסט יכיל את המערך של הבגדים והקנבס

import { createContext, useContext } from 'react';
import * as fabric from 'fabric';
// import { CanvasStateElemnt } from '@/app/pages/user/create_outfit/page';

// createContext
export const CanvasStateElemnt = createContext<fabric.Canvas | null>(null)


// useContext handel ts error when null
export const useRecipeContecst = (): fabric.Canvas => {
  // debugger
  const context = useContext(CanvasStateElemnt);
  if (!context) {
    throw new Error(" Must be used within a Canvas");
    
  }
  return context;
};
