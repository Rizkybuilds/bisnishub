import { useEffect, useRef } from 'react';

/**
 * Custom hook untuk scroll-triggered reveal animations
 * Menggunakan Intersection Observer API (zero dependency)
 * 
 * @param {Object} options
 * @param {number} options.threshold - Visibility threshold (0-1), default: 0.15
 * @param {string} options.rootMargin - Root margin, default: '0px 0px -60px 0px'
 * @param {boolean} options.triggerOnce - Hanya trigger sekali, default: true
 * @returns {React.RefObject} ref - Attach ke container element
 */
export function useScrollReveal({
  threshold = 0.15,
  rootMargin = '0px 0px -60px 0px',
  triggerOnce = true,
} = {}) {
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) {
      element.classList.add('is-visible');
      // Also reveal all children with scroll-reveal class
      element.querySelectorAll('.scroll-reveal').forEach(child => {
        child.classList.add('is-visible');
      });
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            // Also reveal children with scroll-reveal class (staggered)
            entry.target.querySelectorAll('.scroll-reveal').forEach(child => {
              child.classList.add('is-visible');
            });
            if (triggerOnce) {
              observer.unobserve(entry.target);
            }
          } else if (!triggerOnce) {
            entry.target.classList.remove('is-visible');
            entry.target.querySelectorAll('.scroll-reveal').forEach(child => {
              child.classList.remove('is-visible');
            });
          }
        });
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return ref;
}

/**
 * Wrapper component untuk scroll reveal pada section
 * Usage: <ScrollRevealSection className="...">...</ScrollRevealSection>
 */
export function ScrollRevealSection({ 
  children, 
  className = '', 
  stagger = false,
  as: Component = 'div',
  ...props 
}) {
  const ref = useScrollReveal();

  return (
    <Component 
      ref={ref} 
      className={`scroll-reveal ${stagger ? 'scroll-reveal-stagger' : ''} ${className}`}
      {...props}
    >
      {children}
    </Component>
  );
}
