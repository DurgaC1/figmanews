// Initialize Reanimated logger config before Reanimated loads
// This must run synchronously at module load time
if (typeof global !== 'undefined') {
  // Set up the logger config object immediately
  // This prevents ReferenceError when Reanimated tries to access it
  Object.defineProperty(global, '__reanimatedLoggerConfig', {
    value: {
      allowJS: true,
      enableCallStack: false,
    },
    writable: true,
    configurable: true,
    enumerable: false,
  });
}

