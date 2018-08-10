import User from '../../models/user';
import { ObjectID } from "mongodb";
import { genToken } from '../../models/utils/jwt';

const IDs = [
    new ObjectID(),
    new ObjectID(),
    new ObjectID()
]
export const usersData = [
    {
        _id: IDs[0],
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
                token: genToken(IDs[0], 'auth')
            }
        ]
    },
    {
        _id: IDs[1],
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
                token: genToken(IDs[1], 'auth')
            }
        ]
    },
    {
        _id: IDs[2],
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
                token: genToken(IDs[2], 'auth')
            }
        ]
    }
];

export async function populateUsers(done) {
    try {
        await User.remove({});
        await new User(usersData[0]).save();
        await new User(usersData[1]).save();
        await new User(usersData[2]).save();
        done();
    } catch (err) {
        throw new Error(err);
    }
}

 