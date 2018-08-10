const User = require('./models/user');
const mongoose = require('./connections/mongoose');

const usersData = [
    {
        username: 'ivanruiz',
        name: {
            first: 'Ivan',
            last: 'Ruiz',
        },
        password: 'unapass12345',
        email: 'ivanruiz@gmail.com',
        tokens: [{access: 'auth', token:'fn3jk2ljf1'}]
    },
    {
        username: 'ivanruiz2',
        name: {
            first: 'Ivan',
            last: 'Ruiz',
        },
        password: 'unapass12346',
        email: 'ivanruiz2@gmail.com',
        tokens: [{access: 'auth', token:'fn3jk2ljf1'}]
    },
    {
        username: 'ivanruiz3',
        name: {
            first: 'Ivan',
            last: 'Ruiz',
        },
        password: 'unapass12347',
        email: 'ivanruiz3@gmail.com',
        role: 'admin',
        tokens: [{access: 'auth', token:'fn3jk2ljf1'}]
    }
]

const Init =  async () => {
    try {
        await User.remove({});
        const user = await new User(usersData[0]).save();
        await new User(usersData[1]).save();
        const user2 = await new User(usersData[2]).save();
    
        User.findOne({
            username: 'ivanruiz'
        }).then(res => {
            if(res) return res.findSimilarRoles().then(docs => {
                //console.log(docs);
            })
    
            console.log('No se ha encontrado el usuario a comparar')
        });
        
        const userByCredentials =await User.findByCredentials({
            username: usersData[1].username,
            password: usersData[1].password
        });
        // const userByCredentials = await User.findByCredentials({
        //     username: usersData[0].email,
        //     password: usersData[0].password
        // });
        console.log({userByCredentials})

        const token = await user2.generateAuthToken();
        // console.log(token);
        const userByToken = await User.findByToken(token);
        // console.log({userByToken});
        // await user2.removeAuthToken(token);

        // user2.username = 'otrousername';
        // await user2.save();
        // user2.password = 'otrapass';
        // await user2.save();
        // const res = await user.findSimilarRoles()
        // console.log(res);
        // console.log(user.toObject());
        // console.log(JSON.stringify(user));
    } catch (err) {
        console.log(err);
    }
};

Init();
