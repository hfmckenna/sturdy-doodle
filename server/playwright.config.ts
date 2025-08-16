import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 60_000,
  expect: { timeout: 10_000 },
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: [['list']],
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000,
  },
  webServer: [
    {
      command: 'npm --prefix server run start',
      port: 8000,
      reuseExistingServer: !process.env.CI,
      env: {
        PORT: '8000',
      },
    },
    {
      command: 'npm --prefix client run dev',
      port: 5173,
      reuseExistingServer: !process.env.CI,
      env: {
        VITE_API_URL: 'http://localhost:8000/',
      },
    },
  ],
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
