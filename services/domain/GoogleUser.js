const User = require('../model/user');

class GoogleUser extends User {
    //Generating google user object
    constructor(data) {
        super();
        this.username = data.givenName,
            this.email = data.email,
            this.fname = data.given_name,
            this.lname = data.family_name,
            this.googleId = data.sub,
            this.imageUrl = data.picture,
            this.phone = "Enter phone",
            this.address = "Enter address",
            this.password = "null - random",
            this.nic = "Enter NIC",
            this.discount = false,
            this.enabled = true,
            this.loginCount = data.loginCount
    }
};

module.exports = GoogleUser;