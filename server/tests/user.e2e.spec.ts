import { test, expect } from '@playwright/test';

// Utility to generate a unique user per test run
function uniqueUser() {
  const ts = Date.now();
  return {
    firstName: `E2E${ts}`,
    lastName: 'User',
    email: `e2e.${ts}@test.local`,
  };
}

// Helper to get a list item for a given full name
async function findUserListItem(page, fullName: string) {
  // Each user is rendered as an <li> containing name and email and a Delete button
  const locator = page.getByRole('listitem').filter({ hasText: fullName });
  return locator;
}

test.describe('User create and delete', () => {
  test('should create a user and then delete it', async ({ page }) => {
    const user = uniqueUser();

    // Go to app root
    await page.goto('/');

    // Expect header is visible
    await expect(page.getByRole('heading', { name: 'User View' })).toBeVisible();

    // Fill the create user form
    await page.getByPlaceholder('First name').fill(user.firstName);
    await page.getByPlaceholder('Last name').fill(user.lastName);
    await page.getByPlaceholder('Email').fill(user.email);

    // Submit
    await page.getByRole('button', { name: 'Add User' }).click();

    const fullName = `${user.firstName} ${user.lastName}`;

    // Assert the new user appears in the list with their email
    const li = await findUserListItem(page, fullName);
    await expect(li).toContainText(user.email);

    // Delete the user
    await li.getByRole('button', { name: 'Delete' }).click();

    // Assert the user is removed
    await expect(page.getByRole('listitem').filter({ hasText: fullName })).toHaveCount(0);
  });
});
