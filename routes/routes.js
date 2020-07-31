const express = require("express");
const router = express.Router();

const User = require("../config/database").model;
const passport = require("passport");
const genhash = require("../utils/passwordUtils").genpassword;

    router.post("/", (req, res) => {
        var username  = req.body.username.replace(/\s/g, "");
        var password = req.body.password.replace(/\s/g, "");
        User.findOne({username: username}, (err, usernameQuary) => {
            if(err){
                return handleError(err);
            }
            // no user found add new one to database
            if(usernameQuary === null){
                const user = new User({
                    username: username,
                    password: genhash(password),
                    bio: ""
                });
    
                user.save();
                req.session.username = username;
                req.session.destroy(); 
                res.send("success");
            }
            else{
                req.session.destroy();  
                res.send("Username already taken.");
            }
        });
    });
        
    router.post("/login", (req, res, next) => {
        passport.authenticate("local", (err, user) => {
            if (err) {
                return next(err); // Error 500
            }
    
            if (!user) {
                //Authentication failed
                req.session.destroy(); 
                return res.sendStatus(401);
            }
            //Authentication successful
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                res.send(req.user.username,);
              });
        })(req, res, next);
    });

    router.get("/userSession", (req, res) => {
        if(req.user){
            res.json(true);
        }
       else{
           req.session.destroy(() => {
               res.json(false);
           });
        }
    });

    router.get("/validUser/:user", (req, res) => {
        User.findOne({username: req.params.user}, (err, usernameQuary) => {
            if(err){
                return handleError(err);
            }
            if(usernameQuary === null){
                // send to 404 page.
                res.send(usernameQuary);
            }
            else{
                // continue to user profile.
                res.send(true);
            }
        });
    });

    router.post("/updatePassword", (req, res) => {
        User.findOneAndUpdate({username: req.body.username}, {password: genhash(req.body.Password)}).then(() => {
            res.send("Password Update Successful");
        });
    });

    router.get("/bio/:user", (req, res, next) => {
        var query = User.findOne({username: req.params.user}).select("bio");
        query.exec((err, userBio) => {
            if (err) return next(err);
            res.send(userBio);
        });
    });

    router.post("/updateBio", (req, res) => {
        User.findOneAndUpdate({username: req.body.username}, {bio: req.body.newBio}).then((bio) => {
            res.send("Bio Update Successful");
        });
    });
    
    router.get("/logout", (req, res) => {
        req.logout();
        req.session.destroy();
        res.send("/login");
    });

    router.get("/userSearch/:user", (req, res) =>{
        User.find({"username": {"$regex": req.params.user, "$options": "i"}}).then((user) => {
            var userSearch = user.map((userdata, index ) => {return user[index].username});
            res.send(userSearch);
        });
    });
    
module.exports = router;