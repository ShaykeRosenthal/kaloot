const express = require('express')
const { requireAuth, requireAdmin } = require('../auth/requireAuth.middleware')
const { getBaloots, getBalootbyId, updateBaloot, deleteBaloot, addBaloot } = require('../baloot/controller')
// const { joinRoom, createRoom } = require('../room/service')
const router = express.Router()

// middleware that is specific to this router
// router.get('/', getBaloots)

router.get('/', getBaloots)
router.get('/:id', getBalootbyId)
// router.get('/', getBaloots)
// router.get('/play/:id/', createRoom)
// router.get('/play/:id/:room', joinRoom)
router.put('/:id', requireAuth, updateBaloot)
// router.put('/:id',updateBaloot)
router.post('/', requireAuth, addBaloot)
// router.post('/', addBaloot)
router.delete('/:id', requireAuth, deleteBaloot)
// router.delete('/:id', deleteBaloot)

module.exports = router