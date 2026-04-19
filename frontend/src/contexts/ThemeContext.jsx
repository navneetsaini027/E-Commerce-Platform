import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const themes = {
  light: {
    name: 'light',
    colors: {
      primary: '#000',
      secondary: '#E50010',
      background: '#fff',
      surface: '#fff',
      text: '#000',
      textSecondary: '#767676',
      border: '#e0e0e0',
      shadow: 'rgba(0,0,0,0.1)',
      overlay: 'rgba(0,0,0,0.5)',
      success: '#4CAF50',
      warning: '#FF9800',
      error: '#F44336',
      info: '#2196F3',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #E50010, #FF4444)',
      hero: 'linear-gradient(135deg, #f5f5f5, #e0e0e0)',
    }
  },
  dark: {
    name: 'dark',
    colors: {
      primary: '#fff',
      secondary: '#FF6B6B',
      background: 'linear-gradient(180deg, #0a0e27 0%, #16213e 50%, #0f1729 100%)',
      surface: 'rgba(30, 41, 59, 0.8)',
      text: '#fff',
      textSecondary: '#94a3b8',
      border: 'rgba(148, 163, 184, 0.2)',
      shadow: 'rgba(0,0,0,0.5)',
      overlay: 'rgba(0,0,0,0.7)',
      success: '#66BB6A',
      warning: '#FFA726',
      error: '#EF5350',
      info: '#42A5F5',
    },
    gradients: {
      primary: 'linear-gradient(135deg, #FF6B6B, #FF8E8E)',
      hero: 'linear-gradient(135deg, #1e293b, #0f172a)',
    }
  }
};

export const ThemeProvider = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState('light');

  useEffect(() => {
    // Load theme from localStorage
    const savedTheme = localStorage.getItem('aashirwad_theme');
    if (savedTheme && themes[savedTheme]) {
      setCurrentTheme(savedTheme);
    } else {
      // Default to light mode
      setCurrentTheme('light');
    }
  }, []);

  useEffect(() => {
    // Save theme to localStorage
    localStorage.setItem('aashirwad_theme', currentTheme);
    
    // Update body data-theme attribute
    document.body.setAttribute('data-theme', currentTheme);
    
    // Update CSS custom properties
    const theme = themes[currentTheme];
    const root = document.documentElement;
    
    Object.entries(theme.colors).forEach(([key, value]) => {
      root.style.setProperty(`--color-${key}`, value);
    });
    
    Object.entries(theme.gradients).forEach(([key, value]) => {
      root.style.setProperty(`--gradient-${key}`, value);
    });
    
    // Update meta theme-color for mobile browsers
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      metaThemeColor.setAttribute('content', currentTheme === 'dark' ? '#0a0e27' : theme.colors.background);
    }
  }, [currentTheme]);

  const toggleTheme = () => {
    setCurrentTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const setTheme = (themeName) => {
    if (themes[themeName]) {
      setCurrentTheme(themeName);
    }
  };

  const theme = themes[currentTheme];

  return (
    <ThemeContext.Provider value={{
      theme,
      currentTheme,
      toggleTheme,
      setTheme,
      isDark: currentTheme === 'dark',
    }}>
      {children}
    </ThemeContext.Provider>
  );
};