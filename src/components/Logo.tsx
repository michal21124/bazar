import React from 'react';
import { cn } from '@/lib/utils';

export function Logo({ size = 48, className }: { size?: number; className?: string }) {
  return (
    <img 
      src="/logo-icon.png" 
      width={size} 
      height={size} 
      className={cn("object-contain", className)} 
      alt="Platinum Cars" 
    />
  );
}
