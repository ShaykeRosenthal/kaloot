const express = require('express')
const { requireAuth, requireAdmin } = require('../auth/requireAuth.middleware')
const { getUserbyProp, updateUser, deleteUser} = require('../user/controller')
const router = express.Router()


router.get('/', getUserbyProp)
// router.get('/play/:id/', createRoom)
// router.get('/play/:id/:room', joinRoom)
router.put('/:id', requireAuth, updateUser)
// router.put('/:id',updateBaloot)
// router.post('/',addUser)
// router.post('/', addBaloot)
router.delete('/:id',requireAuth,requireAdmin,deleteUser)
// router.delete('/:id', deleteBaloot)
module.exports = router