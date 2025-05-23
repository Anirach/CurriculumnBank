# Google API Setup Guide for CurriculumBank

This guide will help you set up the necessary Google API credentials for the CurriculumBank application.

## 1. Create a Google Cloud Project

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Click on the project dropdown at the top of the page
3. Click on "New Project"
4. Enter a name for your project (e.g., "CurriculumBank")
5. Click "Create"

## 2. Enable Required APIs

1. In your new project, go to "APIs & Services" > "Library"
2. Search for and enable the following APIs:
   - Google Drive API
   - Google OAuth2 API

## 3. Configure OAuth Consent Screen

1. Go to "APIs & Services" > "OAuth consent screen"
2. Select "External" user type (or "Internal" if this is for an organization)
3. Fill in the required information:
   - App name: "CurriculumBank"
   - User support email: Your email
   - Developer contact information: Your email
4. Click "Save and Continue"
5. Add the following scopes:
   - `https://www.googleapis.com/auth/drive.file`
   - `https://www.googleapis.com/auth/userinfo.profile`
   - `https://www.googleapis.com/auth/userinfo.email`
6. Click "Save and Continue" and complete the setup

## 4. Create OAuth 2.0 Client ID

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth client ID"
3. Select "Web application" as the application type
4. Name: "CurriculumBank Web Client"
5. Add authorized JavaScript origins:
   - `http://localhost:3000` (for development)
   - Your production URL (if applicable)
6. Add authorized redirect URIs:
   - `http://localhost:3000` (for development)
   - Your production URL (if applicable)
7. Click "Create"
8. Note down the Client ID and Client Secret

## 5. Create Service Account (for backend)

1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "Service account"
3. Name: "CurriculumBank Backend Service"
4. Grant this service account access to the project (Role: "Editor")
5. Click "Done"
6. Click on the service account email to open its details
7. Go to the "Keys" tab
8. Click "Add Key" > "Create new key"
9. Select "JSON" and click "Create"
10. The key file will be downloaded to your computer

## 6. Configure Google Drive Folder

1. Create a folder in Google Drive where curriculum files will be stored
2. Share this folder with the service account email (with Editor permissions)
3. Note the folder ID (in the URL: `https://drive.google.com/drive/folders/FOLDER_ID`)

## 7. Base64 Encode the Service Account Key

For use in Docker deployment, you'll need to encode your service account key as a base64 string:

```bash
# On macOS or Linux
cat path/to/your/service-account-key.json | base64

# On Windows (PowerShell)
[Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes($(Get-Content -Raw path\to\your\service-account-key.json)))
```

## 8. Update Environment Variables

Update the following environment variables in your `.env` file:

```
# JWT Secret (generate a random string)
JWT_SECRET=your_jwt_secret_here

# Google OAuth
GOOGLE_OAUTH_CLIENT_ID=your_oauth_client_id
GOOGLE_OAUTH_CLIENT_SECRET=your_oauth_client_secret

# Google Drive
GOOGLE_DRIVE_FOLDER_ID=your_folder_id

# Google Service Account (Base64 encoded)
GOOGLE_SERVICE_ACCOUNT_KEY=your_base64_encoded_service_account_key
```

## 9. Testing the Configuration

1. Start both backend and frontend applications
2. Try to sign in with Google
3. Upload a test file to ensure Drive integration is working correctly

## Troubleshooting

### OAuth Errors

If you encounter authentication issues:

1. Verify the OAuth Client ID and Secret are correctly set
2. Ensure the redirect URIs match your actual application URLs
3. Check that you've added all required scopes

### Drive Integration Issues

If file operations fail:

1. Verify the service account has proper permissions on the Drive folder
2. Check that the folder ID is correct
3. Ensure the service account key is properly encoded and set in environment variables

### API Quota Limits

Google API has usage limits. For production use:

1. Set up billing for your Google Cloud project
2. Monitor API usage in the Google Cloud Console
3. Consider applying for higher quotas if needed
