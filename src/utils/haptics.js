// Mobile Vibration Haptic Feedback Utility
export const triggerHaptic = (pattern = 20) => {
  if (typeof window !== 'undefined' && 'navigator' in window && navigator.vibrate) {
    try {
      navigator.vibrate(pattern);
    } catch {
      // Haptics disabled or unsupported
    }
  }
};
