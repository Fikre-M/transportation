// @babel/preset-env: Automatically determines the Babel plugins you need based on your supported environments
// @babel/preset-react: Adds support for React and JSX
// @babel/preset-typescript: Adds support for TypeScript

const isTest = process.env.NODE_ENV === 'test';

module.exports = function (api) {
  const isTestEnv = api.env('test');
  
  // Cache the configuration based on the environment
  api.cache.using(() => process.env.NODE_ENV);

  const presets = [
    ['@babel/preset-env', {
      // Use the minimum necessary polyfills based on the actual browsers used in .browserslistrc
      useBuiltIns: 'usage',
      corejs: { version: '3.36', proposals: true },
      // Don't transform modules in test environment (Jest handles ES modules)
      modules: isTestEnv ? 'commonjs' : false,
      // Enable debug mode in development
      debug: process.env.NODE_ENV === 'development',
      // Target current Node version for tests, browsers for development/production
      targets: isTestEnv ? { node: 'current' } : { browsers: '> 0.25%, not dead' },
      // Enable loose mode for better compatibility
      loose: true,
    }],
    ['@babel/preset-react', {
      // Enable the new JSX transform (React 17+)
      runtime: 'automatic',
      // Enable development helpers in development
      development: process.env.NODE_ENV === 'development' || process.env.BABEL_ENV === 'development',
    }],
    '@babel/preset-typescript',
  ];

  const plugins = [
    // Enable class properties and private methods syntax
    ['@babel/plugin-proposal-class-properties', { loose: true }],
    ['@babel/plugin-proposal-private-methods', { loose: true }],
    ['@babel/plugin-proposal-private-property-in-object', { loose: true }],
    
    // Enable optional chaining and nullish coalescing
    ['@babel/plugin-proposal-optional-chaining', { loose: true }],
    ['@babel/plugin-proposal-nullish-coalescing-operator', { loose: true }],
    
    // Enable object rest spread
    ['@babel/plugin-proposal-object-rest-spread', { useBuiltIns: true }],
    
    // Enable numeric separators
    '@babel/plugin-proposal-numeric-separator',
    
    // Enable logical assignment operators
    '@babel/plugin-proposal-logical-assignment-operators',
    
    // Transform runtime for polyfills
    ['@babel/plugin-transform-runtime', {
      corejs: 3,
      helpers: true,
      regenerator: true,
      useESModules: !isTestEnv,
      absoluteRuntime: false,
      version: '^7.23.0',
    }],
    
    // Add support for dynamic imports
    '@babel/plugin-syntax-dynamic-import',
    
    // Emotion CSS prop support
    ['@emotion/babel-plugin', {
      sourceMap: process.env.NODE_ENV === 'development',
      autoLabel: 'dev-only',
      labelFormat: '[local]',
      cssPropOptimization: true,
    }],
    
    // Transform import.meta in test environment
    isTestEnv && './babel-plugin-transform-import-meta.cjs',
    
    // Better debugging with component names in React DevTools
    process.env.NODE_ENV === 'development' && 'react-refresh/babel',
  ].filter(Boolean);

  return {
    presets,
    plugins,
    // Source maps for better debugging
    sourceMaps: 'inline',
    // Use a custom .browserslistrc file for browser targeting
    // This helps with polyfill optimization
    ignore: [
      // Don't process node_modules by default
      'node_modules',
      // Ignore test files in non-test environments
      ...(process.env.NODE_ENV !== 'test' ? ['**/*.test.js', '**/*.test.jsx', '**/*.test.ts', '**/*.test.tsx'] : []),
    ],
    // Enable assumptions for smaller output
    assumptions: {
      setPublicClassFields: true,
      privateFieldsAsProperties: true,
    },
  };
};
