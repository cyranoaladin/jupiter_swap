/**
 * Composant Input réutilisable avec validation
 * 
 * Composant d'entrée avancé avec :
 * - Validation en temps réel
 * - Formatage automatique pour les montants
 * - États visuels (erreur, succès, chargement)
 * - Support des icônes et suffixes
 * - Accessibilité complète
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// =============================================================================
// VARIANTS DE L'INPUT
// =============================================================================

const inputVariants = cva(
  // Classes de base communes à tous les inputs
  'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200',
  {
    variants: {
      variant: {
        // Input par défaut
        default: 'border-input focus-visible:ring-ring',
        
        // Input avec erreur
        error: 'border-destructive focus-visible:ring-destructive',
        
        // Input avec succès
        success: 'border-green-500 focus-visible:ring-green-500',
        
        // Input avec avertissement
        warning: 'border-yellow-500 focus-visible:ring-yellow-500',
        
        // Input fantôme
        ghost: 'border-transparent bg-muted hover:bg-accent focus-visible:bg-background',
      },
      inputSize: {
        // Taille par défaut
        default: 'h-10 px-3 py-2',
        
        // Petite taille
        sm: 'h-9 px-3 text-sm',
        
        // Grande taille
        lg: 'h-11 px-4 text-base',
        
        // Très grande taille
        xl: 'h-12 px-5 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      inputSize: 'default',
    },
  }
);

// =============================================================================
// INTERFACES
// =============================================================================

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size' | 'prefix'>,
    VariantProps<typeof inputVariants> {
  /** Icône à gauche de l'input */
  leftIcon?: React.ReactNode;
  /** Icône à droite de l'input */
  rightIcon?: React.ReactNode;
  /** Texte ou élément à afficher à droite */
  suffix?: React.ReactNode;
  /** Texte ou élément à afficher à gauche */
  prefix?: React.ReactNode;
  /** Message d'erreur à afficher */
  error?: string;
  /** Message de succès à afficher */
  success?: string;
  /** Texte d'aide à afficher */
  helperText?: string;
  /** Label de l'input */
  label?: string;
  /** Indique si le champ est requis */
  required?: boolean;
  /** État de chargement */
  loading?: boolean;
  /** Fonction de validation personnalisée */
  validate?: (value: string) => string | undefined;
  /** Formatage automatique pour les montants */
  formatAsAmount?: boolean;
  /** Nombre de décimales pour le formatage */
  decimals?: number;
}

// =============================================================================
// COMPOSANT INPUT PRINCIPAL
// =============================================================================

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      variant,
      inputSize,
      type = 'text',
      leftIcon,
      rightIcon,
      suffix,
      prefix,
      error,
      success,
      helperText,
      label,
      required,
      loading,
      validate,
      formatAsAmount,
      decimals = 6,
      onChange,
      onBlur,
      value,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(value || '');
    const [validationError, setValidationError] = React.useState<string>();
    // Préfixe _ pour indiquer que la variable est intentionnellement non utilisée
    const [_isFocused, setIsFocused] = React.useState(false);

    // Déterminer le variant basé sur l'état
    const currentVariant = error || validationError 
      ? 'error' 
      : success 
      ? 'success' 
      : variant;

    // Formatage des montants
    const formatAmount = React.useCallback((val: string) => {
      if (!formatAsAmount) return val;
      
      // Supprimer tous les caractères non numériques sauf le point
      let cleaned = val.replace(/[^0-9.]/g, '');
      
      // S'assurer qu'il n'y a qu'un seul point décimal
      const parts = cleaned.split('.');
      if (parts.length > 2) {
        cleaned = parts[0] + '.' + parts.slice(1).join('');
      }
      
      // Limiter les décimales
      if (parts[1] && parts[1].length > decimals) {
        cleaned = parts[0] + '.' + parts[1].substring(0, decimals);
      }
      
      return cleaned;
    }, [formatAsAmount, decimals]);

    // Gestion du changement de valeur
    const handleChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = e.target.value;
      
      if (formatAsAmount) {
        newValue = formatAmount(newValue);
      }
      
      setInternalValue(newValue);
      
      // Validation en temps réel
      if (validate) {
        const error = validate(newValue);
        setValidationError(error);
      }
      
      // Appeler le onChange parent avec la valeur formatée
      if (onChange) {
        const syntheticEvent = {
          ...e,
          target: { ...e.target, value: newValue },
        };
        onChange(syntheticEvent);
      }
    }, [formatAsAmount, formatAmount, validate, onChange]);

    // Gestion du blur
    const handleBlur = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false); // Met à jour l'état mais la valeur n'est pas utilisée dans le rendu
      
      if (validate) {
        const error = validate(e.target.value);
        setValidationError(error);
      }
      
      onBlur?.(e);
    }, [validate, onBlur]);

    // Gestion du focus
    const handleFocus = React.useCallback((e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true); // Met à jour l'état mais la valeur n'est pas utilisée dans le rendu
      props.onFocus?.(e);
    }, [props]);

    // Synchroniser la valeur interne avec la prop value
    React.useEffect(() => {
      if (value !== undefined && value !== internalValue) {
        setInternalValue(String(value));
      }
    }, [value, internalValue]);

    const inputId = React.useId();
    const errorMessage = error || validationError;
    const hasError = Boolean(errorMessage);
    const hasSuccess = Boolean(success && !hasError);

    return (
      <div className="w-full space-y-2">
        {/* Label */}
        {label && (
          <label
            htmlFor={inputId}
            className={cn(
              'text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70',
              hasError && 'text-destructive',
              hasSuccess && 'text-green-600'
            )}
          >
            {label}
            {required && <span className="text-destructive ml-1">*</span>}
          </label>
        )}

        {/* Container de l'input */}
        <div className="relative">
          {/* Prefix */}
          {prefix && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {prefix}
            </div>
          )}

          {/* Icône gauche */}
          {leftIcon && (
            <div className={cn(
              'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground',
              prefix && 'left-8'
            )}>
              {leftIcon}
            </div>
          )}

          {/* Input principal */}
          <input
            id={inputId}
            type={type}
            className={cn(
              inputVariants({ variant: currentVariant, inputSize }),
              leftIcon && 'pl-10',
              prefix && 'pl-8',
              (leftIcon && prefix) && 'pl-16',
              (rightIcon || suffix || loading) && 'pr-10',
              className
            )}
            ref={ref}
            value={internalValue}
            onChange={handleChange}
            onBlur={handleBlur}
            onFocus={handleFocus}
            aria-invalid={hasError}
            aria-describedby={
              errorMessage ? `${inputId}-error` : 
              success ? `${inputId}-success` : 
              helperText ? `${inputId}-helper` : undefined
            }
            {...props}
          />

          {/* Indicateur de chargement */}
          {loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                className="animate-spin h-4 w-4 text-muted-foreground"
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
            </div>
          )}

          {/* Icône droite */}
          {rightIcon && !loading && (
            <div className={cn(
              'absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground',
              suffix && 'right-8'
            )}>
              {rightIcon}
            </div>
          )}

          {/* Suffix */}
          {suffix && !loading && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              {suffix}
            </div>
          )}
        </div>

        {/* Messages d'aide et d'erreur */}
        {(errorMessage || success || helperText) && (
          <div className="space-y-1">
            {errorMessage && (
              <p
                id={`${inputId}-error`}
                className="text-sm text-destructive flex items-center gap-1"
              >
                <svg
                  className="h-4 w-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                {errorMessage}
              </p>
            )}
            
            {success && !errorMessage && (
              <p
                id={`${inputId}-success`}
                className="text-sm text-green-600 flex items-center gap-1"
              >
                <svg
                  className="h-4 w-4 flex-shrink-0"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                {success}
              </p>
            )}
            
            {helperText && !errorMessage && !success && (
              <p
                id={`${inputId}-helper`}
                className="text-sm text-muted-foreground"
              >
                {helperText}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

// =============================================================================
// COMPOSANTS SPÉCIALISÉS
// =============================================================================

/**
 * Input pour les montants avec formatage automatique
 */
export const AmountInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'formatAsAmount'>>(
  (props, ref) => (
    <Input
      ref={ref}
      formatAsAmount
      type="text"
      inputMode="decimal"
      {...props}
    />
  )
);

AmountInput.displayName = 'AmountInput';

/**
 * Input de recherche avec icône
 */
export const SearchInput = React.forwardRef<HTMLInputElement, Omit<InputProps, 'leftIcon' | 'type'>>(
  (props, ref) => (
    <Input
      ref={ref}
      type="search"
      leftIcon={
        <svg
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
      }
      placeholder="Rechercher..."
      {...props}
    />
  )
);

SearchInput.displayName = 'SearchInput';

// =============================================================================
// EXPORTS
// =============================================================================

export { Input, inputVariants };
// InputProps est déjà exporté directement avec le mot-clé export

