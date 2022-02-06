const userService = require('../user/service')

async function getUserbyProp(req, res) { //gets an object {email:"blah@mail.com"}
    var user;
    try {

        console.log('blahhh:', req.query)

        switch (Object.keys(req.query)[0]) {
            case 'email':
                var { email } = req.query;
                user = await userService.getByEmail(email)
                // if (!user) res.status(400).send(false)
                break;
            case 'id':
                var { id } = req.query;
                user = await userService.getById(id)
                // if (!user) res.status(400).send(false)
                break;
            case 'username':
                var { username } = req.query;
                user = await userService.getByUserName(username)
                // if (!user) res.status(400).send(false)
                break;
            default:
                res.status(500).send({error:`couldnt find user with ${Object.keys(req.query)[0]}=${req.query[Object.keys(req.query)[0]]}`})
                return;
        }
        var response = user ? { ...user } : false
        delete response.password
        response ? res.status(200).send(response) : res.status(400).send(false);
    } catch (err) {
        console.log(err)
    }
}

async function updateUser(req, res) {
    // const connectedUser = req.session.user
    // if (connectedUser._id !== req.params.id && connectedUser.isAdmin === false) res.status(401).send('Unauthorized to update user!')
    try {
        var user = await userService.getById(req.params.id)
        var updatedUser = await userService.update(user, req.body)
        updatedUser ? res.status(200).send(updatedUser) : res.status(400).send(false)

    } catch (err) {
        console.log(err)
    }

}

async function deleteUser(req, res) {
    try {
        var user = await userService.getById(req.params.id)
        var isDeleted = await userService.remove(user)
        isDeleted ? res.status(200).send('deleted user') : res.status(400).send(false)

    } catch (err) {
        console.log(err)
    }
}

async function addUser(req, res) {
    var user
    try {
        var { username, email, password } = req.body
        if (!username || !email || !password) {
            console.log('cannot add to DB without mandatory fields')
            user = false;
        }
        user = await userService.add(req.body)

        user ? res.status(200).send(`user ${user._id} was added to DB`) : res.status(400).send(false)

    } catch (err) {
        console.log(err)
    }
}

module.exports = { getUserbyProp, updateUser, deleteUser, addUser }