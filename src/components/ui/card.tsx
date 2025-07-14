/**
 * Composant Card réutilisable avec variants
 * 
 * Composant de carte flexible avec :
 * - Variants multiples (default, elevated, glass, etc.)
 * - Animations et effets hover
 * - Support pour header, content, footer
 * - Responsive design intégré
 * 
 * @author Manus AI
 * @version 1.0.0
 */

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

// =============================================================================
// VARIANTS DE LA CARTE
// =============================================================================

const cardVariants = cva(
  // Classes de base communes à toutes les cartes
  'rounded-lg border bg-card text-card-foreground transition-all duration-200',
  {
    variants: {
      variant: {
        // Carte par défaut
        default: 'shadow-sm hover:shadow-md',
        
        // Carte élevée avec ombre prononcée
        elevated: 'shadow-lg hover:shadow-xl hover:-translate-y-1',
        
        // Carte avec effet de verre
        glass: 'glass border-white/20 shadow-lg backdrop-blur-md',
        
        // Carte avec bordure colorée
        bordered: 'border-2 border-primary/20 shadow-sm hover:border-primary/40 hover:shadow-md',
        
        // Carte interactive avec effet hover prononcé
        interactive: 'shadow-md hover:shadow-lg hover:scale-[1.02] cursor-pointer',
        
        // Carte avec gradient de fond
        gradient: 'bg-gradient-to-br from-card to-muted shadow-lg',
        
        // Carte plate sans ombre
        flat: 'border-0 bg-muted/50',
        
        // Carte avec glow effect
        glow: 'shadow-glow border-primary/30',
      },
      padding: {
        // Pas de padding
        none: 'p-0',
        
        // Padding petit
        sm: 'p-3',
        
        // Padding par défaut
        default: 'p-6',
        
        // Padding large
        lg: 'p-8',
        
        // Padding extra large
        xl: 'p-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'default',
    },
  }
);

// =============================================================================
// INTERFACES DES COMPOSANTS
// =============================================================================

export interface CardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof cardVariants> {
  /** Contenu à afficher dans le header */
  header?: React.ReactNode;
  /** Contenu à afficher dans le footer */
  footer?: React.ReactNode;
  /** Désactiver les effets hover */
  disableHover?: boolean;
  /** Ajouter un indicateur de chargement */
  loading?: boolean;
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Afficher un séparateur en bas */
  withSeparator?: boolean;
}

export interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Afficher un séparateur en haut */
  withSeparator?: boolean;
}

export interface CardTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  /** Niveau de titre (h1-h6) */
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export interface CardDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

// =============================================================================
// COMPOSANT CARD PRINCIPAL
// =============================================================================

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      className,
      variant,
      padding,
      header,
      footer,
      children,
      disableHover = false,
      loading = false,
      ...props
    },
    ref
  ) => {
    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, padding }),
          disableHover && 'hover:shadow-sm hover:translate-y-0 hover:scale-100',
          loading && 'pointer-events-none opacity-75',
          className
        )}
        {...props}
      >
        {/* Indicateur de chargement */}
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/50 rounded-lg z-10">
            <div className="flex items-center gap-2 text-muted-foreground">
              <svg
                className="animate-spin h-5 w-5"
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
              <span className="text-sm">Chargement...</span>
            </div>
          </div>
        )}
        
        {/* Header de la carte */}
        {header && (
          <CardHeader withSeparator={!!children || !!footer}>
            {header}
          </CardHeader>
        )}
        
        {/* Contenu principal */}
        {children && (
          <CardContent className={header ? 'pt-0' : undefined}>
            {children}
          </CardContent>
        )}
        
        {/* Footer de la carte */}
        {footer && (
          <CardFooter withSeparator={!!children || !!header}>
            {footer}
          </CardFooter>
        )}
      </div>
    );
  }
);

Card.displayName = 'Card';

// =============================================================================
// COMPOSANTS SOUS-ÉLÉMENTS
// =============================================================================

const CardHeader = React.forwardRef<HTMLDivElement, CardHeaderProps>(
  ({ className, withSeparator = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex flex-col space-y-1.5 p-6',
        withSeparator && 'border-b border-border pb-4',
        className
      )}
      {...props}
    />
  )
);

CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLHeadingElement, CardTitleProps>(
  ({ className, level = 3, children, ...props }, ref) => {
    // Utiliser un élément spécifique plutôt qu'une chaîne dynamique pour éviter les problèmes de type
    if (level === 1) {
      return (
        <h1
          ref={ref}
          className={cn('text-4xl font-semibold leading-none tracking-tight', className)}
          {...props}
        >
          {children}
        </h1>
      );
    } else if (level === 2) {
      return (
        <h2
          ref={ref}
          className={cn('text-3xl font-semibold leading-none tracking-tight', className)}
          {...props}
        >
          {children}
        </h2>
      );
    } else if (level === 4) {
      return (
        <h4
          ref={ref}
          className={cn('text-xl font-semibold leading-none tracking-tight', className)}
          {...props}
        >
          {children}
        </h4>
      );
    } else if (level === 5) {
      return (
        <h5
          ref={ref}
          className={cn('text-lg font-semibold leading-none tracking-tight', className)}
          {...props}
        >
          {children}
        </h5>
      );
    } else if (level === 6) {
      return (
        <h6
          ref={ref}
          className={cn('text-base font-semibold leading-none tracking-tight', className)}
          {...props}
        >
          {children}
        </h6>
      );
    }
    
    // Par défaut, utiliser h3
    return (
      <h3
        ref={ref}
        className={cn('text-2xl font-semibold leading-none tracking-tight', className)}
        {...props}
      >
        {children}
      </h3>
    );
  }
);

CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, CardDescriptionProps>(
  ({ className, ...props }, ref) => (
    <p
      ref={ref}
      className={cn('text-sm text-muted-foreground', className)}
      {...props}
    />
  )
);

CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, CardContentProps>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
  )
);

CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, CardFooterProps>(
  ({ className, withSeparator = false, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'flex items-center p-6 pt-0',
        withSeparator && 'border-t border-border pt-4',
        className
      )}
      {...props}
    />
  )
);

CardFooter.displayName = 'CardFooter';

// =============================================================================
// COMPOSANTS SPÉCIALISÉS
// =============================================================================

/**
 * Carte de statistique avec icône et valeur
 */
export const StatCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'children'> & {
    title: string;
    value: string | number;
    icon?: React.ReactNode;
    trend?: {
      value: number;
      isPositive: boolean;
    };
    description?: string;
  }
>(({ title, value, icon, trend, description, className, ...props }, ref) => (
  <Card
    ref={ref}
    variant="elevated"
    className={cn('relative overflow-hidden', className)}
    {...props}
  >
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
          {trend && (
            <div className="flex items-center gap-1 text-sm">
              <span
                className={cn(
                  'flex items-center gap-1',
                  trend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.isPositive ? '↗' : '↘'}
                {Math.abs(trend.value)}%
              </span>
              {description && (
                <span className="text-muted-foreground">{description}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary">
            {icon}
          </div>
        )}
      </div>
    </CardContent>
  </Card>
));

StatCard.displayName = 'StatCard';

/**
 * Carte de chargement avec skeleton
 */
export const SkeletonCard = React.forwardRef<
  HTMLDivElement,
  Omit<CardProps, 'children' | 'loading'> & {
    lines?: number;
    showHeader?: boolean;
    showFooter?: boolean;
  }
>(
  (
    { lines = 3, showHeader = true, showFooter = false, className, ...props },
    ref
  ) => (
    <Card ref={ref} className={cn('animate-pulse', className)} {...props}>
      {showHeader && (
        <CardHeader>
          <div className="h-6 w-1/3 bg-muted rounded" />
          <div className="h-4 w-2/3 bg-muted rounded" />
        </CardHeader>
      )}
      <CardContent>
        <div className="space-y-3">
          {Array.from({ length: lines }).map((_, i) => (
            <div
              key={i}
              className={cn(
                'h-4 bg-muted rounded',
                i === lines - 1 ? 'w-1/2' : 'w-full'
              )}
            />
          ))}
        </div>
      </CardContent>
      {showFooter && (
        <CardFooter>
          <div className="h-8 w-20 bg-muted rounded" />
        </CardFooter>
      )}
    </Card>
  )
);

SkeletonCard.displayName = 'SkeletonCard';

// =============================================================================
// EXPORTS
// =============================================================================

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
  cardVariants,
};

// Les interfaces sont déjà exportées directement avec le mot-clé export

