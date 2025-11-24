// Framer Motion animation variants library

export const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
}

export const scaleIn = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 },
    transition: { duration: 0.2, ease: 'easeOut' }
}

export const slideIn = {
    initial: { x: -20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.3, ease: 'easeOut' }
}

export const slideInFromRight = {
    initial: { x: 20, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    transition: { duration: 0.3, ease: 'easeOut' }
}

export const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
}

export const listItem = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 }
}

// Hover animations
export const hoverScale = {
    whileHover: { scale: 1.02, y: -4 },
    whileTap: { scale: 0.98 }
}

export const hoverLift = {
    whileHover: { y: -8, transition: { duration: 0.2 } }
}

// Loading animations
export const pulseAnimation = {
    animate: {
        scale: [1, 1.05, 1],
        opacity: [1, 0.8, 1]
    },
    transition: {
        duration: 2,
        repeat: Infinity,
        ease: 'easeInOut'
    }
}

export const spinAnimation = {
    animate: { rotate: 360 },
    transition: {
        duration: 1,
        repeat: Infinity,
        ease: 'linear'
    }
}
