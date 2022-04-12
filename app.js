const express = require('express');
const session = require('express-session');
const app = express();
const path=require('path');
// const populate = require('mongoose-populate')
const mongoose = require('mongoose');
const {Schema} = mongoose;
const methodOverride =  require('method-override');
const seedInventory = require('./models/seedInventory');
const { request } = require('http');
const passport = require('passport');
const LocalsStrategy = require('passport-local');
const User = require('./models/user');
const flash = require('connect-flash');
const { isLoggedIn, isEmployee, isAdmin } = require('./middleware');






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

app.use(flash());
app.use((req,res,next) => {
    console.log(req.session);
    res.locals.currentUser = req.user;
    res.locals.error = req.flash('error');
    res.locals.success = req.flash("Success");
    next();
})


/*/  This is the start of the routes */
//login


app.get('/register', isLoggedIn, isAdmin, (req,res) => {
    res.render('register');
})

app.post('/register', isLoggedIn, isAdmin, async (req,res)=> {
    try {
    const {email, username, password, role} = req.body;
    const user = new User({email,username,role});
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, err => {
        if (err) return next(err);
        console.log(registeredUser);
        res.redirect('/dashboard');
    });
    } catch(error) {
        req.flash('error', "User is already taken.");
        res.redirect('register');
    }
    
})

app.get('/', (req,res)=>{
    res.render('login')
})
 
app.post('/login', passport.authenticate('local',{failureFlash: true, failureRedirect: '/'}),(req,res) =>{
    const redirectUrl = req.session.returnTo || '/dashboard';
    res.redirect(redirectUrl);
})

app.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/');
})


//all
app.get('/dashboard' , isLoggedIn, async(req,res)=>{
    
    const seeds = await seedInventory.find({});
    res.render('dashboard', {seeds});
})
//all
app.get('/dashboard/:id', isLoggedIn,  async(req,res)=>{
    
    const seeds = await seedInventory.findById(req.params.id);
    console.log(seeds);
    res.render('show',{seeds});

})
//user list pages 
app.get('/userlist' , isLoggedIn,isAdmin, async(req,res)=>{
    const users = await User.find({});
    res.render('userlist', {users});
})
app.get('/userlist/:id', isLoggedIn, isAdmin, async(req,res)=>{
    const users = await User.findById(req.params.id);
    res.render('showusers',{users});
})

//only admins and employees
app.get('/addseeds', isLoggedIn , isEmployee , (req,res)=>{
    
    res.render('addseeds');
})
app.get('/wastedreport', isLoggedIn, isAdmin, async (req,res)=>{
    var leaderboard = await seedInventory.find().sort({wasted: -1}).limit(5);
    res.render( 'wastedseeds' ,{leaderboard});
})

app.get('/plantedreport',isLoggedIn, isAdmin, async (req,res)=>{
    var leaderboard = await seedInventory.find().sort({planted: -1}).limit(5);
    res.render( 'plantedseeds' ,{leaderboard});
})
//only admins and employees
app.post('/dashboard', isLoggedIn ,async(req,res)=>{
    

    const seeds = new seedInventory(req.body.seeds);
    await seeds.save();
    res.redirect(`/dashboard/${seeds._id}`)
})
//only admins and employees
app.get('/dashboard/:id/edit', isLoggedIn , isEmployee, async(req,res) =>{

    const seeds = await seedInventory.findById(req.params.id);
    console.log(seeds);
    res.render('edit',{seeds});
})
//only admins and employees
app.put('/dashboard/:id', isLoggedIn ,isEmployee, async(req,res)=>{

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
        seedID,name,batchNum,experationDate,wasted, planted,weight,timeToHarvest,image);
    
    res.redirect(`/dashboard/${seeds._id}`);
})

app.delete('/dashboard/:id', isLoggedIn, isEmployee, async (req,res) => {
    const seeds = await seedInventory.findById(req.params.id);
    console.log(seeds);
    await seedInventory.findByIdAndDelete(seeds);
    res.redirect('/dashboard');
})
app.delete('/userlist/:id', isLoggedIn, isAdmin, async (req,res) => {
    const users = await User.findById(req.params.id);
    
    await User.findByIdAndDelete(users);
    res.redirect('/userlist');
})

app.get('/notifyreport',isLoggedIn, async (req,res)=>{
    
    var leaderboard = await seedInventory.find({weight: {$lte:500}});
    res.render('notifyreport', {leaderboard})
})




app.listen(3000,()=>{
    console.log('listening on port 3000')
})
