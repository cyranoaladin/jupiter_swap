/**
 * Composant Container pour la mise en page responsive
 * 
 * @author Manus AI
 */

import * as React from "react";
import { cn } from "@/lib/utils";

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Contenu du container
   */
  children: React.ReactNode;
  
  /**
   * Taille maximale du container
   * @default "max-w-7xl"
   */
  maxWidth?: "max-w-5xl" | "max-w-6xl" | "max-w-7xl" | "max-w-full";
}

/**
 * Container responsive pour la mise en page
 */
export const Container = React.forwardRef<HTMLDivElement, ContainerProps>(
  ({ className, maxWidth = "max-w-7xl", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "mx-auto w-full px-4 sm:px-6 lg:px-8",
          maxWidth,
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

Container.displayName = "Container";
