const moment = require('moment');
const {sign} = require('jsonwebtoken');
const jwt_secret = 'jwt-salt';

const genPayload = ({_id, access, expTime}) => {
    const payload = {
        access,
        _id: _id.toHexString(),
        iat: moment().valueOf() / 1000,
        exp: expTime ? expTime : moment().add(3, 'h').valueOf() / 1000
    }
    return payload;
}

const genToken = ({_id, access, expTime}) => {
    const token = sign(genPayload({_id, access, expTime}), jwt_secret);
    return token.toString();
}

module.exports = {
    genPayload,
    genToken,
    jwt_secret
};