/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  transform: {
    "^.+\\.tsx?$": [
      "esbuild-jest",
      {
        target: 'node14',
      },
    ],
  },
  testEnvironment: 'node',
};
