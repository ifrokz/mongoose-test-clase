module.exports.genToken = () => {
    const genPayload = ({_id, access, expTime}) => {
        const payload = {
            access,
            _id: _id.toHexString(),
            iat: moment().valueOf() / 1000,
            exp: expTime ? expTime : moment().add(3, 'h').valueOf() / 1000
        }
        return payload;
    }
    const token = sign(genPayload({_id: this._id, access}),jwt_secret).toString();

    return token;
}