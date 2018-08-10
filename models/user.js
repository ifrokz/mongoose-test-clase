const mongoose = require('mongoose');
const {isEmail} = require('validator');
const {pick} = require('lodash');
const {hash, compare, genSalt} = require('bcrypt');
const {sign, verify} = require('jsonwebtoken');
const moment = require('moment');

const { genPayload, genToken, jwt_secret } = require('./utils/jwt');


const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 4,
        maxlength: 25,
        required: true,
        unique: true
    },
    name: {
        first: {
            type: String,
            required: false
        },
        last: {
            type: String,
            required: false
        }
    },
    password: {
        type: String,
        required: true,
        minlength: 8
    },
    role: {
        type: String,
        required: false,
        default: 'user'
    },
    email: {
        type: String,
        required: true,
        trim: true,
        unique: true,
        validate: {
            isAsync: true,
            validator: (email) => isEmail(email, { domain_specific_validation: true}),
            message: '{VALUE} is not a valid email.'
        }
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }]
},
// {strict: false}
);

UserSchema.method('toJSON', function () {
    const user = this;
    const userObject = user.toObject();

    return pick(userObject, ['role', '_id', 'name', 'email']);
});

UserSchema.methods.findSimilarRoles = function () { 
    return this.model('Users').find({role: this.role});
}



UserSchema.methods.generateAuthToken = function () {
    const user = this;
    const access = 'auth';

    const token = genToken({_id: this._id, access});

    user.tokens.push({access, token});

    return user.save().then(() => {
        return token;
    });
};

UserSchema.method('removeAuthToken', function (token) {
    const user = this;

    return user.update({
        $pull: {
            tokens: {token}
        }
    });
});


UserSchema.static('findByToken', function (token) {
    const User = this;
    let decoded = undefined;

    try {
        decoded = verify(token, jwt_secret);
    } catch (e) {
        return Promise.reject(e);
    }

    // console.log('token: ', decoded);

    return User.findOne({
        _id: decoded._id,
        'tokens.access': decoded.access,
        'tokens.token': token
    });
});

UserSchema.statics.findByCredentials = async function ({username, password}){
    const User = this;
    const tempFind = (username && isEmail(username)) ?
        {email: username} : 
        {username};

    try {
        const user = await User.findOne({...tempFind});
        // console.log({user});

        return new Promise((resolve, reject) => {
            compare(password, user.password, (err, res) => {
                if(!res || err){
                    reject(err || 'Compare failed');
                } else {
                    resolve(user);
                }
            })
        });
    } catch (e) {
        return Promise.reject(e);
    }
}

UserSchema.pre('save', function(next) {
    const user = this;
    const saltRounds = process.env.NODE_ENV === 'production' ? 10 : 1;

    if(user.isModified('password')){
        genSalt(saltRounds, (err, salt) => {
            if(err) return next(err);
            hash(user.password, salt, (err, hashedPassword) => {
                if(err) return next(err);
                compare(user.password, hashedPassword, ( err, res) => {
                    if(err) return next(err);
                    
                    if(res) {
                        // console.log(user.password)
                        user.password = hashedPassword;
                        next();
                    } else {
                        next('Las contraseñas no coinciden en el .save()')
                    }
                });
            });
        });
    }else {
        // console.log('Se ha guardado pero la contraseña no se ha modificado')
        next();
    }
})

const User = mongoose.model('Users', UserSchema);

module.exports = User;