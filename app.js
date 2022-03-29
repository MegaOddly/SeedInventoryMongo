const express = require('express');
const app = express();
const path=require('path');
const mongoose = require('mongoose');

const seedInventory = require('./models/seedInventory');


// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://127.0.0.1/seedInventory', {useNewUrlParser: true,  useUnifiedTopology: true}, ()=>{
    console.log('db connected')
});
const db= mongoose.connection;

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));


app.get('/', (req,res)=>{
    res.render('login')
})
app.get('/addSeed', async(req,res)=>{
    const seed= new seedInventory({name: 'Pumpkin'});
    await seed.save();
    res.send(seed);
})



app.listen(3000,()=>{
    console.log('listening on port 3000')
})