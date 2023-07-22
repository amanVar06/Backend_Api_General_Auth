const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const employeeSchema = new Schema({
  firstname: {
    type: String,
    required: true,
  },
  lastname: {
    type: String,
    required: true,
  },
});
/**
 * Mongoose automatically looks for the plural, lowercased version of your model name.
 */

module.exports = mongoose.model("Employee", employeeSchema);
//by default mongoose when create this model will set this Employee
//to lower case and plural, like employees
//so will look for employees collection in mongoDB
