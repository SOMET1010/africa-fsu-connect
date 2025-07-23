
// Système de tokens de design unifié pour l'application
export const designTokens = {
  // Couleurs glassmorphisme
  glass: {
    background: {
      light: 'bg-white/80',
      medium: 'bg-white/60',
      strong: 'bg-white/90',
      card: 'bg-card/80',
      modal: 'bg-card/95'
    },
    backdrop: {
      light: 'backdrop-blur-sm',
      medium: 'backdrop-blur-md',
      strong: 'backdrop-blur-xl'
    },
    border: {
      light: 'border-border/20',
      medium: 'border-border/40',
      strong: 'border-border/60'
    },
    shadow: {
      light: 'shadow-lg shadow-black/5',
      medium: 'shadow-xl shadow-black/10',
      strong: 'shadow-2xl shadow-black/20'
    }
  },

  // Animations et transitions
  animation: {
    duration: {
      fast: 'duration-150',
      normal: 'duration-300',
      slow: 'duration-500'
    },
    ease: {
      out: 'ease-out',
      in: 'ease-in',
      inOut: 'ease-in-out'
    },
    hover: {
      scale: 'hover:scale-[1.02]',
      lift: 'hover:-translate-y-1',
      glow: 'hover:shadow-xl hover:shadow-primary/20'
    }
  },

  // Espacements et tailles
  spacing: {
    card: {
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8'
    },
    gap: {
      sm: 'gap-2',
      md: 'gap-4',
      lg: 'gap-6'
    }
  },

  // États et variantes
  states: {
    active: 'data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary/20 data-[state=active]:to-primary/10',
    hover: 'hover:bg-accent/50',
    focus: 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
    disabled: 'disabled:pointer-events-none disabled:opacity-50'
  }
};

// Utilitaires pour combiner les tokens
export const glassEffect = (variant: 'light' | 'medium' | 'strong' = 'medium') => {
  return [
    designTokens.glass.background[variant],
    designTokens.glass.backdrop[variant],
    designTokens.glass.border[variant],
    designTokens.glass.shadow[variant]
  ].join(' ');
};

export const modernTransition = (duration: 'fast' | 'normal' | 'slow' = 'normal') => {
  return [
    `transition-all ${designTokens.animation.duration[duration]}`,
    designTokens.animation.ease.out
  ].join(' ');
};

export const hoverEffects = {
  lift: [
    modernTransition(),
    designTokens.animation.hover.lift,
    designTokens.animation.hover.glow
  ].join(' '),
  
  scale: [
    modernTransition(),
    designTokens.animation.hover.scale,
    designTokens.animation.hover.glow
  ].join(' ')
};
