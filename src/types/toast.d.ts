/**
 * Déclarations de types pour le hook useToast et les composants Toast
 * 
 * @author Manus AI
 * @version 1.0.0
 */

declare module '@/components/ui/use-toast' {
  export type ToastProps = {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: React.ReactNode;
    variant?: 'default' | 'destructive';
    duration?: number;
  };

  export type ToastActionElement = React.ReactElement<{
    altText: string;
    onClick: () => void;
  }>;

  export type Toast = {
    id: string;
    title?: React.ReactNode;
    description?: React.ReactNode;
    action?: ToastActionElement;
    variant?: 'default' | 'destructive';
    duration?: number;
  };

  export type ToasterToast = Required<Pick<Toast, 'id'>> & Partial<Toast>;

  export interface ToastContextValue {
    toasts: ToasterToast[];
    addToast: (toast: Omit<ToasterToast, 'id'>) => string;
    updateToast: (id: string, toast: Partial<ToasterToast>) => void;
    dismissToast: (id: string) => void;
  }

  export const useToast: () => {
    toast: (props: Omit<ToasterToast, 'id'>) => string;
    dismiss: (id: string) => void;
    toasts: ToasterToast[];
  };
}
