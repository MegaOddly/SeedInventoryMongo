const mongoose = require('mongoose');

const seedInventory = require('../models/seedInventory');


// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://127.0.0.1/seedDatabase', {useNewUrlParser: true,  useUnifiedTopology: true}, ()=>{
    console.log('db connected')
});
const db= mongoose.connection;

const seedDB = async () =>{
    await seedInventory.deleteMany({});
    const c =  new seedInventory({name: 'apple', author: '6248c18244673a4a28b888f4'});
    await c.save();
}

seedDB();