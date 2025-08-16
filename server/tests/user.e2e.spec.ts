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

    // Open the Create User modal
    await page.getByRole('button', { name: 'New User' }).click();

    // Fill the create user form within the dialog
    const dialog = page.getByRole('dialog', { name: 'Create User' });
    const createForm = dialog.locator('form');
    await createForm.getByPlaceholder('First name').fill(user.firstName);
    await createForm.getByPlaceholder('Last name').fill(user.lastName);
    await createForm.getByPlaceholder('Email').fill(user.email);

    // Submit (modal should close automatically)
    await createForm.getByRole('button', { name: 'Add User' }).click();

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

test.describe('User update (UserForm edit)', () => {
  test('should update all user fields via the edit UserForm', async ({ page }) => {
    const user = uniqueUser();

    // 1) Create a user that we will later update
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'User View' })).toBeVisible();
    await page.getByRole('button', { name: 'New User' }).click();
    const dialog = page.getByRole('dialog', { name: 'Create User' });
    const createForm = dialog.locator('form');
    await createForm.getByPlaceholder('First name').fill(user.firstName);
    await createForm.getByPlaceholder('Last name').fill(user.lastName);
    await createForm.getByPlaceholder('Email').fill(user.email);
    await createForm.getByRole('button', { name: 'Add User' }).click();

    const originalFullName = `${user.firstName} ${user.lastName}`;
    const originalLi = await findUserListItem(page, originalFullName);
    await expect(originalLi).toContainText(user.email);

    // 2) Open the Edit details panel for that user
    await originalLi.locator('summary', { hasText: 'Edit' }).click();

    // 3) Update each field in the embedded UserForm
    const updated = {
      firstName: `${user.firstName}-Updated`,
      lastName: `${user.lastName}-Changed`,
      email: `updated+${user.email}`,
    };

    // Scope all interactions to the same list item to avoid targeting the top create form
    await originalLi.getByPlaceholder('First name').fill(updated.firstName);
    await originalLi.getByPlaceholder('Last name').fill(updated.lastName);
    await originalLi.getByPlaceholder('Email').fill(updated.email);

    // 4) Submit the update form
    await originalLi.getByRole('button', { name: 'Update User' }).click();

    const updatedFullName = `${updated.firstName} ${updated.lastName}`;

    // 5) Verify that all fields have been updated in the list
    const updatedLi = await findUserListItem(page, updatedFullName);
    await expect(updatedLi).toContainText(updated.email);

    // Also verify the old full name is no longer present
    await expect(page.getByRole('listitem').filter({ hasText: originalFullName })).toHaveCount(0);

    // 6) Cleanup: delete the updated user
    await updatedLi.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('listitem').filter({ hasText: updatedFullName })).toHaveCount(0);
  });
});



test.describe('Course results', () => {
  test('should add a course result to a user, display it, then delete it', async ({ page }) => {
    const user = uniqueUser();

    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'User View' })).toBeVisible();

    // Create user via modal
    await page.getByRole('button', { name: 'New User' }).click();
    const dialog = page.getByRole('dialog', { name: 'Create User' });
    const createForm = dialog.locator('form');
    await createForm.getByPlaceholder('First name').fill(user.firstName);
    await createForm.getByPlaceholder('Last name').fill(user.lastName);
    await createForm.getByPlaceholder('Email').fill(user.email);
    await createForm.getByRole('button', { name: 'Add User' }).click();

    const fullName = `${user.firstName} ${user.lastName}`;
    const li = await findUserListItem(page, fullName);
    await expect(li).toContainText(user.email);

    // Fill the Add Course Result form within this user's list item
    const courseName = `Course ${Date.now()}`;
    const score = 88;
    await li.getByPlaceholder('Course name').fill(courseName);
    await li.getByPlaceholder('Score').fill(String(score));
    await li.getByRole('button', { name: 'Add Result' }).click();

    // Verify the course appears
    await expect(li).toContainText(`${courseName}: ${score}`);

    // Delete the newly added course result (accept the confirm dialog)
    const courseLi = li.getByRole('listitem').filter({ hasText: `${courseName}: ${score}` });
    await page.once('dialog', (dialog) => dialog.accept());
    await courseLi.getByRole('button', { name: 'Delete' }).click();

    // Verify the course is removed from this user's course list
    await expect(courseLi).toHaveCount(0);

    // Cleanup: delete the user
    await li.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('listitem').filter({ hasText: fullName })).toHaveCount(0);
  });

  test('should update a course result for a user and persist after reload', async ({ page }) => {
    const user = uniqueUser();

    // 1) Create a user
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'User View' })).toBeVisible();
    await page.getByRole('button', { name: 'New User' }).click();
    const dialog = page.getByRole('dialog', { name: 'Create User' });
    const createForm = dialog.locator('form');
    await createForm.getByPlaceholder('First name').fill(user.firstName);
    await createForm.getByPlaceholder('Last name').fill(user.lastName);
    await createForm.getByPlaceholder('Email').fill(user.email);
    await createForm.getByRole('button', { name: 'Add User' }).click();

    const fullName = `${user.firstName} ${user.lastName}`;
    const li = await findUserListItem(page, fullName);
    await expect(li).toContainText(user.email);

    // 2) Add an initial course result
    const originalName = `Course ${Date.now()}`;
    const originalScore = 73;
    await li.getByPlaceholder('Course name').fill(originalName);
    await li.getByPlaceholder('Score').fill(String(originalScore));
    await li.getByRole('button', { name: 'Add Result' }).click();

    const originalCourseLi = li.getByRole('listitem').filter({ hasText: `${originalName}: ${originalScore}` });
    await expect(originalCourseLi).toHaveCount(1);

    // 3) Click Edit for that course
    await originalCourseLi.getByRole('button', { name: 'Edit' }).click();

    // 4) Change name and score in the inline form and Save (scope to the list item that now contains a Save button)
    const updatedName = `${originalName} - Updated`;
    const updatedScore = originalScore + 5;
    const editForm = page.locator('form').filter({ has: page.getByRole('button', { name: 'Save' }) }).first();
    await expect(editForm.getByRole('button', { name: 'Save' })).toBeVisible();
    await editForm.getByPlaceholder('Course name').fill(updatedName);
    await editForm.getByPlaceholder('Score').fill(String(updatedScore));
    await editForm.getByRole('button', { name: 'Save' }).click();

    // 5) Verify updated values are shown
    const updatedCourseLi = li.getByRole('listitem').filter({ hasText: `${updatedName}: ${updatedScore}` });
    await expect(updatedCourseLi).toHaveCount(1);

    // 6) Reload and verify persistence
    await page.reload();
    const liAfterReload = await findUserListItem(page, fullName);
    await expect(liAfterReload.getByRole('listitem').filter({ hasText: `${updatedName}: ${updatedScore}` })).toHaveCount(1);

    // 7) Cleanup: delete the updated course and then the user
    const updatedCourseLiAfterReload = liAfterReload.getByRole('listitem').filter({ hasText: `${updatedName}: ${updatedScore}` });
    await page.once('dialog', (dialog) => dialog.accept());
    await updatedCourseLiAfterReload.getByRole('button', { name: 'Delete' }).click();
    await expect(updatedCourseLiAfterReload).toHaveCount(0);

    await liAfterReload.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('listitem').filter({ hasText: fullName })).toHaveCount(0);
  });
});
