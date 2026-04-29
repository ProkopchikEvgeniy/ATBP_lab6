module.exports = {
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.test.js'],
  // Убираем setupFilesAfterEnv для тестирования
  reporters: [
    'default',
    ['allure-jest', {
      resultsDir: './allure-results',
      cleanResultsDir: true,
    }]
  ],
  transform: {},
  // Добавляем игнорирование node_modules
  testPathIgnorePatterns: ['/node_modules/'],
};