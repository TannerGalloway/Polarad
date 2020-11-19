const express = require("express");
const router = express.Router();
const cookieParams = {
    httpOnly: false,
    signed: true
  }

const User = require("../config/database").model;
const passport = require("passport");
const genhash = require("../utils/passwordUtils").genpassword;

    router.post("/", (req, res) => {
        var username  = req.body.username.replace(/\s/g, "");
        var password = req.body.password.replace(/\s/g, "");
        User.findOne({"username": {"$regex": username, "$options": "i"}}, (err, usernameQuary) => {
            if(err){
                return handleError(err);
            }
            // no user found add new one to database
            if(usernameQuary === null){
                const user = new User({
                    username: username,
                    password: genhash(password),
                    bio: "",
                    loggedin: false
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
                User.findOneAndUpdate({username: req.user.username}, {loggedin: true}).then(() => {
                    res.cookie("userSession", {"status": true, "user": req.user.username});
                    res.send(req.user.username);
                });
              });
        })(req, res, next);
    });

    // create/update cookie for user auth
    router.get("/userSession", (req, res) => {
        if(!req.user){
            req.session.destroy(() => {
                res.cookie("userSession", {"status": false, "user": ""});
                res.json(req.cookies);
            });
        }
           else{
            res.json(req.cookies);
        }
    });

     // update cookie for user auth
     router.get("/updateUserSession", (req, res) => {
        res.cookie("userSession", {"status": false, "user": ""});
        res.json(req.cookies);
    });

    // set prevURL Cookie
    router.get("/SetPrevURL", (req, res) => {
                res.cookie("prevURL", req.headers.referer);
                res.json(req.cookies);
    });

    // get Cookies
    router.get("/cookies", (req, res) => {
        res.json(req.cookies);
    });

    // reset prevURL Cookie
    router.get("/ResetPrevURL", (req, res) => {
        res.cookie("prevURL", "");
        res.json(req.cookies);
    });

    router.get("/validUser/:user", (req, res) => {
        User.findOne({"username": {"$regex": req.params.user, "$options": "i"}}, (err, usernameQuary) => {
            if(err){
                return handleError(err);
            }
            if(usernameQuary === null){
                // send to 404 page.
                res.send(usernameQuary);
            }
            else{
                // continue to user profile.
                res.send(usernameQuary.username);
            }
        });
    });

    router.post("/updatePassword", (req, res) => {
        User.findOneAndUpdate({username: req.body.username}, {password: genhash(req.body.Password)}).then(() => {
            res.send("Password Update Successful.");
        });
    });

    router.get("/bio/:user", (req, res, next) => {
        var bioQuery = User.findOne({username: req.params.user}).select("bio");
        bioQuery.exec((err, userBio) => {
            if (err) return next(err);
            res.send(userBio);
        });
    });

    router.post("/updateBio", (req, res) => {
        User.findOneAndUpdate({username: req.body.username}, {bio: req.body.newBio}).then(() => {
            res.send("Bio Update Successful.");
        });
    });
    
    router.get("/logout", (req, res) => {
        var loggedUser = req.user.username;
        res.cookie("userSession", {"status": false, "user": ""});
        req.logout();
        req.session.destroy(() => {
            User.findOneAndUpdate({username: loggedUser}, {loggedin: false}).then(() => {
                res.json({"status": false, "user": "", redirect: "/login"});
            });
           });
    });

    router.get("/userSearch/:user", (req, res) =>{
        User.find({"username": {"$regex": req.params.user, "$options": "i"}}).then((user) => {
            var userSearch = user.map((userdata, index ) => {
                if(user[index].username !== req.cookies.userSession.user){
                    return {
                        userInfo: {
                            username: user[index].username,
                            profilePic: user[index].profilePic
                        }
                    }
                }});
                var noDataIndex = userSearch.indexOf(undefined);
                if (noDataIndex > -1) {
                    userSearch.splice(noDataIndex, 1);
                  };
            res.send({userSearch});
        });
    });

    // follow user
    router.post("/AddFollowing", (req, res, next) => {
        var followedUserdataObj = {
            username: req.body.newFollowing,
            profilePic: null
        }; 
        var UserProfilePic = User.findOne({"username": {"$regex": req.body.newFollowing, "$options": "i"}}).select("profilePic -_id");
        UserProfilePic.exec((err, profilePicData) => {
            if (err) return next(err);
            followedUserdataObj.profilePic = profilePicData.profilePic;
            User.findOneAndUpdate({username: req.body.username}, {$addToSet: {following: followedUserdataObj}}).then(() => {
                res.send("Following");
            });
        });
    });

    // unfollow user
    router.post("/RemoveFollowing", (req, res) => {
        User.findOneAndUpdate({username: req.body.username}, {$pull: {following: {username: req.body.UpdateFollowing}}}).then(() => {
            res.send("Unfollowed");
        });
    });

    // get how many people the user is following
    router.get("/following/:user", (req, res, next) => {
        var query = User.findOne({"username": {"$regex": req.params.user, "$options": "i"}}).select("following -_id");
        query.exec((err, usersfollowing) => {
            if (err) return next(err);
            res.send(usersfollowing);
        });
    });

    // get followers
    router.get("/followers/:user", (req, res, next) => { 
        var aggregateQuery =  User.aggregate([{$match: {following: {$elemMatch: {$and: [{username: req.params.user}]}}}}]);
        aggregateQuery.exec((err, followersData) => {
            if (err) return next(err);
            var followersInfo = followersData.map(({username, profilePic}) => {
                if(profilePic === undefined){
                    profilePic = null
                }
                return {username, profilePic};
            });
            res.send(followersInfo);
        });
    });

    // update profile pic
    router.post("/updateProfilePic/:user", (req, res) => {
        User.findOneAndUpdate({username: req.params.user}, {profilePic: req.body.profilePic}).then(() => {
            res.send(false);
        });
    });

    // get user's profile pic
    router.get("/ProfilePic/:user", (req, res, next) => {
        var ProfilePicQuery = User.findOne({"username": {"$regex": req.params.user, "$options": "i"}}).select("profilePic -_id");
        ProfilePicQuery.exec((err, profilePic) => {
            if (err) return next(err);
            res.send(profilePic);
        });
    });

    router.post("/AddNewPost/:user", (req, res) => {
        var userNewPostdataObj = {
            PostImg: req.body.PostPhoto,
            comments: []
        }; 

        User.findOneAndUpdate({username: req.params.user}, {$push: {posts: userNewPostdataObj}}).then(() => {
            res.send("New Post Added");
        });
    });
    
module.exports = router;