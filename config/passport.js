const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("./database").model;
const validatePassword = require("../utils/passwordUtils").validatePassword;

// passport statagy for authenticating users.
passport.use(new LocalStrategy(
    function(username, password, done) {

        User.findOne({ username: username })
        .then((user) => {
            if (!user) {return done(null, false, { errors: { "username": "is invalid" } });}
            
            validatePassword(password, user.password).then((isValid) => {
                if (isValid) {
                    return done(null, user);
                } 
                else {
                    return done(null, false, { errors: { "password": "is invalid" } });
                }
            });
        })
        .catch((err) => {   
            done(err);
        });
    }
  ));

  passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((userId, done) => {
    User.findById(userId)
        .then((user) => {
            done(null, user);
        })
        .catch(err => done(err))
});