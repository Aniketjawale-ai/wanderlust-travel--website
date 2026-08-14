const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
//const { saveRedirectUrl } = require("../middleware.js");
const { saveRedirectUrl } = require("../middleware.js");


router.get("/signup", (req, res) =>{
    res.render("users/signup.ejs");
});

// router.post("/signup", async(req, res) =>{
//     res.render("users/signup.ejs");
// });

router.post("/signup", wrapAsync( async(req, res , next) =>{

    try{
    let {username, email, password} = req.body;
    const newUser = new User({email, username});
    const registereUser = await User.register(newUser , password);
    console.log(registereUser);
    req.login(registereUser, (err) =>{
        if(err) {
            return next(err);
        }
         req.flash("success", "Welcome to Wanderlust!");
         res.redirect("/listings");
    });
   
    } catch(e){
        req.flash("error", e.message);
        res.redirect("/signup");

    }
}));
router.get("/login",(req,res) =>{
    res.render("users/login.ejs");
 });


 router.post(
    "/login",
    saveRedirectUrl,
    passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: true
    }),
    (req, res) => {
        req.flash("success", "Welcome back to Wanderlust!");

        let redirectUrl = res.locals.redirectUrl || "/listings";

        // delete req.session.redirectUrl;

        res.redirect(redirectUrl);
    }
);

//  router.post(
//     "/login",
//     saveRedirectUrl,
   
//      passport.authenticate("local",{
//          failureRedirect:"/login",
//          failureFlash: true ,
//         }),

//    async (req,res) =>{
//     req.flash("success", "welcome back to wanderlust");
//   res.redirect(res.locals.saveRedirectUrl);

    

//  }
// );


 router.get("/logout", (req, res, next) => {
    req.logout((err) => {
        if (err) {
            return next(err);
        }

        req.flash("success", "You have been logged out!");
        res.redirect("/listings");
    });
});


module.exports = router;