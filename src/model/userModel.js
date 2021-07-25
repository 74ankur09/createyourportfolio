const mongoose = require("mongoose")
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true

    },
    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid Email");
            }
        }
    },
    home: {
        name: {
            type: String,
            default: ''
        },
        desc1: {
            type: String,
            default: ''
        },
        desc2: {
            type: String,
            default: ''
        },
        linkedin: {
            type: String,
            default: '#'
        },
        github: {
            type: String,
            default: '#'
        },
        facebook: {
            type: String,
            default: '#'
        },
        instagram: {
            type: String,
            default: '#'
        },
        twitter: {
            type: String,
            default: '#'
        }
    },
    color: {
        darkback: {
            type: String,
            default: "#121111"
        },
        mediumback:  {
            type: String,
            default: "#424040"
        },
        lightback: {
            type: String,
            default: "#7c7676"
        },
        darkfont:  {
            type: String,
            default: "#e05b49"
        },
        lightfont:  {
            type: String,
            default: "#fa945a"
        },
        textfont:  {
            type: String,
            default: "#ffffff"
        },
        apostrophe:  {
            type: String,
            default: "#e5ff00"
        }
    },
    projects: {
        ptitle1: {
            type: String,
        },
        pdesc1: {
            type: String,
        },
        purl1: {
            type: String
        },
        ptitle2: {
            type: String,
        },
        pdesc2: {
            type: String,
        },
        purl2: {
            type: String
        },
        ptitle3: {
            type: String,
        },
        pdesc3: {
            type: String,
        },
        purl3: {
            type: String
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }]
}, {
    timestamps: true
})


userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({
        email
    })

    if (!user) {
        return {error: "Wrong Credentials"}
    }

    const isMatch = await bcrypt.compare(password, user.password)


    if (!isMatch) {
        return {error: "Wrong Credentials"}
    }

    return { user }
}

userSchema.methods.qualifySave = async function () {
    
    const user = this;

    if (!validator.isEmail(user.email)) {
        return { ok: false, error: "Invalid Email" };
    }

    if (!validator.matches(user.username, "^[a-zA-Z0-9]*$")) {
        return { ok: false, error: "Username can only contain letters and numbers" };
    }

    if (!validator.matches(user.name, "^[a-zA-Z ]*$")) {
        return { ok: false, error: "Name is incorrect" };
    }
    
    if (user.password.length < 7) {
        return { ok: false, error: "Use a Strong Password" };
    }

    const existEmail = await User.findOne({ email: user.email });

    //console.log(existEmail)

    if (existEmail != null) {
        return { ok: false, error: "Email already registered" };
    }

    const existUsername = await User.findOne({ username: user.username });

    //console.log(existUsername)

    if (existUsername != null) {
        return { ok: false, error: "Username already registered" };
    }

    return { ok: true, error: "" };
}


userSchema.methods.homeValidation = async function () {
    
    const home = this.home;

    if (!validator.matches(home.linkedin, "^[\.a-zA-Z0-9\_\-]*$")) {
        return { ok: false, error: "Linkedin Username is incorrect" };
    }

    if (!validator.matches(home.twitter, "^[\.a-zA-Z0-9\_\-]*$")) {
        return { ok: false, error: "Twitter Username is incorrect" };
    }

    if (!validator.matches(home.facebook, "^[\.a-zA-Z0-9\_\-]*$")) {
        return { ok: false, error: "Facebook Username is incorrect" };
    }

    if (!validator.matches(home.github, "^[\.a-zA-Z0-9\_\-]*$")) {
        return { ok: false, error: "Github Username is incorrect" };
    }

    if (!validator.matches(home.instagram, "^[\.a-zA-Z0-9\_\-]*$")) {
        return { ok: false, error: "Instagram Username is incorrect" };
    }

    //console.log(home.name)

    if (!validator.matches(home.name, "^[a-zA-Z\ ]*$")) {
        return { ok: false, error: "Name is incorrect" };
    }


    if (!validator.matches(home.desc1, "^[\ a-zA-Z\_\-]*$")) {
        return { ok: false, error: "Description 1 is incorrect" };
    }


    if (!validator.matches(home.desc2, "^[\ a-zA-Z\_\-]")) {
        return { ok: false, error: "Description 2 is incorrect" };
    }

    
    return { ok: true, error: "" };
}


userSchema.methods.colorValidation = async function () {
    
    const color = this.color;

    for (var colorCode in color.keys) {
        console.log(colorCode, color[colorCode])
        if (colorCode != "$init" && !validator.matches(color[colorCode], "^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$")) {
            return { ok: false, error: "Color Code is invalid" };
        }
    }

    return { ok: true, error: "" };
}


userSchema.methods.projectValidation = async function () {
    
    const projects = this.projects;

    // console.log(projects)

    for (var project in projects) {
        // console.log(project, project.length,)
        var field = project.substring(1, project.length - 1);
        var num = project[project.length - 1];
        var val = projects[project];

        // console.log(field,num,val)
        
        if (field == "title" && !validator.matches(val, "^[\ a-zA-Z\_\-]*$")) {
                return { ok: false, error: "Project " + num + ": Title is incorrect" };
        }
        
        else if (field == "desc" && val.match(/<script\b[^>]*>([\s\S]*?)<\/script>/) != null) {
            return { ok: false, error: "Project " + num + ": Description is incorrect" };
        }
            
        else if (field == "url" && val.length > 0 && ( val.match(/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/) == null || val.match(/<script\b[^>]*>([\s\S]*?)<\/script>/) != null)) {
            return { ok: false, error: "Project " + num + ": Url is incorrect" };
        }
    }

    
    return { ok: true, error: "" };
}

userSchema.pre('save', function (next) {

    const user = this

    if (user.isModified('password')) {
        bcrypt.hash(user.password, 8).then((hashedPassword) => {
            user.password = hashedPassword;
            next();
        });
    } else {
        next();
    }
})

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;

}

userSchema.methods.generateAuthToken = async function () {

    const user = this
    const token = jwt.sign({
        _id: user._id.toString()
    },  process.env.JWT_SECRET);

    user.tokens = user.tokens.concat({
        token
    });

    await user.save();

    return token;

}

const User = mongoose.model('User', userSchema);

module.exports = User