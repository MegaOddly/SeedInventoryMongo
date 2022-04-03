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
    image: String,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'}
});

module.exports= mongoose.model('SeedInventory', SeedInventorySchema);
