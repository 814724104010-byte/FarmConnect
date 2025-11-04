import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getDatabase, ref, push, set, onValue } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-storage.js";

// 🔥 Your Firebase configuration
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT.firebaseapp.com",
  databaseURL: "https://YOUR_PROJECT.firebaseio.com",
  projectId: "YOUR_PROJECT",
  storageBucket: "YOUR_PROJECT.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// 🔧 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);
const storage = getStorage(app);

// 🧺 Add Product Form
document.getElementById("productForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const farmerName = document.getElementById("farmerName").value;
  const productName = document.getElementById("productName").value;
  const price = document.getElementById("price").value;
  const stock = document.getElementById("stock").value;
  const imageFile = document.getElementById("image").files[0];

  let imageURL = "";
  if (imageFile) {
    const imageRef = sRef(storage, `product_images/${imageFile.name}`);
    await uploadBytes(imageRef, imageFile);
    imageURL = await getDownloadURL(imageRef);
  }

  const farmerRef = ref(db, `farmers/${farmerName}/products`);
  const newProduct = push(farmerRef);
  await set(newProduct, {
    name: productName,
    price: Number(price),
    stock: Number(stock),
    imageURL,
    createdAt: Date.now()
  });

  alert("✅ Product added successfully!");
  document.getElementById("productForm").reset();
});

// 🛒 Display Products
const productsDiv = document.getElementById("products");
const farmersRef = ref(db, "farmers");

onValue(farmersRef, (snapshot) => {
  const data = snapshot.val();
  productsDiv.innerHTML = "";

  if (!data) {
    productsDiv.innerHTML = "<p>No products yet.</p>";
    return;
  }

  for (const farmer in data) {
    for (const prodId in data[farmer].products) {
      const p = data[farmer].products[prodId];
      productsDiv.innerHTML += `
        <div class="card">
          <img src="${p.imageURL || 'https://via.placeholder.com/100'}" alt="Product Image">
          <h3>${p.name}</h3>
          <p>Farmer: ${farmer}</p>
          <p>₹${p.price}/kg — ${p.stock} kg available</p>
        </div>
      `;
    }
  }
});
