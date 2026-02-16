import React, { createContext, useContext, useState, ReactNode } from 'react';
import { WorkflowTheme } from '../types';

interface ThemeContextValue {
  theme: WorkflowTheme;
  setTheme: (theme: WorkflowTheme) => void;
  updateTheme: (updates: Partial<WorkflowTheme>) => void;
}

const defaultTheme: WorkflowTheme = {
  nodeBackground: '#ffffff',
  nodeBorder: '#e5e7eb',
  nodeColor: '#1f2937',
  nodeShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
  handleBackground: '#0ea5e9',
  handleBorder: '#0284c7',
  primaryColor: '#0ea5e9',
  secondaryColor: '#6366f1'
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: ReactNode; initialTheme?: WorkflowTheme }> = ({
  children,
  initialTheme
}) => {
  const [theme, setTheme] = useState<WorkflowTheme>({
    ...defaultTheme,
    ...initialTheme
  });

  const updateTheme = (updates: Partial<WorkflowTheme>) => {
    setTheme(prev => ({ ...prev, ...updates }));
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
