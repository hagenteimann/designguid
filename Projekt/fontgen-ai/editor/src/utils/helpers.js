/**
 * Utility helper functions
 */

/**
 * Clamp value between min and max
 */
export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

/**
 * Map value from one range to another
 */
export function map(value, inMin, inMax, outMin, outMax) {
  return outMin + ((value - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/**
 * Linear interpolation
 */
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

/**
 * Distance between two points
 */
export function distance(x1, y1, x2, y2) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Angle between two points (in radians)
 */
export function angle(x1, y1, x2, y2) {
  return Math.atan2(y2 - y1, x2 - x1);
}

/**
 * Normalize vector
 */
export function normalize(x, y) {
  const len = Math.sqrt(x * x + y * y);
  if (len === 0) return { x: 0, y: 0 };
  return { x: x / len, y: y / len };
}

/**
 * Dot product
 */
export function dot(x1, y1, x2, y2) {
  return x1 * x2 + y1 * y2;
}

/**
 * Rotate point around origin
 */
export function rotatePoint(x, y, angle, cx = 0, cy = 0) {
  const cos = Math.cos(angle);
  const sin = Math.sin(angle);

  const tx = x - cx;
  const ty = y - cy;

  return {
    x: cx + tx * cos - ty * sin,
    y: cy + tx * sin + ty * cos
  };
}

/**
 * Calculate bounding box from points
 */
export function calculateBounds(points) {
  if (!points || points.length === 0) {
    return { x: 0, y: 0, width: 0, height: 0 };
  }

  let minX = points[0].x;
  let maxX = points[0].x;
  let minY = points[0].y;
  let maxY = points[0].y;

  for (const point of points) {
    minX = Math.min(minX, point.x);
    maxX = Math.max(maxX, point.x);
    minY = Math.min(minY, point.y);
    maxY = Math.max(maxY, point.y);
  }

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY,
    minX,
    maxX,
    minY,
    maxY
  };
}

/**
 * Check if point is inside bounds
 */
export function isPointInBounds(x, y, bounds) {
  return (
    x >= bounds.x &&
    x <= bounds.x + bounds.width &&
    y >= bounds.y &&
    y <= bounds.y + bounds.height
  );
}

/**
 * Format number to fixed decimal places
 */
export function formatNumber(num, decimals = 2) {
  return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
}

/**
 * Debounce function
 */
export function debounce(fn, delay = 300) {
  let timeoutId;
  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => fn(...args), delay);
  };
}

/**
 * Throttle function
 */
export function throttle(fn, delay = 300) {
  let lastCall = 0;
  return function (...args) {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      fn(...args);
    }
  };
}

/**
 * Generate UUID v4
 */
export function generateId() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Deep clone object
 */
export function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime());
  if (obj instanceof Array) return obj.map(item => deepClone(item));
  if (obj instanceof Object) {
    const clonedObj = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        clonedObj[key] = deepClone(obj[key]);
      }
    }
    return clonedObj;
  }
}

/**
 * Merge objects (shallow merge)
 */
export function merge(target, source) {
  const result = { ...target };
  for (const key in source) {
    if (source.hasOwnProperty(key)) {
      result[key] = source[key];
    }
  }
  return result;
}

/**
 * Convert degrees to radians
 */
export function toRadians(degrees) {
  return (degrees * Math.PI) / 180;
}

/**
 * Convert radians to degrees
 */
export function toDegrees(radians) {
  return (radians * 180) / Math.PI;
}

/**
 * Smoothstep interpolation
 */
export function smoothstep(t) {
  return t * t * (3 - 2 * t);
}

/**
 * Smootherstep interpolation
 */
export function smootherstep(t) {
  return t * t * t * (t * (t * 6 - 15) + 10);
}

/**
 * Ease in (quadratic)
 */
export function easeIn(t) {
  return t * t;
}

/**
 * Ease out (quadratic)
 */
export function easeOut(t) {
  return t * (2 - t);
}

/**
 * Ease in-out (quadratic)
 */
export function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}

export default {
  clamp,
  map,
  lerp,
  distance,
  angle,
  normalize,
  dot,
  rotatePoint,
  calculateBounds,
  isPointInBounds,
  formatNumber,
  debounce,
  throttle,
  generateId,
  deepClone,
  merge,
  toRadians,
  toDegrees,
  smoothstep,
  smootherstep,
  easeIn,
  easeOut,
  easeInOut
};
