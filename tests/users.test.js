import request from 'supertest';
import { usersData as users, populateUsers} from './seed/users';
import User from '../models/user';
import { compare } from 'bcrypt';

// import { ObjectID } from 'mongodb';

import app from '../app';

beforeEach(populateUsers);

describe('Users', () => {
    describe('POST /users/', () => {
        // - Falta testear si se envia el nombre y apellidos del usuario en el registro 

        // - Comprobar que si se envia datos como admin, en la base de datos salga como user (que no permita registrarse como admin aunque esté en los datos enviados)
        
        test('Deberia registrar el usuario en caso de enviar bien los datos y no existir otro igual',(done) => {
            const tempUser = {
                username: 'userparatest',
                password: 'passwordtest',
                role: 'admin',
                email: 'emailtest@test.com'
            };

            request(app)
                .post('/users/')
                .send({...tempUser})
                .expect(201)
                .expect((res) => {
                    expect(res.body._id).toBeTruthy();
                    expect(res.body.name).toBeFalsy();
                    expect(res.body.role).toBe('user');
                    expect(res.body.email).toBe(tempUser.email);
                })
                .end( async (err, res) => {
                    if(err) return done(err);

                    try {
                        const user = await User.findById(res.body._id);
                        // console.log(user);
                        expect(user.tokens.length).toBe(1);
                        expect(user.username).toBe(tempUser.username);
                        // expect(typeof user.password).toBe('string');
                        const validPass = await compare(tempUser.password, user.password);
                        expect(validPass).toBe(true);

                        done();
                    } catch (e){
                        done(e)
                    }
                });
        });

        test('Deberia dar error 409 si el usuario ya existe', (done) => {
            request(app)
                .post('/users/')
                .send({...users[0]})
                .expect(409)
                .end(done);
        });

        test('Deberia dar error 400 si no mandamos el email', (done) => {
            const tempUser = {
                username: 'fdasfdas',
                password: 'fewadfdsa'
            }
            request(app)
                .post('/users/')
                .send({...tempUser})
                .expect(400)
                .end(done);
        });

        test('Deberia dar error 400 si no mandamos el password', (done) => {
            const tempUser = {
                username: 'fdasfdas',
                email: 'fjalkesjf@gmail.com'
            }
            request(app)
                .post('/users/')
                .send({...tempUser})
                .expect(400)
                .end(done);
        });

        test('Deberia dar error 400 si no mandamos el username', (done) => {
            const tempUser = {
                email: 'fjalkesjf@gmail.com',
                password: 'fewadfdsa',
            }
            request(app)
                .post('/users/')
                .send({...tempUser})
                .expect(400)
                .end(done);
        });

        test('Deberia dar error 400 si no mandamos datos', (done) => {
            const tempUser = {}
            request(app)
                .post('/users/')
                .send({...tempUser})
                .expect(400)
                .end(done);
        });

        test('Deberia dar error x cuando el email no sea valido', (done) => {
            request(app)
                .post('/users/')
                .send({
                    email: 'iv@an@gmail.com',
                    password: 'fasdiof',
                    username: 'r31lkfj'
                })
                .expect(409)
                .end(done);
        });
    });

    describe('POST /users/auth/', () => {

    });

    describe('PATCH /users/name', () => {
      
    });

    describe('DELETE /users/', () => { 
        // No estás autentificado (no hay token tipo auth en las cabeceras)

        // Puede borrar el usuario en el que estoy autentificado
    });
});
