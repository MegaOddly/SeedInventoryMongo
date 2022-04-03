const { text } = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const SeedInventorySchema = new Schema({
    seedID: Number,
    name: String, 
    batchNum: String,
    experationDate: Date,
    weight: Number,
    wasted: Number,
    planted: Number,
    timeToHarvest: String,
    image: String
});

module.exports= mongoose.model('SeedInventory', SeedInventorySchema);
