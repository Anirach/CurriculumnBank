# CurriculumBank Admin Manual

This manual provides guidance for administrators on how to manage users and curriculum files in the CurriculumBank system.

## Table of Contents

- [CurriculumBank Admin Manual](#curriculumbank-admin-manual)
  - [Table of Contents](#table-of-contents)
  - [Accessing the Admin Panel](#accessing-the-admin-panel)
  - [User Management](#user-management)
    - [Viewing Users](#viewing-users)
    - [Searching and Filtering](#searching-and-filtering)
    - [Changing User Roles](#changing-user-roles)
    - [Pagination](#pagination)
  - [Curriculum Management](#curriculum-management)
  - [Error Handling and Troubleshooting](#error-handling-and-troubleshooting)

---

## Accessing the Admin Panel

- Log in with your Google account.
- If your account has the `admin` role, you will see the **Admin** section in the navigation menu.
- Click **User Management** to access the user administration interface.

## User Management

### Viewing Users

- The user management page displays a table of all users registered in the system.
- Columns include: Name, Email, Role, and Actions.

### Searching and Filtering

- Use the search bar to filter users by name or email.
- Click the clear button to reset the search.

### Changing User Roles

- Use the dropdown in the **Role** column to select a new role for a user (admin, teacher, student).
- After selecting a new role, a confirmation dialog will appear.
- Confirm the change to update the user's role.
- Success and error messages will be displayed as appropriate.

### Pagination

- If there are many users, use the pagination controls at the bottom to navigate between pages.
- Each page displays up to 10 users.

## Curriculum Management

- Admins can upload, edit, and delete curriculum files from the curriculum management interface.
- Use the **Upload** button to add new files.
- Use the **Edit** and **Delete** actions for file management.
- You can also search and filter curriculum files by title, tags, or uploader.

## Error Handling and Troubleshooting

- If an error occurs (e.g., failed to load users, failed to update role), an error message will be displayed at the top of the page.
- If you encounter persistent issues:
  - Check your network connection.
  - Ensure your account has the correct role.
  - Contact technical support if problems persist.

---

For more information, see the [Deployment Guide](./deployment-guide.md) and [Testing Guide](./testing-guide.md).
