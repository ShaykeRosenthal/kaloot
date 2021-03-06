const bcrypt = require('bcrypt')
const userService = require('../user/service')

const saltRounds = 10

async function login(email, password) {
    console.log(`auth.service - login with email: ${email}`)
    if (!email || !password) return Promise.reject('email and password are required!')

    const user = await userService.getByEmail(email)
    console.log('auth.service,user:',user)
    if (!user) return Promise.reject('Invalid email or password')
    const match = await bcrypt.compare(password, user.password)
    if (!match) return Promise.reject('Invalid email or password')
    else console.log('correct password',match)

    delete user.password;
    return user;
}

async function signup(email, password, username,imgURL) {
    console.log(`auth.service - signup with email: ${email}, username: ${username}`)
    if (!email || !password || !username) return Promise.reject('email, username and password are required!')

    const hash = await bcrypt.hash(password, saltRounds)
    return userService.add({email, password: hash, username,imgURL})
}

module.exports = {
    signup,
    login,
}