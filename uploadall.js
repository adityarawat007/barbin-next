// uploadAllProducts.js
// Upload all images from folder to Cloudinary and create Firebase documents
// Run with: node uploadAllProducts.js

// Load environment variables
require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { v2: cloudinary } = require("cloudinary");
const admin = require("firebase-admin");

// Initialize Firebase Admin
const serviceAccount = require("./barbin-furniture-firebase-adminsdk-fbsvc-034903bd51.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

// Configure Cloudinary
const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET;

// Check if all required environment variables are present
if (!cloudName || !apiKey || !apiSecret) {
  console.error("\n" + "=".repeat(50));
  console.error("✗ MISSING ENVIRONMENT VARIABLES");
  console.error("=".repeat(50));
  console.error(
    "\nThe following Cloudinary environment variables are required:"
  );
  console.error("  - NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME");
  console.error("  - NEXT_PUBLIC_CLOUDINARY_API_KEY");
  console.error("  - NEXT_PUBLIC_CLOUDINARY_API_SECRET");
  console.error("\nPlease add them to your .env.local file");
  process.exit(1);
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

async function uploadImageToCloudinary(imagePath, imageName) {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      resource_type: "image",
      quality: "auto",
      fetch_format: "auto",
      flags: "progressive",
    });

    return {
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    throw new Error(`Cloudinary upload failed: ${error.message}`);
  }
}

async function createProductDocument(imageUrl, imageName) {
  try {
    const productName = imageName
      .replace(/\.[^/.]+$/, "")
      .replace(/[-_]/g, " ");

    const product = {
      category: "In Stock",
      image: imageUrl,
      name: productName,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    const docRef = await db.collection("products").add(product);

    return {
      id: docRef.id,
      name: productName,
    };
  } catch (error) {
    throw new Error(`Firebase creation failed: ${error.message}`);
  }
}

async function processAllImages() {
  const imagesFolder = path.join(process.cwd(), "public", "Quick Turn Around");

  try {
    // Check if folder exists
    if (!fs.existsSync(imagesFolder)) {
      throw new Error(`Folder not found: ${imagesFolder}`);
    }

    // Read all files from the folder
    const files = fs.readdirSync(imagesFolder);
    const imageFiles = files.filter((file) =>
      /\.(jpg|jpeg|png|gif|webp)$/i.test(file)
    );

    if (imageFiles.length === 0) {
      console.log("No image files found in the folder.");
      return;
    }

    console.log("\n" + "=".repeat(60));
    console.log("BATCH UPLOAD - ALL IMAGES");
    console.log("=".repeat(60));
    console.log(`\nFolder: ${imagesFolder}`);
    console.log(`Total images found: ${imageFiles.length}\n`);
    console.log("=".repeat(60));

    // Process each image
    const results = {
      successful: 0,
      failed: 0,
      errors: [],
      products: [],
    };

    const startTime = Date.now();

    for (let i = 0; i < imageFiles.length; i++) {
      const fileName = imageFiles[i];
      const imageNumber = i + 1;

      console.log(
        `\n[${imageNumber}/${imageFiles.length}] Processing: ${fileName}`
      );
      console.log("-".repeat(60));

      try {
        const imagePath = path.join(imagesFolder, fileName);

        // Upload to Cloudinary
        console.log(`  ⬆️  Uploading to Cloudinary...`);
        const { url, publicId } = await uploadImageToCloudinary(
          imagePath,
          fileName
        );
        console.log(`  ✓ Uploaded successfully`);
        console.log(`     URL: ${url}`);

        // Create product in Firebase
        console.log(`  📝 Creating Firebase document...`);
        const { id, name } = await createProductDocument(url, fileName);
        console.log(`  ✓ Document created`);
        console.log(`     Product ID: ${id}`);
        console.log(`     Product Name: ${name}`);

        results.successful++;
        results.products.push({
          fileName,
          productId: id,
          productName: name,
          imageUrl: url,
        });

        console.log(`  ✅ COMPLETED [${imageNumber}/${imageFiles.length}]`);
      } catch (error) {
        console.log(`  ❌ FAILED`);
        console.log(`     Error: ${error.message}`);

        results.failed++;
        results.errors.push({
          file: fileName,
          error: error.message,
        });
      }
    }

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    // Print summary
    console.log("\n" + "=".repeat(60));
    console.log("FINAL SUMMARY");
    console.log("=".repeat(60));
    console.log(`\n📊 Statistics:`);
    console.log(`   Total images: ${imageFiles.length}`);
    console.log(`   ✅ Successful: ${results.successful}`);
    console.log(`   ❌ Failed: ${results.failed}`);
    console.log(`   ⏱️  Duration: ${duration} seconds`);
    console.log(
      `   📈 Success rate: ${(
        (results.successful / imageFiles.length) *
        100
      ).toFixed(1)}%`
    );

    if (results.successful > 0) {
      console.log(`\n✅ Successfully processed products:`);
      results.products.forEach((product, index) => {
        console.log(
          `   ${index + 1}. ${product.productName} (ID: ${product.productId})`
        );
      });
    }

    if (results.errors.length > 0) {
      console.log(`\n❌ Failed uploads:`);
      results.errors.forEach((err, index) => {
        console.log(`   ${index + 1}. ${err.file}`);
        console.log(`      Error: ${err.error}`);
      });
    }

    console.log("\n" + "=".repeat(60));
    if (results.failed === 0) {
      console.log("🎉 ALL IMAGES PROCESSED SUCCESSFULLY!");
    } else {
      console.log("⚠️  COMPLETED WITH SOME ERRORS");
    }
    console.log("=".repeat(60) + "\n");
  } catch (error) {
    console.error("\n" + "=".repeat(60));
    console.error("❌ FATAL ERROR");
    console.error("=".repeat(60));
    console.error("\nError:", error.message);
    console.error("\nPlease check:");
    console.error("  1. Firebase service account key exists");
    console.error("  2. Cloudinary credentials are correct");
    console.error('  3. Folder "public/Quick Turn Around" exists');
    console.error("  4. You have internet connection");
    console.error("=".repeat(60) + "\n");
  }
}

// Run the script
processAllImages()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
