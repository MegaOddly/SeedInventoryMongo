module.exports.isLoggedIn = (req,res,next) => {
    console.log("REQ.USER....", req.user);
    if (!req.isAuthenticated()) {
        return res.redirect('/')
    }
    next();
}