import React, { useEffect } from 'react';

type ThemeProviderProps = {
  theme: 'day' | 'night';
  children: React.ReactNode;
};

const ThemeProvider: React.FC<ThemeProviderProps> = ({ theme, children }) => {
  useEffect(() => {
    // Dynamically import the theme CSS file
    import(`../themes/${theme}.css`);

    // Add the theme name as a class to the html element
    document.documentElement.classList.add(`theme-${theme}`);

    // Clean up the class when the component unmounts or the theme changes
    return () => {
      document.documentElement.classList.remove(`theme-${theme}`);
    };
  }, [theme]);

  return <>{children}</>;
};

export default ThemeProvider;
