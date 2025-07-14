/**
 * Composant Button réutilisable avec variants
 * 
 * Basé sur shadcn/ui avec améliorations personnalisées :
 * - Variants multiples (default, destructive, outline, etc.)
 * - Tailles configurables
 * - États de chargement intégrés
 * - Animations et effets visuels
 * - Support complet TypeScript
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// =============================================================================
// VARIANTS DU BOUTON
// =============================================================================

const buttonVariants = cva(
  // Classes de base communes à tous les boutons
  'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        // Bouton principal avec gradient
        default:
          'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md hover:shadow-lg hover:scale-105 active:scale-95',
        
        // Bouton destructif pour actions dangereuses
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-md hover:shadow-lg',
        
        // Bouton avec contour
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground shadow-sm hover:shadow-md',
        
        // Bouton secondaire
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-sm hover:shadow-md',
        
        // Bouton fantôme (transparent)
        ghost: 
          'hover:bg-accent hover:text-accent-foreground',
        
        // Bouton lien
        link: 
          'text-primary underline-offset-4 hover:underline',
        
        // Bouton avec effet de glow (pour actions importantes)
        glow:
          'bg-gradient-to-r from-primary to-accent text-primary-foreground shadow-lg hover:shadow-glow hover:scale-105 active:scale-95 relative overflow-hidden',
        
        // Bouton de succès
        success:
          'bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg hover:scale-105 active:scale-95',
        
        // Bouton d'avertissement
        warning:
          'bg-yellow-600 text-white hover:bg-yellow-700 shadow-md hover:shadow-lg',
        
        // Bouton d'information
        info:
          'bg-blue-600 text-white hover:bg-blue-700 shadow-md hover:shadow-lg',
      },
      size: {
        // Taille par défaut
        default: 'h-10 px-4 py-2',
        
        // Petite taille
        sm: 'h-9 rounded-md px-3',
        
        // Grande taille
        lg: 'h-11 rounded-md px-8',
        
        // Bouton icône
        icon: 'h-10 w-10',
        
        // Très petite taille
        xs: 'h-8 rounded px-2 text-xs',
        
        // Très grande taille
        xl: 'h-12 rounded-lg px-10 text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

// =============================================================================
// INTERFACE DU COMPOSANT
// =============================================================================

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  /** Utiliser Slot pour composition avancée */
  asChild?: boolean;
  /** État de chargement */
  loading?: boolean;
  /** Icône à gauche du texte */
  leftIcon?: React.ReactNode;
  /** Icône à droite du texte */
  rightIcon?: React.ReactNode;
  /** Texte de chargement personnalisé */
  loadingText?: string;
}

// =============================================================================
// COMPOSANT BUTTON
// =============================================================================

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant,
      size,
      asChild = false,
      loading = false,
      leftIcon,
      rightIcon,
      loadingText,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    
    // Désactiver le bouton pendant le chargement
    const isDisabled = disabled || loading;
    
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={isDisabled}
        {...props}
      >
        {/* Effet de glow pour le variant glow */}
        {variant === 'glow' && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
        )}
        
        {/* Contenu du bouton */}
        <div className="flex items-center justify-center gap-2">
          {/* Icône de gauche ou spinner de chargement */}
          {loading ? (
            <svg
              className="animate-spin h-4 w-4"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
          ) : (
            leftIcon && <span className="flex-shrink-0">{leftIcon}</span>
          )}
          
          {/* Texte du bouton */}
          {loading && loadingText ? (
            <span>{loadingText}</span>
          ) : (
            <span>{children}</span>
          )}
          
          {/* Icône de droite */}
          {!loading && rightIcon && (
            <span className="flex-shrink-0">{rightIcon}</span>
          )}
        </div>
      </Comp>
    );
  }
);

Button.displayName = 'Button';

// =============================================================================
// COMPOSANTS SPÉCIALISÉS
// =============================================================================

/**
 * Bouton avec icône uniquement
 */
export const IconButton = React.forwardRef<
  HTMLButtonElement,
  Omit<ButtonProps, 'leftIcon' | 'rightIcon'> & { icon: React.ReactNode }
>(({ icon, className, ...props }, ref) => (
  <Button
    ref={ref}
    size="icon"
    className={cn('flex-shrink-0', className)}
    {...props}
  >
    {icon}
  </Button>
));

IconButton.displayName = 'IconButton';

/**
 * Bouton de chargement avec état persistant
 */
export const LoadingButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & { isLoading: boolean }
>(({ isLoading, children, ...props }, ref) => (
  <Button ref={ref} loading={isLoading} {...props}>
    {children}
  </Button>
));

LoadingButton.displayName = 'LoadingButton';

/**
 * Bouton avec confirmation
 */
export const ConfirmButton = React.forwardRef<
  HTMLButtonElement,
  ButtonProps & {
    confirmText?: string;
    onConfirm?: () => void;
    requireDoubleClick?: boolean;
  }
>(
  (
    {
      confirmText = 'Êtes-vous sûr ?',
      onConfirm,
      requireDoubleClick = false,
      children,
      onClick,
      ...props
    },
    ref
  ) => {
    const [isConfirming, setIsConfirming] = React.useState(false);
    const [clickCount, setClickCount] = React.useState(0);
    
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      if (requireDoubleClick) {
        setClickCount(prev => prev + 1);
        
        if (clickCount === 0) {
          setTimeout(() => setClickCount(0), 2000); // Reset après 2 secondes
          return;
        }
        
        if (clickCount === 1) {
          onConfirm?.();
          onClick?.(e);
          setClickCount(0);
        }
      } else {
        if (!isConfirming) {
          setIsConfirming(true);
          setTimeout(() => setIsConfirming(false), 3000); // Reset après 3 secondes
          return;
        }
        
        onConfirm?.();
        onClick?.(e);
        setIsConfirming(false);
      }
    };
    
    return (
      <Button
        ref={ref}
        onClick={handleClick}
        variant={isConfirming || clickCount > 0 ? 'destructive' : 'default'}
        {...props}
      >
        {isConfirming
          ? confirmText
          : requireDoubleClick && clickCount > 0
          ? 'Cliquez encore pour confirmer'
          : children}
      </Button>
    );
  }
);

ConfirmButton.displayName = 'ConfirmButton';

// =============================================================================
// EXPORTS
// =============================================================================

export { Button, buttonVariants };

