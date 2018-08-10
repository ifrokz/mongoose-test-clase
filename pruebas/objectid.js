const {ObjectID } = require('mongodb');

const id = ObjectID();
console.log(id.toHexString())