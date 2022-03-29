const { text } = require('express');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;



const SeedInventorySchema = new Schema({
    seedID: {type: Number, unique : true, min:1},
    name: {type: String, unique: true},
    batchNum: {type: Number},
    experationDate: {type:Date},
    weight: {type: Number},
    wasted: {type: Number},
    planted: {type: Number},
    timeToHarves: {type: String},
    image: {type: String}
});

module.exports= mongoose.model('SeedInventory', SeedInventorySchema);