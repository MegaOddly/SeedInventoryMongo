const express = require('express');
const app = express();
const path=require('path');
const mongoose = require('mongoose');

const seedInventory = require('./models/seedInventory');


// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://127.0.0.1/seedDatabase', {useNewUrlParser: true,  useUnifiedTopology: true}, ()=>{
    console.log('db connected')
});
const db= mongoose.connection;

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));

app.get('/', (req,res)=>{
    res.render('login')
})
app.get('/dashboard', async(req,res)=>{
    const seeds = await seedInventory.find({});
    res.render('dashboard', {seeds});
})


app.get('/addseeds', (req,res)=>{
    res.render('addseeds');
})
app.post('/dashboard', async(req,res)=>{
    const newseed = new seedInventory(req.body);
    await newseed.save();
    res.redirect('/dashboard')
})



app.listen(3000,()=>{
    console.log('listening on port 3000')
})
