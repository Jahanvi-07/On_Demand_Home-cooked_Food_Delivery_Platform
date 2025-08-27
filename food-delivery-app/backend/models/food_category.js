const mongoose = require("mongoose");

const { Schema } = mongoose;

const FoodCategorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  }
});

module.exports = mongoose.model("food_category", FoodCategorySchema);
