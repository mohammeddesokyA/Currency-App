
export function getInitialTheme() {
  if (typeof window !== 'undefined' && 'localStorage' in window) {
    const storedTheme = window.localStorage.getItem('theme');
    if (storedTheme === 'dark' || storedTheme === 'light') {
      return storedTheme;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    if (mediaQuery.matches) {
      return 'dark';
    }
  }
  
  return 'light'; 
}


export function applyTheme(theme) {
  if (typeof window === 'undefined' || !('document' in window)) return;

  const root = window.document.documentElement;
  
  if (theme === 'dark') {
    root.classList.add('dark');
    window.localStorage.setItem('theme', 'dark');
  } else {
    root.classList.remove('dark');
    window.localStorage.setItem('theme', 'light');
  }
}