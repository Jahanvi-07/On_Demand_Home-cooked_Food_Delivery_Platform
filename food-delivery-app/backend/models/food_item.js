const mongoose = require("mongoose");

const { Schema } = mongoose;

const FoodItemSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  price: {
    type: Number,
    required: true
  },
  category: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model("food_items", FoodItemSchema);
