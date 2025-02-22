const { data } = require("./data");
const mongoose = require("mongoose");
const Listing = require("../models/listing");

async function main() {
  try {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
    console.log("database connected!");
  } catch (err) {
    console.log(err);
  }
}
main();

async function initData() {
  try {
    await Listing.deleteMany({})
    let newData = data.map(doc=>{
      return {...doc,owner:'67b6d0f4a0f381dd0909e822'}
    })
    await Listing.insertMany(newData)
  } catch (err) {
    console.log(err);
  }
}

// initData();

