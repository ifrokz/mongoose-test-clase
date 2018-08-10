import User from '../../models/user';
import { ObjectID } from "mongodb";


const usersData = [
    {
        _id: new ObjectID(),
        username: 'ivanruiz',
        name: {
            first: 'Ivan',
            last: 'Ruiz',
        },
        password: 'unapass12345',
        email: 'ivanruiz@gmail.com',
        tokens: [
            {
                access: 'auth',
                token: 'fn3jk2ljf1'
            }
        ]
    },
    {
        _id: new ObjectID(),
        username: 'ivanruiz2',
        name: {
            first: 'Ivan',
            last: 'Ruiz',
        },
        password: 'unapass12346',
        email: 'ivanruiz2@gmail.com',
        tokens: [
            {
                access: 'auth',
                 token:'fn3jk2ljf1'
            }
        ]
    },
    {
        _id: new ObjectID(),
        username: 'ivanruiz3',
        name: {
            first: 'Ivan',
            last: 'Ruiz',
        },
        password: 'unapass12347',
        email: 'ivanruiz3@gmail.com',
        role: 'admin',
        tokens: [
            {
                access: 'auth', 
                token: 'fn3jk2ljf1'
            }
        ]
    }
];

const populateUsers = async (done) => {
    try {
        await User.remove({});
        await new User(usersData[0]).save();
        await new User(usersData[1]).save();
        await new User(usersData[2]).save();
    } catch (err) {
        throw new Error(err);
    }
}
