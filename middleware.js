
module.exports.isLoggedIn = (req,res,next) => {
    
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    next();
}


module.exports.isEmployee = (req,res,next) => {
    
    if (req.user.role === 'Employee' || req.user.role === 'Administrator') {
        next();
    }else {
        res.redirect('/dashboard')
    }
    
}
module.exports.isAdmin = (req,res,next) => {
    
    if (req.user.role === 'Administrator') {
        next();
    }else {
        res.redirect('/dashboard')
    }
    
}
