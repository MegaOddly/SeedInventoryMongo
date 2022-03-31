const express = require('express');
const app = express();
const path=require('path');
const mongoose = require('mongoose');
const methodOverride =  require('method-override')

const seedInventory = require('./models/seedInventory');
const { request } = require('http');
const { serializeWithBufferAndIndex } = require('bson');


mongoose.set('useFindAndModify', false)
// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://127.0.0.1/seedDatabase', {useNewUrlParser: true,  useUnifiedTopology: true}, ()=>{
    console.log('db connected')
});
const db= mongoose.connection;

app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride('_method'));




//login
app.get('/', (req,res)=>{
    res.render('login')
})
//all
app.get('/dashboard', async(req,res)=>{
    const seeds = await seedInventory.find({});
    res.render('dashboard', {seeds});
})
app.get('/dashboard/:id', async(req,res)=>{
    const seeds = await seedInventory.findById(req.params.id);
    res.render('show',{seeds});
})


//only admins and employees
app.get('/addseeds', (req,res)=>{
    res.render('addseeds');
})
app.post('/dashboard', async(req,res)=>{
    const seeds = new seedInventory(req.body.seeds);
    await seeds.save();
    res.send({seeds})
})
//only admins and employees
app.get('/dashboard/:id/edit', async(req,res) =>{
    const seeds = await seedInventory.findById(req.params.id);
    res.render('edit',{seeds});
})

app.put('/dashboard/:id', async(req,res)=>{
    var seedID = req.body.seeds,
        name = req.body.name,
        batchNum =req.body.batchNum,
        experationDate = req.body.experationDate,
        weight = req.body.weight,
        wasted = req.body.wasted,
        planted = req.body.planted,
        timeToHarvest = req.body.timeToHarvest,
        image = req.body.image;
    const seeds = await seedInventory(seedID,name,batchNum,experationDate,weight, wasted,planted,timeToHarvest,image);
    
     const seedupdated = await seedInventory.findOneAndUpdate(seedInventory.findById(req.params.id),{seeds});
      res.send({seedupdated})
    // await seeds.save();
    // res.redirect(`/dashboard`) ;
})



app.listen(3000,()=>{
    console.log('listening on port 3000')
})
