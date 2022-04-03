



module.exports.isLoggedIn = (req,res,next) => {
    console.log("REQ.USER....", req.user);
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    next();
}


module.exports.isEmployee = (req,res,next) => {
    console.log("REQ.USER....", req.user);
    if (req.user.role === 'Employee' || req.user.role === 'Administrator') {
        next();
    }else {
        res.redirect('/dashboard')
    }
    
}
module.exports.isAdmin = (req,res,next) => {
    console.log("REQ.USER....", req.user);
    if (req.user.role === 'Administrator') {
        next();
    }else {
        res.redirect('/dashboard')
    }
    
}
