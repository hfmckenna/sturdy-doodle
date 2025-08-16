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
  // Each user is rendered as an <li> containing the user's name and action buttons
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

    // Assert the new user appears in the list and verify email via Show Details modal
    const li = await findUserListItem(page, fullName);
    await li.getByRole('button', { name: 'Show Details' }).click();
    const detailsDialog = page.getByRole('dialog', { name: 'User Details' });
    await expect(detailsDialog).toContainText(user.email);
    await detailsDialog.getByRole('button', { name: 'Close' }).click();

    // Delete the user via Edit User modal
    await li.getByRole('button', { name: 'Edit User' }).click();
    const editDialog = page.getByRole('dialog', { name: 'Edit User' });
    await page.once('dialog', (dialog) => dialog.accept());
    await editDialog.getByRole('button', { name: 'Delete' }).click();

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

    // Verify email in Show Details modal
    await originalLi.getByRole('button', { name: 'Show Details' }).click();
    const detailsDialog0 = page.getByRole('dialog', { name: 'User Details' });
    await expect(detailsDialog0).toContainText(user.email);
    await detailsDialog0.getByRole('button', { name: 'Close' }).click();

    // 2) Open the Edit User modal for that user
    await originalLi.getByRole('button', { name: 'Edit User' }).click();

    // 3) Update each field in the UserForm within the modal
    const updated = {
      firstName: `${user.firstName}-Updated`,
      lastName: `${user.lastName}-Changed`,
      email: `updated+${user.email}`,
    };

    const editDialog = page.getByRole('dialog', { name: 'Edit User' });
    const editForm = editDialog.locator('form');
    await editForm.getByPlaceholder('First name').fill(updated.firstName);
    await editForm.getByPlaceholder('Last name').fill(updated.lastName);
    await editForm.getByPlaceholder('Email').fill(updated.email);

    // 4) Submit the update form (modal should close automatically)
    await editForm.getByRole('button', { name: 'Update User' }).click();

    const updatedFullName = `${updated.firstName} ${updated.lastName}`;

    // 5) Verify that all fields have been updated (check email in Show Details modal)
    const updatedLi = await findUserListItem(page, updatedFullName);
    await updatedLi.getByRole('button', { name: 'Show Details' }).click();
    const detailsDialog1 = page.getByRole('dialog', { name: 'User Details' });
    await expect(detailsDialog1).toContainText(updated.email);
    await detailsDialog1.getByRole('button', { name: 'Close' }).click();

    // Also verify the old full name is no longer present
    await expect(page.getByRole('listitem').filter({ hasText: originalFullName })).toHaveCount(0);

    // 6) Cleanup: delete the updated user via Edit User modal
    await updatedLi.getByRole('button', { name: 'Edit User' }).click();
    const editDialogAfterUpdate = page.getByRole('dialog', { name: 'Edit User' });
    await page.once('dialog', (dialog) => dialog.accept());
    await editDialogAfterUpdate.getByRole('button', { name: 'Delete' }).click();
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

    // Open Show Details dialog to add a course
    await li.getByRole('button', { name: 'Show Details' }).click();
    const detailsDialog = page.getByRole('dialog', { name: 'User Details' });

    // Fill the Add Course Result form within the details dialog
    const courseName = `Course ${Date.now()}`;
    const score = 88;
    await detailsDialog.getByPlaceholder('Course name').fill(courseName);
    await detailsDialog.getByPlaceholder('Score').fill(String(score));
    await detailsDialog.getByRole('button', { name: 'Add Result' }).click();

    // Verify the course appears in the dialog
    await expect(detailsDialog).toContainText(`${courseName}: ${score}`);

    // Delete the newly added course result (accept the confirm dialog)
    const courseLi = detailsDialog.getByRole('listitem').filter({ hasText: `${courseName}: ${score}` });
    await page.once('dialog', (dialog) => dialog.accept());
    await courseLi.getByRole('button', { name: 'Delete' }).click();

    // Verify the course is removed
    await expect(courseLi).toHaveCount(0);

    // Close details dialog
    await detailsDialog.getByRole('button', { name: 'Close' }).click();

    // Cleanup: delete the user via Edit User modal
    await li.getByRole('button', { name: 'Edit User' }).click();
    const editDialog2 = page.getByRole('dialog', { name: 'Edit User' });
    await page.once('dialog', (dialog) => dialog.accept());
    await editDialog2.getByRole('button', { name: 'Delete' }).click();
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

    // Open details to work with courses
    const openDetails = async () => {
      await li.getByRole('button', { name: 'Show Details' }).click();
      return page.getByRole('dialog', { name: 'User Details' });
    };

    let detailsDialog2 = await openDetails();

    // 2) Add an initial course result
    const originalName = `Course ${Date.now()}`;
    const originalScore = 73;
    await detailsDialog2.getByPlaceholder('Course name').fill(originalName);
    await detailsDialog2.getByPlaceholder('Score').fill(String(originalScore));
    await detailsDialog2.getByRole('button', { name: 'Add Result' }).click();

    const originalCourseLi = detailsDialog2.getByRole('listitem').filter({ hasText: `${originalName}: ${originalScore}` });
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
    const updatedCourseLi = detailsDialog2.getByRole('listitem').filter({ hasText: `${updatedName}: ${updatedScore}` });
    await expect(updatedCourseLi).toHaveCount(1);

    // 6) Reload and verify persistence
    await page.reload();
    const liAfterReload = await findUserListItem(page, fullName);
    await liAfterReload.getByRole('button', { name: 'Show Details' }).click();
    const detailsAfterReload = page.getByRole('dialog', { name: 'User Details' });
    await expect(detailsAfterReload.getByRole('listitem').filter({ hasText: `${updatedName}: ${updatedScore}` })).toHaveCount(1);

    // 7) Cleanup: delete the updated course and then the user
    const updatedCourseLiAfterReload = detailsAfterReload.getByRole('listitem').filter({ hasText: `${updatedName}: ${updatedScore}` });
    await page.once('dialog', (dialog) => dialog.accept());
    await updatedCourseLiAfterReload.getByRole('button', { name: 'Delete' }).click();
    await expect(updatedCourseLiAfterReload).toHaveCount(0);

    // Close details before deleting user
    await detailsAfterReload.getByRole('button', { name: 'Close' }).click();

    await liAfterReload.getByRole('button', { name: 'Edit User' }).click();
    const editDialog3 = page.getByRole('dialog', { name: 'Edit User' });
    await page.once('dialog', (dialog) => dialog.accept());
    await editDialog3.getByRole('button', { name: 'Delete' }).click();
    await expect(page.getByRole('listitem').filter({ hasText: fullName })).toHaveCount(0);
  });
});
