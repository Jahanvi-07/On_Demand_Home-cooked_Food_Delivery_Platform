const mongoose = require("mongoose");

const mongoURI =
  "mongodb+srv://durgeshraj0852:durgeshraj0852@cluster0.2tcmen9.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// No need to use deprecated options like useNewUrlParser and useUnifiedTopology (Mongoose 6+)
const mongoDB = async () => {
  try {
    await mongoose.connect(mongoURI);
    console.log("MongoDB connected");

    // Fetch food items from 'items' collection
    const fetched_data = await mongoose.connection.db
      .collection("items")
      .find({})
      .toArray();
    global.food_items = fetched_data;
    console.log("Food items loaded:", global.food_items.length);

    // Fetch food categories from 'categories' collection
    const foodCategory = await mongoose.connection.db
      .collection("categories")
      .find({})
      .toArray();
    global.food_category = foodCategory;
    console.log("Food categories loaded:", global.food_category.length);
  } catch (err) {
    console.error("Error connecting to MongoDB:", err);
    throw err;
  }
};

module.exports = mongoDB;
