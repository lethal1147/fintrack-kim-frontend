/**
 * Feature flags — set a key to `true` when the feature is ready to ship.
 * FeatureGate reads from this map and renders a "Coming soon" overlay when false.
 */
export const FEATURES = {
  two_factor_auth: false,
  active_sessions: false,
} as const

export type FeatureKey = keyof typeof FEATURES
