export default {
  input: 'main.js',
  // treeshake: {
  //   annotations: true,
  //   moduleSideEffects: true,
  //   propertyReadSideEffects: true,
  //   tryCatchDeoptimization: true,
  //   unknownGlobalSideEffects: true
  // },
  treeshake: false,
  output: {
    file: 'tmp.js',
    format: 'iife'
  }
};
