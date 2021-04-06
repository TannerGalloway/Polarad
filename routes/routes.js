const express = require("express");
const router = express.Router();
const cookieParams = {
    httpOnly: false,
    signed: true
  }

const User = require("../config/database").model;
const passport = require("passport");
const genhash = require("../utils/passwordUtils").genpassword;
var currentUser = "";

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
                    currentUser = req.user.username;
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
                User.findOneAndUpdate({username: currentUser}, {loggedin: false}).then(() => {
                    res.cookie("userSession", {"status": false, "user": ""});
                    res.json(req.cookies);
                });
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
            postID: req.body.postID,
            PostImg: req.body.PostPhoto,
            Likes: 0,
            UploadDate: Date(),
            comments: []
        };

        User.findOneAndUpdate({username: req.params.user}, {$push: {posts: userNewPostdataObj}}).then(() => {
            res.send("New Post Added");
        });
    });

    // get user's posts
    router.get("/posts/:user", (req, res, next) => {
        var query = User.findOne({"username": {"$regex": req.params.user, "$options": "i"}}).select("posts -_id");
        query.exec((err, usersPosts) => {
            if (err) return next(err);
            res.send(usersPosts);
        });
    });

    // get Upload date on post
    router.get("/UploadDate/:user/:postID", (req, res, next) => {
        var UploadDate = User.findOne({"username": {"$regex": req.params.user, "$options": "i"}}).select("posts -_id");
        UploadDate.exec((err, postsArr) => {
            if (err) return next(err);
            postsArr.posts.forEach((post) => {
                if(post.postID === req.params.postID){
                    res.json(post.UploadDate);
                }
            });
        });
    });

    // add post to favorites
    router.post("/FavoritePost/:user", (req, res) => {
        var query = User.findOne({username: {"$regex": req.body.loginUser, "$options": "i"}}).select("posts -_id");
        query.exec((err, usersPosts) => {
            if (err) return next(err);
            usersPosts.posts.forEach((post) => {
                if(post.postID === req.body.postID){
                    User.findOneAndUpdate({username:  req.params.user}, {$push: {favorites: post}}).then(() => {
                        res.send("New Favorite Added");
                    });
                }
            });
        });
    });

    // get user's favorites
    router.get("/Favorites/:user", (req, res, next) => {
        var FavoritesQuery = User.findOne({"username": {"$regex": req.params.user, "$options": "i"}}).select("favorites -_id");
        FavoritesQuery.exec((err, favoritesArr) => {
            if (err) return next(err);
            res.send(favoritesArr);
        });
    });

    // get Number of Likes on post
    router.get("/Likes/:user/:postID", (req, res, next) => {
        var Likes = User.findOne({"username": {"$regex": req.params.user, "$options": "i"}}).select("posts -_id");
        Likes.exec((err, postsArr) => {
            if (err) return next(err);
            postsArr.posts.forEach((post) => {
                if(post.postID === req.params.postID){
                    res.json(post.Likes);
                }
            });
        });
    });

    // unfavorite post
    router.post("/RemoveFavorite/:user", (req, res) => {
        User.findOneAndUpdate({username: req.params.user}, {$pull: {favorites: {postID: req.body.postID}}}).then(() => {
            res.send("Unfollowed");
        });
    });

    // update number of likes a post has
    router.post("/UpdateLikes/:postID", (req, res) => {
        User.updateOne({"posts.postID": req.params.postID}, {"$set": {"posts.$.Likes": req.body.NewLikes}}).then(() => res.send("Likes Updated"));
    });


    router.get("/UserInfo/:user", (req, res, next) => {
        var UserInfo = User.findOne({"username": {"$regex": req.params.user, "$options": "i"}});
        UserInfo.exec((err, userdata) => {
            if (err) return next(err);
            res.send(userdata);
        });
    });
    
module.exports = router;