const express = require('express');
const session = require('express-session');
const app = express();
const path=require('path');
const mongoose = require('mongoose');
const methodOverride =  require('method-override');
const seedInventory = require('./models/seedInventory');
const { request } = require('http');
const passport = require('passport');
const LocalsStrategy = require('passport-local');
const User = require('./models/user');
const flash = require('connect-flash');
const isLoggedIn = require('./middleware')

/*/  Database */
mongoose.set('useFindAndModify', false)
// Connect MongoDB at default port 27017.
mongoose.connect('mongodb://127.0.0.1/seedDatabase', {useNewUrlParser: true,  useUnifiedTopology: true}, ()=>{
    console.log('db connected')
});
const db= mongoose.connection;
/*/  app.sets */
app.set('view engine', 'ejs');
app.set('views',path.join(__dirname, 'views'));
app.use(express.urlencoded({extended: true}));
app.use(express.json());
//used to inturrupt the POST method to make a put method in its place
app.use(methodOverride('_method'));




/*/  Passport Configuration  */
const sessionConfig = {
    secret: 'secretcode',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalsStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


/*/  This is the start of the routes */
//login
app.get('/', (req,res)=>{
    res.render('login')
})

app.get('/register', (req,res) => {
    res.render('register');
})

app.post('/register', async (req,res)=> {
    const {email, username, password, role} = req.body;
    const user = new User({email,username,role});
    const registeredUser = await User.register(user, password);
    res.redirect('/');
})

app.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/'}),(req,res) =>{
    res.redirect('/dashboard');
})




//all
app.get('/dashboard' , async(req,res)=>{
    if(!req.isAuthenticated()){
        return res.redirect('/');
    }


    const seeds = await seedInventory.find({});
    res.render('dashboard', {seeds});
})
//all
app.get('/dashboard/:id', async(req,res)=>{
    if(!req.isAuthenticated()){
        return res.redirect('/');
    }


    const seeds = await seedInventory.findById(req.params.id);
    res.render('show',{seeds});
})


//only admins and employees
app.get('/addseeds', (req,res)=>{
    if(!req.isAuthenticated()){
        return res.redirect('/');
    }
    res.render('addseeds');
})
//only admins and employees
app.post('/dashboard', async(req,res)=>{
    if(!req.isAuthenticated()){
        res.redirect('/');
    }

    const seeds = new seedInventory(req.body.seeds);
    await seeds.save();
    res.redirect(`/dashboard/${seeds._id}`)
})
//only admins and employees
app.get('/dashboard/:id/edit', async(req,res) =>{
    if(!req.isAuthenticated()){
        return res.redirect('/');
    }

    const seeds = await seedInventory.findById(req.params.id);
    res.render('edit',{seeds});
})
//only admins and employees
app.put('/dashboard/:id', async(req,res)=>{
    if(!req.isAuthenticated()){
        return res.redirect('/');
    }

    var seedID = req.body.seeds,
        name = req.body.name,
        batchNum =req.body.batchNum,
        experationDate = req.body.experationDate,
        weight = req.body.weight,
        wasted = req.body.wasted,
        planted = req.body.planted,
        timeToHarvest = req.body.timeToHarvest,
        image = req.body.image;
    const seeds = await seedInventory.findById(req.params.id);
    const update = await seedInventory.updateOne(seedInventory.findById(req.params.id), 
        seedID,name,batchNum,experationDate,weight,timeToHarvest,image);
    res.redirect(`/dashboard/${seeds._id}`);
})

app.delete('/dashboard/:id', async (req,res) => {
    if(!req.isAuthenticated()){
        return res.redirect('/');
    }

    const seeds = await seedInventory.findById(req.params.id);
    await seedInventory.findByIdAndDelete(seeds);
    res.redirect('/dashboard');
})



app.listen(3000,()=>{
    console.log('listening on port 3000')
})
