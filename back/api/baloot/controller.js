const balootService = require('./service')
const userService = require('../user/service')
async function getBaloots(req, res) {
    try {
        console.log('getBaloots function:')
        console.log('req.query: ', req.query)
        console.log('req.params: ', req.params)
        console.log('req.session',req.session)
        var baloots = await balootService.query(req.query)
        res.status(200).send(baloots)
    } catch (err) {
        console.log(err)
            (req.query) ? res.status(500).send("error on server side") : res.status(404).send("no baloots were found");
    }


}
async function getBalootbyId(req, res) {
    try {
        console.log('whis is this function ao annoying?!?!')
        console.log('req.query: ', req.query)
        console.log('req.params: ', req.params)
        var baloots = await balootService.query(req.params)
        res.status(200).send(baloots[0])
    } catch (err) {
        console.log(err)
            (req.params) ? res.status(500).send("error on server side") : res.status(404).send("no baloots were found with the specified id");
    }
}

// async function getTopRated(req, res) {
//     // console.log('getTpRated was fired')
//     try {
//         console.log('req.query: ', req.query)
//         console.log('req.params: ', req.params)
//         var baloots = await balootService.query(req.query)
//         res.status(200).send(baloots)
//     } catch (err) {
//         console.log(err)
//         res.status(404).send("no baloots were found");
//     }
// }

async function updateBaloot(req, res) {
    // const user = req.session.user
    // console.log('updating baloot', 'user: ', req.session.user, 'baloot id: ', req.params.id)
    console.log('WELCOME TO UPDATE MY BALOOOOT')
    try {
        let user = await userService.getByUserName(req.body.creator)
        console.log('user is: ', user)
        // if (!user.baloot.includes(req.params.id)) res.status(401).end('Unauthorized!');
        console.log('req.query: ', req.query)
        console.log('req.params: ', req.params)
        console.log('req.body: ', req.body)
        var baloot = await balootService.update(req.params.id, req.body)
        res.status(200).send(baloot)
    } catch (err) {
        console.log(err)
            (req.params.id && req.body) ? res.status(500).send("error on server side") : res.status(400).send("no baloots were found");
    }
}
async function deleteBaloot(req, res) {
    const user = req.session.user
    console.log('updating baloot', 'user: ', req.session.user, 'baloot id: ', req.params.id)
    if (!user.baloot.includes(req.params.id)) res.status(401).end('Unauthorized!');
    try {
        console.log('req.query: ', req.query)
        console.log('req.params: ', req.params)
        console.log('req.body: ', req.body)
        var baloot = await balootService.remove(req.params.id)
        await userService.update(user, { baloot: user.baloot.filter((baloot) => (baloot._id !== req.params.id)) })
        res.status(200).send(baloot)
    } catch (err) {
        console.log(err)
            (req.params.id) ? res.status(500).send("error on server side") : res.status(404).send("no baloots were found");
    }

}
async function addBaloot(req, res) {
    // const user = req.session.user
    try {
        console.log('req.query: ', req.query)
        console.log('req.params: ', req.params)
        console.log('req.body: ', req.body)
        let user = await userService.getByUserName(req.body.creator)
        var baloot = await balootService.add(req.body)
        await userService.update(user, { baloot: [...user.baloot, baloot._id] })
        res.status(200).send(baloot)
    } catch (err) {
        console.log(err)
            (req.body) ? res.status(500).send("error on server side") : res.status(400).send("no baloots were found");
    }
}
module.exports = { getBaloots, getBalootbyId, updateBaloot, deleteBaloot, addBaloot }