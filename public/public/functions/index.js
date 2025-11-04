const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Log every new order (optional)
exports.logNewProduct = functions.database.ref('/farmers/{farmerId}/products/{productId}')
  .onCreate((snapshot, context) => {
    const product = snapshot.val();
    console.log(`🌾 New product added by ${context.params.farmerId}: ${product.name}`);
    return null;
  });
