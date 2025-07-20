import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { Toast as NatiUIToast, ToastProps, ToastType } from '../components/natiui';

interface ShowToastParams {
  message: string;
  type?: ToastType;
  duration?: number;
  action?: { label: string; onPress: () => void };
  position?: 'top' | 'bottom';
}

interface ToastContextType {
  showToast: (params: ShowToastParams) => void;
  hideToast: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: ReactNode;
}

let toastRef: ToastContextType | null = null;

export const Toast = {
  show: (params: ShowToastParams | string) => {
    if (!toastRef) {
      console.warn('Toast: ToastProvider not initialized yet');
      return;
    }
    
    if (typeof params === 'string') {
      toastRef.showToast({ message: params });
    } else {
      toastRef.showToast(params);
    }
  },
  hide: () => {
    if (!toastRef) {
      console.warn('Toast: ToastProvider not initialized yet');
      return;
    }
    toastRef.hideToast();
  }
};

export const ToastProvider: React.FC<ToastProviderProps> = ({ children }) => {
  const [toastVisible, setToastVisible] = useState(false);
  const [toastProps, setToastProps] = useState<Omit<ToastProps, 'visible' | 'onClose'>>({
    message: '',
    type: 'info',
    duration: 3000,
    position: 'bottom',
  });

  const showToast = (params: ShowToastParams) => {
    const { message, type = 'info', duration = 3000, action, position = 'bottom' } = params;
    
    setToastProps({
      message,
      type,
      duration,
      action,
      position,
    });
    setToastVisible(true);
  };

  const hideToast = () => {
    setToastVisible(false);
  };

  useEffect(() => {
    toastRef = { showToast, hideToast };
    return () => {
      toastRef = null;
    };
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, hideToast }}>
      {children}
      <NatiUIToast
        {...toastProps}
        visible={toastVisible}
        onClose={hideToast}
      />
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
