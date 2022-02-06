const dbService = require('../../db_service')
const ObjectId = require('mongodb').ObjectId

module.exports = {
    query,
    getById,
    getByEmail,
    remove,
    update,
    add,
    addFavorite,
    getByUserName
}

async function query(filterBy = {}) {
    const criteria = _buildCriteria(filterBy)
    const collection = await dbService.getCollection('user')
    try {
        const users = collection ? await collection.find(criteria).toArray() : false;
        users ? users.forEach(user => delete user.password) : '';

        return users
    } catch (err) {
        console.log('ERROR: cannot find users')
        // throw err;
    }
}

async function getById(userId) {
    const collection = await dbService.getCollection('user')
    console.log('looking for user with id:', userId)
    try {
        const user = collection ? await collection.findOne({ "_id": ObjectId(userId) }) : false;
        user ? delete user.password : '';
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${userId}`)
        // throw err;
    }
}
async function getByUserName(userName) {
    const collection = await dbService.getCollection('user')
    console.log('looking for user with username:', userName)
    try {
        const user = collection ? await collection.findOne({ "username": userName }) : false;
        user ? delete user.password : '';
        return user
    } catch (err) {
        console.log(`ERROR: while finding user with username ${userName}`)
        // throw err;
    }
}
async function getByEmail(email) {
    const collection = await dbService.getCollection('user')
    console.log('looking for user with email:', email)

    try {
        const user = collection ? await collection.findOne({ email }) : '';
        console.log(`user is ${user}`)
        return user
    } catch (err) {
        console.log(`ERROR: while finding user ${email}`)
        // throw err;
    }
}

async function remove(userId) {
    const collection = await dbService.getCollection('user')
    console.log('trying to remove user:', userId)
    try {
        collection ? await collection.deleteOne({ "_id": ObjectId(userId) }) : '';
    } catch (err) {
        console.log(`ERROR: cannot remove user ${userId}`)
        // throw err;
    }
}

async function update(user, reqBody) {
    const collection = await dbService.getCollection('user')
    console.log('trying to update user:', user, '\nwith data:', reqBody)
    objUserId = ObjectId(user._id);
    delete reqBody._id
    console.log('now data is: ',reqBody)
    try {
        collection ? await collection.updateOne({ "_id": objUserId }, { $set: reqBody }) : '';
        var updatedUser = await getById(objUserId)
        return updatedUser
    } catch (err) {
        console.log(`ERROR: cannot update user ${objUserId}`, '\n err is:', err)
        // throw err;
    }
}

async function addFavorite(userId, balootId) {
    const collection = await dbService.getCollection('user')
    console.log(`adding baloot: ${balootId} to favorites of user: ${userId}`)

    const id = ObjectId(userId);

    try {
        const user = collection ? await collection.updateOne({ "_id": id }, { $push: { favorites: balootId } }) : false;
        // console.log(user)
        user ? delete user.password : '';
        return user
    } catch (err) {
        console.log(`ERROR: cannot update user ${user._id}`)
        // throw err;
    }
}

async function add(user) {
    const collection = await dbService.getCollection('user')
    try {
        user.baloot = [];
        user.favorites = [];
        user.isAdmin = false;
        var newUser = collection ? await collection.insertOne(user) : '';
        console.log('new user to add to DB:', newUser)
        if (newUser) delete newUser.password;
        return newUser;
    } catch (err) {
        console.log(`ERROR: cannot insert user`, err)
        // throw err;
    }
}

function _buildCriteria(filterBy) {
    const criteria = {};
    if (filterBy.txt) {
        criteria.username = filterBy.txt
    }

    return criteria;
}





