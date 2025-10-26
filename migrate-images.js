require("dotenv").config();
const admin = require("firebase-admin");
const { v2: cloudinary } = require("cloudinary");
const path = require("path");
const https = require("https");
const http = require("http");

// Initialize Firebase Admin SDK
const serviceAccount = require("./serviceAccountKey.json");
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Initialize Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

const db = admin.firestore();

class ImageMigrator {
  constructor() {
    this.processedCount = 0;
    this.errorCount = 0;
    this.skippedCount = 0;
    this.debugMode = process.argv.includes("--debug");
  }

  // Check if URL is an Amazon S3/AWS URL
  isAmazonUrl(url) {
    if (!url || typeof url !== "string") {
      if (this.debugMode)
        console.log(
          `  DEBUG: Not a valid string URL: ${url} (type: ${typeof url})`
        );
      return false;
    }

    const isAmazon =
      url.includes("amazonaws.com") ||
      url.includes("s3.") ||
      url.includes(".s3-") ||
      url.includes("niligiri-tourism.s3.amazonaws.com");

    if (this.debugMode) {
      console.log(`  DEBUG: URL "${url}" is Amazon URL: ${isAmazon}`);
    }

    return isAmazon;
  }

  // Extract file extension from URL
  getFileExtension(url) {
    try {
      const pathname = new URL(url).pathname;
      const ext = path.extname(pathname);
      return ext || ".jpg"; // Default to .jpg if no extension
    } catch {
      return ".jpg";
    }
  }

  // Generate unique public ID for Cloudinary
  generatePublicId(originalUrl, docId, fieldPath) {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    return `migrated/${docId}/${fieldPath}/${timestamp}_${random}`;
  }

  // Download image from URL using built-in modules
  async downloadImage(url) {
    return new Promise((resolve, reject) => {
      try {
        const client = url.startsWith("https:") ? https : http;

        const request = client.get(
          url,
          {
            timeout: 30000,
            headers: {
              "User-Agent": "Mozilla/5.0 (compatible; ImageMigrator/1.0)",
            },
          },
          (response) => {
            // Handle redirects
            if (
              response.statusCode >= 300 &&
              response.statusCode < 400 &&
              response.headers.location
            ) {
              this.downloadImage(response.headers.location)
                .then(resolve)
                .catch(reject);
              return;
            }

            if (response.statusCode !== 200) {
              reject(
                new Error(
                  `HTTP ${response.statusCode}: ${response.statusMessage}`
                )
              );
              return;
            }

            const contentType = response.headers["content-type"];
            if (!contentType || !contentType.startsWith("image/")) {
              reject(new Error(`Invalid content type: ${contentType}`));
              return;
            }

            const chunks = [];
            response.on("data", (chunk) => chunks.push(chunk));
            response.on("end", () => {
              const buffer = Buffer.concat(chunks);
              resolve(buffer);
            });
            response.on("error", (error) => {
              reject(new Error(`Response error: ${error.message}`));
            });
          }
        );

        request.on("error", (error) => {
          reject(new Error(`Request error: ${error.message}`));
        });

        request.on("timeout", () => {
          request.destroy();
          reject(new Error("Request timeout"));
        });
      } catch (error) {
        reject(new Error(`Failed to download image: ${error.message}`));
      }
    });
  }

  // Upload image to Cloudinary
  async uploadToCloudinary(imageBuffer, publicId) {
    return new Promise((resolve, reject) => {
      cloudinary.uploader
        .upload_stream(
          {
            public_id: publicId,
            resource_type: "image",
            quality: "auto",
            fetch_format: "auto",
            flags: "progressive",
          },
          (error, result) => {
            if (error) {
              reject(new Error(`Cloudinary upload failed: ${error.message}`));
            } else {
              resolve(result.secure_url);
            }
          }
        )
        .end(imageBuffer);
    });
  }

  // Process a single image URL
  async processImageUrl(url, docId, fieldPath) {
    try {
      if (!this.isAmazonUrl(url)) {
        console.log(`❌ Skipping non-Amazon URL: ${url}`);
        this.skippedCount++;
        return url; // Return original URL unchanged
      }

      console.log(`🚀 Processing Amazon URL: ${url}`);
      console.log(`   📍 Document: ${docId}, Field: ${fieldPath}`);

      // Download image
      console.log(`   📥 Downloading image...`);
      const imageBuffer = await this.downloadImage(url);
      console.log(`   ✅ Downloaded ${imageBuffer.length} bytes`);

      // Generate unique public ID
      const publicId = this.generatePublicId(url, docId, fieldPath);
      console.log(`   🏷️  Generated public ID: ${publicId}`);

      // Upload to Cloudinary
      console.log(`   ☁️  Uploading to Cloudinary...`);
      const cloudinaryUrl = await this.uploadToCloudinary(
        imageBuffer,
        publicId
      );

      console.log(`   ✅ Successfully migrated!`);
      console.log(`   📤 Old URL: ${url}`);
      console.log(`   📥 New URL: ${cloudinaryUrl}`);
      this.processedCount++;

      return cloudinaryUrl;
    } catch (error) {
      console.error(`✗ Failed to process ${url}:`, error.message);
      console.error(`   Error details:`, error);
      this.errorCount++;
      return url; // Return original URL on error
    }
  }

  // Recursively find and process image URLs in nested objects
  async processNestedObject(obj, docId, basePath = "") {
    if (this.debugMode) {
      console.log(
        `  DEBUG: Processing object at path "${basePath}", type: ${typeof obj}, isArray: ${Array.isArray(
          obj
        )}`
      );
      if (typeof obj === "string") {
        console.log(`  DEBUG: String value: "${obj}"`);
      }
    }

    // Handle string values (potential URLs)
    if (typeof obj === "string") {
      if (this.isAmazonUrl(obj)) {
        console.log(`🎯 Found Amazon URL at ${basePath}: ${obj}`);
        console.log(`   🔄 Starting migration process...`);
        const newUrl = await this.processImageUrl(obj, docId, basePath);
        console.log(
          `   🔄 Migration result: ${obj === newUrl ? "UNCHANGED" : "CHANGED"}`
        );
        if (obj !== newUrl) {
          console.log(
            `   ✅ URL successfully changed from ${obj} to ${newUrl}`
          );
        }
        return newUrl;
      }
      return obj;
    }

    if (!obj || typeof obj !== "object") return obj;

    if (Array.isArray(obj)) {
      const results = [];
      for (let i = 0; i < obj.length; i++) {
        const fieldPath = `${basePath}[${i}]`;
        if (this.debugMode)
          console.log(
            `  DEBUG: Processing array item ${i} at path "${fieldPath}"`
          );
        const processedItem = await this.processNestedObject(
          obj[i],
          docId,
          fieldPath
        );
        results[i] = processedItem;
      }
      return results;
    }

    const result = {};
    for (const [key, value] of Object.entries(obj)) {
      const fieldPath = basePath ? `${basePath}.${key}` : key;

      if (this.debugMode) {
        console.log(
          `  DEBUG: Processing field "${key}" at path "${fieldPath}", value type: ${typeof value}`
        );
        if (typeof value === "string") {
          console.log(`  DEBUG: String value: "${value}"`);
        }
      }

      if (typeof value === "string" && this.isAmazonUrl(value)) {
        console.log(`🎯 Found Amazon URL at ${fieldPath}: ${value}`);
        console.log(`   🔄 Starting migration process...`);
        // Process image URL
        const newUrl = await this.processImageUrl(value, docId, fieldPath);
        result[key] = newUrl;
        console.log(
          `   🔄 Migration result: ${
            value === newUrl ? "UNCHANGED" : "CHANGED"
          }`
        );
        if (value !== newUrl) {
          console.log(
            `   ✅ URL successfully changed from ${value} to ${newUrl}`
          );
        }
      } else if (typeof value === "object" && value !== null) {
        // Recursively process nested objects/arrays
        result[key] = await this.processNestedObject(value, docId, fieldPath);
      } else {
        // Keep other values unchanged
        result[key] = value;
      }
    }
    return result;
  }

  // Process a single Firestore document
  async processDocument(doc) {
    try {
      const docId = doc.id;
      const data = doc.data();

      console.log(`\n--- Processing document: ${docId} ---`);

      if (this.debugMode) {
        console.log(`Document structure:`, JSON.stringify(data, null, 2));
      }

      // First, let's check what Amazon URLs exist in this document
      const amazonUrls = this.findAmazonUrls(data);
      console.log(
        `📋 Document ${docId} contains ${amazonUrls.length} Amazon URLs:`
      );
      amazonUrls.forEach((url, index) => console.log(`  ${index + 1}. ${url}`));

      if (amazonUrls.length === 0) {
        console.log(`- Document ${docId} has no Amazon URLs to migrate`);
        return;
      }

      console.log(`🔄 Starting processing of document ${docId}...`);

      // Enable debug mode temporarily for this processing
      const originalDebugMode = this.debugMode;
      this.debugMode = true;

      // Process all fields in the document
      const updatedData = await this.processNestedObject(data, docId);

      // Restore original debug mode
      this.debugMode = originalDebugMode;

      console.log(`📊 Processing completed for document ${docId}`);

      // Check if any URLs were actually changed
      const originalJson = JSON.stringify(data);
      const updatedJson = JSON.stringify(updatedData);
      const hasChanges = originalJson !== updatedJson;

      console.log(`🔍 Comparing original vs updated data...`);
      console.log(`   Original data length: ${originalJson.length} chars`);
      console.log(`   Updated data length: ${updatedJson.length} chars`);
      console.log(`   Has changes: ${hasChanges}`);

      if (hasChanges) {
        console.log(`💾 Updating document ${docId} in Firestore...`);
        // Update the document in Firestore
        await doc.ref.update(updatedData);
        console.log(`✅ Document ${docId} updated successfully in Firestore`);

        // Show what changed
        const originalUrls = this.findAmazonUrls(data);
        const updatedUrls = this.findAmazonUrls(updatedData);
        console.log(`📈 Migration summary:`);
        console.log(`   Original Amazon URLs: ${originalUrls.length}`);
        console.log(`   Updated Amazon URLs: ${updatedUrls.length}`);
        console.log(
          `   Successfully migrated: ${
            originalUrls.length - updatedUrls.length
          }`
        );
      } else {
        console.log(`❌ Document ${docId} had no changes after processing`);
        console.log(
          `🔍 This might indicate an error in processing. Let's check why:`
        );

        // Debug: Let's see if the URLs are still Amazon URLs after processing
        const stillAmazonUrls = this.findAmazonUrls(updatedData);
        console.log(
          `   Amazon URLs still present after processing: ${stillAmazonUrls.length}`
        );
        stillAmazonUrls.forEach((url, index) => {
          console.log(`   ${index + 1}. ${url}`);
        });
      }
    } catch (error) {
      console.error(`✗ Failed to process document ${doc.id}:`, error.message);
      console.error(`Error stack:`, error.stack);
      this.errorCount++;
    }
  }

  // Process all documents in a collection
  async processCollection(collectionName, batchSize = 10, testMode = false) {
    try {
      console.log(`\n🚀 Starting migration for collection: ${collectionName}`);

      const snapshot = await db.collection(collectionName).get();
      let docs = snapshot.docs;

      console.log(
        `📄 Found ${docs.length} documents in collection ${collectionName}`
      );

      if (testMode) {
        // In test mode, find the first document with Amazon URLs
        const docWithAmazonUrls = docs.find((doc) => {
          const amazonUrls = this.findAmazonUrls(doc.data());
          return amazonUrls.length > 0;
        });

        if (docWithAmazonUrls) {
          docs = [docWithAmazonUrls];
          console.log(
            `🧪 TEST MODE: Processing only document ${docWithAmazonUrls.id}`
          );
          const amazonUrls = this.findAmazonUrls(docWithAmazonUrls.data());
          console.log(
            `Found ${amazonUrls.length} Amazon URLs in this document:`
          );
          amazonUrls.forEach((url) => console.log(`  - ${url}`));
        } else {
          console.log(
            `🧪 TEST MODE: No documents with Amazon URLs found in collection ${collectionName}`
          );
          return;
        }
      } else {
        console.log(`Found ${docs.length} documents to process`);
      }

      // Process documents in batches to avoid overwhelming the APIs
      for (let i = 0; i < docs.length; i += batchSize) {
        const batch = docs.slice(i, i + batchSize);
        if (!testMode) {
          console.log(
            `\nProcessing batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(
              docs.length / batchSize
            )}`
          );
        }

        // Process batch concurrently
        await Promise.all(batch.map((doc) => this.processDocument(doc)));

        // Add delay between batches to be respectful to APIs
        if (i + batchSize < docs.length) {
          console.log("Waiting 2 seconds before next batch...");
          await new Promise((resolve) => setTimeout(resolve, 2000));
        }
      }
    } catch (error) {
      console.error(
        `Failed to process collection ${collectionName}:`,
        error.message
      );
    }
  }

  // Process multiple collections
  async processCollections(collectionNames, batchSize = 10, testMode = false) {
    console.log("🔥 Firebase to Cloudinary Image Migration Started");
    console.log("================================================");

    const startTime = Date.now();

    for (const collectionName of collectionNames) {
      await this.processCollection(collectionName, batchSize, testMode);

      // In test mode, stop after first collection with results
      if (testMode && this.processedCount > 0) {
        break;
      }
    }

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    console.log("\n================================================");
    console.log(
      testMode ? "🧪 Test Migration Complete!" : "🎉 Migration Complete!"
    );
    console.log(`⏱️  Total time: ${duration}s`);
    console.log(`✅ Images processed: ${this.processedCount}`);
    console.log(`⚠️  Images skipped: ${this.skippedCount}`);
    console.log(`❌ Errors: ${this.errorCount}`);
    console.log("================================================");
  }

  // Enhanced dry run mode with better debugging
  async dryRun(collectionNames) {
    console.log("🔍 DRY RUN MODE - No changes will be made");
    console.log("=========================================");

    let totalAmazonUrls = 0;
    let totalDocs = 0;

    for (const collectionName of collectionNames) {
      console.log(`\nAnalyzing collection: ${collectionName}`);

      const snapshot = await db.collection(collectionName).get();
      const docs = snapshot.docs;
      totalDocs += docs.length;

      console.log(`📄 Found ${docs.length} documents in collection`);

      for (const doc of docs) {
        const data = doc.data();
        console.log(`\n📋 Document ${doc.id}:`);

        if (this.debugMode) {
          console.log(
            `  Full document structure:`,
            JSON.stringify(data, null, 2)
          );
        }

        const amazonUrls = this.findAmazonUrls(data);

        if (amazonUrls.length > 0) {
          console.log(`  ✅ ${amazonUrls.length} Amazon URLs found:`);
          amazonUrls.forEach((url, index) =>
            console.log(`    ${index + 1}. ${url}`)
          );
          totalAmazonUrls += amazonUrls.length;
        } else {
          console.log(`  ❌ No Amazon URLs found`);

          // Let's check what's in the images array specifically
          if (data.images && Array.isArray(data.images)) {
            console.log(
              `  🔍 Images array contains ${data.images.length} items:`
            );
            data.images.forEach((img, index) => {
              console.log(
                `    ${index}. "${img}" (type: ${typeof img}, isAmazon: ${this.isAmazonUrl(
                  img
                )})`
              );
            });
          } else {
            console.log(`  ⚠️  No 'images' array found in document`);
          }
        }
      }
    }

    console.log(`\n📊 SUMMARY:`);
    console.log(`  Total documents analyzed: ${totalDocs}`);
    console.log(`  Total Amazon URLs found: ${totalAmazonUrls}`);
    console.log("=========================================");
  }

  // Helper function to find all Amazon URLs in a document
  findAmazonUrls(obj, urls = [], currentPath = "") {
    if (typeof obj === "string" && this.isAmazonUrl(obj)) {
      urls.push(obj);
      if (this.debugMode) {
        console.log(
          `  DEBUG: Found Amazon URL at path "${currentPath}": ${obj}`
        );
      }
    } else if (Array.isArray(obj)) {
      obj.forEach((item, index) => {
        const path = currentPath ? `${currentPath}[${index}]` : `[${index}]`;
        this.findAmazonUrls(item, urls, path);
      });
    } else if (typeof obj === "object" && obj !== null) {
      Object.entries(obj).forEach(([key, value]) => {
        const path = currentPath ? `${currentPath}.${key}` : key;
        this.findAmazonUrls(value, urls, path);
      });
    }
    return urls;
  }
}

// Main execution function
async function main() {
  try {
    // Configuration
    const COLLECTIONS_TO_MIGRATE = ["products"];

    const BATCH_SIZE = 5; // Number of documents to process concurrently
    const DRY_RUN = process.argv.includes("--dry-run");
    const TEST_MODE = process.argv.includes("--test"); // New test mode flag
    const DEBUG_MODE = process.argv.includes("--debug"); // Enhanced debugging

    if (DEBUG_MODE) {
      console.log("🐛 DEBUG MODE ENABLED - Extra logging will be shown");
    }

    // Validate environment variables
    const requiredEnvVars = [
      "NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME",
      "NEXT_PUBLIC_CLOUDINARY_API_KEY",
      "NEXT_PUBLIC_CLOUDINARY_API_SECRET",
    ];

    const missingVars = requiredEnvVars.filter(
      (varName) => !process.env[varName]
    );
    if (missingVars.length > 0) {
      throw new Error(
        `Missing required environment variables: ${missingVars.join(", ")}`
      );
    }

    console.log("✅ Environment variables validated");
    console.log("✅ Firebase initialized");
    console.log("✅ Cloudinary initialized");

    const migrator = new ImageMigrator();

    if (DRY_RUN) {
      await migrator.dryRun(COLLECTIONS_TO_MIGRATE);
    } else if (TEST_MODE) {
      console.log(
        "🧪 Running in TEST MODE - will migrate only 1 document with Amazon URLs"
      );
      await migrator.processCollections(
        COLLECTIONS_TO_MIGRATE,
        BATCH_SIZE,
        true
      );
    } else {
      await migrator.processCollections(COLLECTIONS_TO_MIGRATE, BATCH_SIZE);
    }
  } catch (error) {
    console.error("Migration failed:", error.message);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log("\n⚠️ Migration interrupted by user");
  process.exit(0);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled rejection:", error);
  process.exit(1);
});

// Export for use in other modules
module.exports = { ImageMigrator };

// Run if called directly
if (require.main === module) {
  main();
}
