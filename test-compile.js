#!/usr/bin/env node

const { spawn } = require("child_process");
const path = require("path");

console.log("🔍 Testing Frontend Compilation...");

const frontendPath = path.join(__dirname, "frontend");

// Test frontend build
const buildProcess = spawn("npm", ["run", "build"], {
  cwd: frontendPath,
  stdio: "pipe",
});

let output = "";
let errors = "";

buildProcess.stdout.on("data", (data) => {
  output += data.toString();
  process.stdout.write(data);
});

buildProcess.stderr.on("data", (data) => {
  errors += data.toString();
  process.stderr.write(data);
});

buildProcess.on("close", (code) => {
  console.log("\n" + "=".repeat(50));
  if (code === 0) {
    console.log("✅ Frontend compilation SUCCESSFUL");
    console.log("The application is ready to run!");
  } else {
    console.log("❌ Frontend compilation FAILED");
    console.log("Exit code:", code);
    if (errors) {
      console.log("\nErrors:");
      console.log(errors);
    }
  }
  process.exit(code);
});
