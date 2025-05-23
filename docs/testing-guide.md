# CurriculumBank Testing Guide

This guide provides information on how to run tests for the CurriculumBank application.

## Table of Contents

1. [Backend Testing](#backend-testing)

   - [Test Structure](#backend-test-structure)
   - [Unit Tests](#backend-unit-tests)
   - [Integration Tests](#backend-integration-tests)
   - [Running Tests](#running-backend-tests)

2. [Frontend Testing](#frontend-testing)

   - [Test Structure](#frontend-test-structure)
   - [Component Tests](#frontend-component-tests)
   - [Running Tests](#running-frontend-tests)

3. [End-to-End Testing](#end-to-end-testing)

4. [Continuous Integration](#continuous-integration)

## Backend Testing

### Backend Test Structure

The backend tests are organized into the following structure:

```
backend/
├── tests/
│   ├── testConfig.js        # Test configuration and mocks
│   ├── unit/                # Unit tests
│   │   ├── curriculum.test.js
│   │   └── user.test.js
│   └── integration/         # Integration tests
│       └── auth.test.js
```

### Backend Unit Tests

Unit tests focus on testing individual components (controllers, services, etc.) in isolation.

The backend uses Jest as the testing framework with the following mocked dependencies:

- Database connections
- Google Drive API
- Authentication middleware

### Backend Integration Tests

Integration tests verify that different components work together correctly.

The integration tests use:

- In-memory SQLite database
- Mocked Google Drive API
- JWT authentication testing

### Running Backend Tests

To run all backend tests:

```bash
cd backend
npm test
```

To run specific test files:

```bash
# Run unit tests only
npm test -- tests/unit

# Run a specific test file
npm test -- tests/unit/user.test.js
```

To run tests with coverage report:

```bash
npm test -- --coverage
```

## Frontend Testing

### Frontend Test Structure

The frontend tests are organized into the following structure:

```
frontend/
├── src/
│   ├── tests/
│   │   ├── testUtils.js                  # Test utilities and mocks
│   │   └── components/                   # Component tests
│   │       ├── admin/
│   │       │   └── UserManagement.test.js
│   │       └── curriculum/
│   │           ├── CurriculumDetail.test.js
│   │           ├── CurriculumEdit.test.js
│   │           ├── CurriculumList.test.js
│   │           └── CurriculumUpload.test.js
```

### Frontend Component Tests

Component tests focus on testing React components in isolation.

The frontend uses:

- Jest as the test runner
- React Testing Library for component testing
- Mock service worker for API mocking

Key testing aspects:

- Rendering components
- User interactions (clicks, input changes)
- Form submissions
- Conditional rendering
- API interactions

### Running Frontend Tests

To run all frontend tests:

```bash
cd frontend
npm test
```

To run specific test files:

```bash
# Run with a specific pattern
npm test -- CurriculumList
```

To run tests with coverage report:

```bash
npm test -- --coverage
```

## End-to-End Testing

For end-to-end testing, we use manual testing procedures to validate the complete user flow.

Future enhancements may include automated E2E testing with Cypress or Playwright.

## Continuous Integration

The project is configured for continuous integration to run tests automatically when code is pushed to the repository.

When setting up CI, configure the following:

1. Install dependencies for both frontend and backend
2. Run backend tests
3. Run frontend tests
4. Generate coverage reports

For detailed information on adding automated testing to your CI pipeline, refer to the [Developer Guide](./developer-guide.md).
