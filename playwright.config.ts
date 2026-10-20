import { defineConfig, devices } from '@playwright/test';

const basePath = process.env.GITHUB_PAGES === 'true' ? '/portfolio-v2/' : '/';

export default defineConfig({
  testDir: './tests/browser',
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  workers: 1,
  use: {
    baseURL: `http://127.0.0.1:4175${basePath}`,
    trace: 'retain-on-failure',
    reducedMotion: 'reduce',
  },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'] } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
  ],
  webServer: {
    command: 'node scripts/serve-static-test.mjs',
    url: `http://127.0.0.1:4175${basePath}`,
    reuseExistingServer: false,
  },
});
