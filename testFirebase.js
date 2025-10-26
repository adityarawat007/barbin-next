// testFirebase.js
// Simple script to test Firebase connection
// Run with: node testFirebase.js

require("dotenv").config();
const admin = require("firebase-admin");

console.log("=".repeat(50));
console.log("TESTING FIREBASE CONNECTION");
console.log("=".repeat(50));

try {
  // Initialize Firebase Admin
  const serviceAccount = require("./barbin-furniture-firebase-adminsdk-fbsvc-034903bd51.json");

  console.log("✓ Service account key loaded");
  console.log(`  - Project ID: ${serviceAccount.project_id}`);
  console.log(`  - Client Email: ${serviceAccount.client_email}`);

  // Initialize Firebase
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    projectId: serviceAccount.project_id, // Explicitly set project ID
  });

  console.log("✓ Firebase Admin initialized");

  const db = admin.firestore();
  console.log("✓ Firestore instance created");

  // Test connection by trying to read a collection
  console.log("\nTesting Firestore connection...");

  // Try to get a simple document or collection
  db.collection("test")
    .limit(1)
    .get()
    .then((snapshot) => {
      console.log("✓ Firestore connection successful!");
      console.log("✓ Can read from Firestore");
      console.log("\n" + "=".repeat(50));
      console.log("FIREBASE CONNECTION TEST PASSED ✓");
      console.log("=".repeat(50));
      process.exit(0);
    })
    .catch((error) => {
      console.error("✗ Firestore connection failed:");
      console.error("  Error code:", error.code);
      console.error("  Error message:", error.message);

      if (error.code === 16) {
        console.error("\nThis is an authentication error. Possible solutions:");
        console.error("  1. Check if the service account key is valid");
        console.error("  2. Verify the Firebase project is active");
        console.error("  3. Ensure the service account has proper permissions");
        console.error("  4. Try regenerating the service account key");
      }

      process.exit(1);
    });
} catch (error) {
  console.error("✗ Failed to initialize Firebase:");
  console.error("  Error:", error.message);
  process.exit(1);
}
