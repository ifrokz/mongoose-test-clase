const express = require('express'),
    app = express(),
    User = require('./models/user'),
    mongoose = require('./connections/mongoose'),
    bodyParser = require('body-parser'),
    _ = require('lodash');

app.use(bodyParser.json());

app.post('/users/', async (req , res) => {
    try{
        const userData = _.pick(req.body, ['name', 'username', 'password', 'email']);
        const user = await new User({...userData}).save();
        const token = await user.generateAuthToken();

        res.status(201).header('x-auth', token).send(user);
    } catch (err) {
        if(!_.has(req.body, 'password') ||  !_.has(req.body, 'email') || !_.has(req.body, 'username')){
            res.status(400).send(err);
        } else {
            res.status(409).send(err);
        }
    }
});

app.post('/users/auth/', async (req, res) => {
    const body = _.pick(req.body, ['username', 'password']);

    try {
        if(_.isEmpty(body)){
            throw new Error();
        }

        const user = await User.findByCredentials({...body});
        const token = await user.generateAuthToken();
        res.status(200).header('x-auth',token).send(user);
    } catch (err) {
        if(!_.has(req.body, 'password') || !_.has(req.body, 'username')){
            return res.status(400).send(err);
        } else {
            res.status(401).send(err);
        }
    }
});

const autentificacion = async (req, res, next) => {
    const token = req.header('x-auth');
    try {
        // if(!token){
        //    return res.status(401).send({
        //         error: 'Inexistent token',
        //         code: 401
        //     });
        // } 
        const user = await User.findByToken(token);
        if(!user) {
            res.status(401).send({
                error: 'User not found',
                code: 401
            });
        } else {
            req.user = _.pick(user, ['_id']);
            req.token = token;
            next();
        }
    } catch (err) {
        if(err.name === "TokenExpiredError"){
            User.findOne({
                'tokens.access': 'auth',
                'tokens.token': token
            }).then(user => {
                user.removeAuthToken(token).then(() => {
                    res.status(400).send('TokenExpiredError');
                })
            })
        } else {
            res.status(400).send(err)
        }
    }
}

app.patch('/users/name/',autentificacion, async (req, res) => {
    try {
        const data = _.pick(req.body, ['name']);

        if(_.isEmpty(data)){
            throw Error('Inexistent or wrong data');
        }

        // let user = await User.findById(req.user._id);
        // user.name = {
        //     ...user.name,
        //     ...data.name
        // }
        // await user.save();
        // res.send(user);

        // const user = await User.findByIdAndUpdate(
        //     req.user._id,
        //     {
        //         $set: {
        //             name: {
        //                 ...req.user.name,
        //                 ...data.name
        //             }
        //         }
        //     },
        //     {
        //         new: true
        //     }
        // );
        // res.send(user);

        User.findById(req.user._id).then(user => {
            User.findByIdAndUpdate(
                req.user._id,
                {
                    $set: {
                        name: {
                            ...user.name,
                            ...data.name
                        }
                    }
                },
                {
                    new: true
                }
            ).then(user => res.send(user));
        })
    } catch (err) {
        res.status(400).send(err.message);
    }
})

app.delete('/users/', autentificacion ,async (req, res) => {
    try {
        await User.deleteOne({_id: req.user._id});
        res.send();
    } catch (err) {
        res.status(400).send(err);
    }
});

const Tablero = require('./models/tablero');

app.post('/tableros/',autentificacion, (req, res) => {
    new Tablero({
        _creator: req.user._id, 
        name: 'Clase Bootcamp'
    }).save()
      .then(tablero => res.send({tablero}) )
      .catch(err => res.send(err) )
})

app.listen(3000, () => {
    console.log('http://localhost:3000');
});

module.exports = app;