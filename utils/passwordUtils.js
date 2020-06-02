const bcrypt = require("bcrypt");

// password functions for db and passport.
function genpassword(password){
    var hashedpassword = bcrypt.hashSync(password, 10);
    return hashedpassword;
};

async function validatePassword(password, dbpassword){
    var isvalid = await bcrypt.compare(password, dbpassword);
    return isvalid;
};

module.exports.validatePassword = validatePassword;
module.exports.genpassword = genpassword;