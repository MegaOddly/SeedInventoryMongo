module.exports.isLoggedin = (req,res,next) => {if(!req.isAuthenticated()){
    res.redirect('/');
}
next();
}