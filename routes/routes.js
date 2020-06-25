const express = require("express");
const router = express.Router();

const User = require("../config/database").model;
const passport = require("passport");
const genhash = require("../utils/passwordUtils").genpassword;

    router.post("/", (req, res) => {
        var username  = req.body.username.replace(/\s/g, "");
        var password = req.body.password.replace(/\s/g, "");
        User.findOne({"username": username}, (err, usernameQuary) => {
            if(err){
                return handleError(err);
            }
            // no user found add new one to database
            if(usernameQuary === null){
                const user = new User({
                    username: username,
                    password: genhash(password)
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
           req.session.destroy();
           res.json(false);
        }
    });

    router.post("/updatePassword", (req, res) => {
        User.findOneAndUpdate({username: req.body.username}, {password: genhash(req.body.Password)}).then(() => {
            res.send("Password Update Successful");
        });
    });
    
    router.get("/logout", (req, res) => {
        req.logout();
        req.session.destroy();
        res.send("/login");
    });
    
module.exports = router;