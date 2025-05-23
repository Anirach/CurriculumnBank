// Google Drive service implementation
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

class DriveService {
  constructor() {
    this.drive = null;
    this.folderIds = {
      root: process.env.GOOGLE_DRIVE_ROOT_FOLDER_ID,
    };
    this.initDrive();
  }

  initDrive() {
    try {
      // Initialize the Google Drive API client using service account credentials
      const auth = new google.auth.GoogleAuth({
        keyFile: process.env.GOOGLE_APPLICATION_CREDENTIALS,
        scopes: ["https://www.googleapis.com/auth/drive"],
      });

      this.drive = google.drive({ version: "v3", auth });
      console.log("Google Drive API initialized successfully");
    } catch (error) {
      console.error("Drive initialization error:", error);
    }
  }

  async createFolder(folderName, parentFolderId = null) {
    try {
      if (!this.drive) {
        throw new Error("Drive client not initialized");
      }

      const fileMetadata = {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
        parents: parentFolderId ? [parentFolderId] : [this.folderIds.root],
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        fields: "id,name",
      });

      return response.data;
    } catch (error) {
      console.error("Create folder error:", error);
      throw error;
    }
  }

  async uploadFile(fileBuffer, fileName, mimeType, metadata = {}) {
    try {
      if (!this.drive) {
        throw new Error("Drive client not initialized");
      }

      // Ensure the root folder exists
      if (!this.folderIds.root) {
        throw new Error("Root folder ID is not configured");
      }

      const fileMetadata = {
        name: fileName,
        parents: [this.folderIds.root],
        properties: metadata, // Store metadata as properties
      };

      const media = {
        mimeType,
        body: fileBuffer,
      };

      const response = await this.drive.files.create({
        resource: fileMetadata,
        media: media,
        fields: "id,name,mimeType,webViewLink,webContentLink,properties",
      });

      return response.data;
    } catch (error) {
      console.error("Upload file error:", error);
      throw error;
    }
  }

  async uploadFileFromPath(filePath, fileName, mimeType, metadata = {}) {
    try {
      const fileBuffer = fs.createReadStream(filePath);
      return await this.uploadFile(
        fileBuffer,
        fileName || path.basename(filePath),
        mimeType,
        metadata
      );
    } catch (error) {
      console.error("Upload file from path error:", error);
      throw error;
    }
  }

  async getFile(fileId) {
    try {
      if (!this.drive) {
        throw new Error("Drive client not initialized");
      }

      const response = await this.drive.files.get({
        fileId,
        fields: "id,name,mimeType,webViewLink",
      });

      return response.data;
    } catch (error) {
      console.error("Get file error:", error);
      throw error;
    }
  }

  async generateDownloadUrl(fileId) {
    try {
      if (!this.drive) {
        throw new Error("Drive client not initialized");
      }

      // Generate a downloadable URL for the file
      const response = await this.drive.files.get({
        fileId,
        fields: "webContentLink",
      });

      return response.data.webContentLink;
    } catch (error) {
      console.error("Generate download URL error:", error);
      throw error;
    }
  }

  async deleteFile(fileId) {
    try {
      if (!this.drive) {
        throw new Error("Drive client not initialized");
      }

      await this.drive.files.delete({
        fileId,
      });

      return true;
    } catch (error) {
      console.error("Delete file error:", error);
      throw error;
    }
  }

  async updateFileMetadata(fileId, metadata = {}) {
    try {
      if (!this.drive) {
        throw new Error("Drive client not initialized");
      }

      const fileMetadata = {
        properties: metadata, // Store metadata as properties
      };

      const response = await this.drive.files.update({
        fileId,
        resource: fileMetadata,
        fields: "id,name,mimeType,webViewLink,webContentLink,properties",
      });

      return response.data;
    } catch (error) {
      console.error("Update file metadata error:", error);
      throw error;
    }
  }

  async setPermissions(fileId, emailAddress, role = "reader") {
    try {
      if (!this.drive) {
        throw new Error("Drive client not initialized");
      }

      const permission = {
        type: "user",
        role,
        emailAddress,
      };

      await this.drive.permissions.create({
        fileId,
        resource: permission,
      });

      return true;
    } catch (error) {
      console.error("Set permissions error:", error);
      throw error;
    }
  }
}

module.exports = new DriveService();
