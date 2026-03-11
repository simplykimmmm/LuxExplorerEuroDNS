import { Toaster } from 'react-hot-toast';
import { useTheme } from '../hooks/useTheme';

export function ToastProvider() {
  const { theme } = useTheme();

  return (
    <Toaster
      position="bottom-right"
      toastOptions={{
        style: {
          background: theme === 'dark' ? '#18181b' : '#ffffff',
          color: theme === 'dark' ? '#ffffff' : '#18181b',
          border: '1px solid',
          borderColor: theme === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)',
        },
      }}
    />
  );
}
