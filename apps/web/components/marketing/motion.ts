/** Shared motion tokens for the marketing site — aligned with DESIGN.md + animations.dev */

export const easeOutExpo = [0.19, 1, 0.22, 1] as const
export const easeOut = [0.22, 1, 0.36, 1] as const
/** Vaul-like: steep start, soft settle — shell travel */
export const easeVaul = [0.32, 0.72, 0, 1] as const

export const duration = {
  fast: 0.2,
  base: 0.45,
  enter: 0.65,
  hero: 0.8,
  float: 5.5,
} as const

/** Entrance from near-full scale — never scale(0) */
export const enterScale = 0.96
