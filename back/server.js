var express = require('express')
const { MongoClient } = require('mongodb');
var QR = require('qrcode-generator')
var fs = require('fs')
var base64Img = require('base64-img');
var path = require('path');
require('dotenv').config()
// var axios = require('axios')
var dbService = require('./db_service')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const rooms = []
const TimerObjs = []
const app = express()
const http = require('http').createServer(app);

const authRoutes = require('./api/auth/auth.routes')
const userRoutes = require('./api/user/routes')
const balootRoutes = require('./api/baloot/routes')
app.set('rooms', rooms)
app.use(cookieParser())
// app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false, maxAge: 8 * 60 * 60 * 1000 },
}))

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'public')));
} else {
    const corsOptions = {
        origin: ['http://127.0.0.1:3000', 'http://localhost:3000', 'https://kaloot.herokuapp.com/'],
        credentials: true
    };
    app.use(cors(corsOptions));
}
// app.get('', (req, res) => { console.log('~~~~req params\n',req.params,'req query:\n',req.query,'\n~~~~') })
// app.get('', (req, res) => { console.log('SERVER HERE THE SESSION IS: ', req.session) })
app.use('/api/auth', authRoutes)
app.use('/api/baloot', balootRoutes)
app.use('/api/user', userRoutes)
const port = process.env.PORT || 3030;
const server = http.listen(port, () => {
    console.log('Server is running on port: ' + (process.env.PORT || 3030))
});

app.get('/*', function (req, res) {
    console.log('SERVER HERE THE SESSION IS: ', req.session)
    res.sendFile(path.resolve(__dirname, 'public/index.html'), function (err) {
        if (err) {
            res.status(500).send(err)
        }
    })
})

const io = require("socket.io")(server, {
    cors: {
        origin: ["http://127.0.0.1:3000", "http://localhost:3000", 'https://kaloot.herokuapp.com/'],
        methods: ["GET", "POST"],
        credentials: true
    }
});
function _getCurrHostId(playerId, rooms) {
    console.log('trying to find host of player: ', playerId)
    let searchAttempt = rooms.find((r) => {
        let players = r.users.map(user => (user.roomId));
        let isPlayerExist = players.findIndex((roomId) => (roomId === playerId))
        if (isPlayerExist > -1) return r;
    })
    var hostId = (searchAttempt && searchAttempt.length !== 0) ? searchAttempt.roomId : false;
    return hostId
}
async function _startTimer(roomId) {
    // console.log('TIMERS ARE:', TimerObjs)
    let currRoom = rooms.find((r) => (r.roomId === roomId))
    let idx = currRoom.currQuestionIndex;
    let currQuestion = currRoom.questions[idx];
    if (!TimerObjs.find((T) => (T.roomId === roomId && T.QuestionIndex === idx))) {
        currRoom.timer = { currTime: currQuestion.timeToAnswer, timerObj: {}, timerId: null, timeSig: Date.now() };
        TimerObjs.push({
            roomId: roomId, QuestionIndex: idx, TimerObj: setInterval(() => {


                if (currRoom.timer.currTime === null) {
                    return;
                }
                if (currRoom.timer.currTime <= 0 || isNaN(currRoom.timer.currTime)) {
                    currRoom.timer.currTime = null;
                }
                else {
                    if (((Date.now() - currRoom.timer.timeSig) / 1000) >= 1) {
                        currRoom.timer.currTime -= Math.floor(((Date.now() - currRoom.timer.timeSig) / 1000))
                        currRoom.timer.timeSig = Date.now()
                        console.log('currRoom.timer.currTime:', currRoom.timer.currTime)
                        io.sockets.in(roomId).emit('time-left', (currRoom.timer.currTime + ''))
                    }

                }
            }, 200)
        })
    }
}
function _genWinnersObj(players) {
    if (players.length > 0) {
        players.sort(function (player1, player2) {
            return player1.score - player2.score;
        });
        let highestScore = players[players.length - 1].score
        let diff = players.map((p) => (Math.abs(p.score - highestScore)))
        let indices = diff.map((d, i) => { if (d === 0) return i }).filter((val) => (val !== undefined && val !== null && !isNaN(val)))

        let firstPlace = '';
        indices.forEach((idx) => (firstPlace += players[idx].username + ','))

        /*                             */ firstPlace = firstPlace.substring(0, firstPlace.length - 1);

        let closestDiff1 = Infinity
        diff.forEach((d) => { if (d > 0 && d < closestDiff1) closestDiff1 = d })
        indices = diff.map((d, i) => { if (d === closestDiff1) return i }).filter((val) => (val !== undefined && val !== null && !isNaN(val)))
        let secondPlace = '';
        console.log('indices1:', indices)
        indices.forEach((idx) => (secondPlace += players[idx].username + ','))

        /*                             */ secondPlace = secondPlace.substring(0, secondPlace.length - 1);

        let closestDiff2 = Infinity
        diff.forEach((d) => { if (d > closestDiff1 && d < closestDiff2) closestDiff2 = d })
        indices = diff.map((d, i) => { if (d === closestDiff2) return i }).filter((val) => (val !== undefined && val !== null && !isNaN(val)))
        let thirdPlace = '';
        console.log('indices2:', indices)
        indices.forEach((idx) => (thirdPlace += players[idx].username + ','))

        /*                             */ thirdPlace = thirdPlace.substring(0, thirdPlace.length - 1);

        console.log('AND THE WINNERS ARE...', { first: firstPlace, second: secondPlace, third: thirdPlace })
        return { first: firstPlace, second: secondPlace, third: thirdPlace }


    }

}
async function _setQuestion(roomId) {
    let currRoom = rooms.find((r) => (r.roomId === roomId))
    let idx = currRoom.currQuestionIndex;
    let currQuestion = currRoom.questions[idx];
    let answers = currQuestion.answers.map((ans) => (ans.answer))
    // console.log('&&&&&&&&\nquestion object is\n', currQuestion, '\n&&&&&&&&')
    console.log('line144: ', currRoom)
    io.sockets.in(roomId).emit('current-answers', { question: currQuestion.question, timeToAnswer: currQuestion.timeToAnswer, answers: answers, imgURL: currQuestion.imgURL })
}
app.set('socketio', io);
io.on('connection', function (socket) {
    // let qrcode = QR.(4, 'L')
    // qrcode.addData(socket.id)
    // qrcode.make()
    // qrcode.createDataURL()
    rooms.push({
        roomId: socket.id, score: 0, submitters: 0, username: '', questions: [],
        currQuestionIndex: 0, users: [], status: 'init'
    })
    socket.emit('room', rooms[rooms.length - 1])

    socket.on("join-room", (playerData) => {
        console.log('event: join-room')
        console.log("playerData recieved here: ", playerData)
        var room = rooms.find(room => (room.roomId === playerData.roomId && playerData.roomId !== socket.id))
        var currRoom = rooms.find(room => (room.roomId === socket.id))
        if (!room || room.blockPlayers === true) {
            socket.emit('error', 'cannot join game, it has already started.')
            return;
        } else {

            if (room !== undefined) room.users.push({ roomId: currRoom.roomId, username: playerData.name, score: currRoom.score })
            else socket.emit("error", 'room not found');
            socket.join(playerData.roomId)
            socket.to(playerData.roomId).emit("visitor", room)
            // console.log('####\n####\n####\nrooms array is:\n', rooms, '\n####\n####\n####')

        }
    });
    socket.on('submit-answer', (answer) => {
        console.log('event: submit-answer')
        console.log('recieved answer: ', answer)
        let hostId = _getCurrHostId(socket.id, rooms)
        console.log('player:', socket.id, 'has host:', hostId)
        let player = rooms.find((r) => (r.roomId === socket.id))
        let hostRoom = hostId ? rooms.find((r) => (r.roomId === hostId)) : false;
        if (hostRoom) {
            hostRoom.submitters++;
            let currQuestions = hostRoom.questions
            let currIndex = hostRoom.currQuestionIndex;
            let currQuestion = (currQuestions.length !== 0 && currIndex >= 0 && currIndex < currQuestions.length) ? currQuestions[currIndex] : false
            let currCorrectAnswer = currQuestion ? currQuestion.answers.find((ans) => (ans.isCorrect)).answer : null;
            if (currCorrectAnswer === answer && hostRoom.timer.currTime > 0) {
                player.score += Math.ceil((hostRoom.timer.currTime / currQuestion.timeToAnswer) * 500);
                let playerIdx = hostRoom.users.findIndex((r) => (r.roomId === player.roomId))
                hostRoom.users[playerIdx].score += player.score;
                // console.log('hostRoom.users after update:\n', hostRoom)
                socket.emit('update-score', player.score)
            }
            socket.to(hostRoom.roomId).emit('update-players', { players: hostRoom.users, submitters: hostRoom.submitters })

        }
    })
    socket.on('update-room-data', (balootData) => {
        console.log('event: update-room-data')
        const { questions, username } = balootData;
        let currRoom = rooms.find((r) => (r.roomId === socket.id))
        currRoom.username = username;
        currRoom.questions = questions;
        socket.emit('room', currRoom)
    })
    socket.on('remove-player', (playerId) => {
        console.log('event: remove-player')
        if (!Boolean(playerId)) return;
        let hostId = _getCurrHostId(playerId, rooms)
        let hostRoom = hostId ? rooms.find((r) => (r.roomId === hostId)) : false;
        if (hostRoom) {
            let newPlayersArr = hostRoom.users.filter((player) => (player.roomId !== playerId))
            hostRoom.users = newPlayersArr
            socket.emit('room', hostRoom)
        }

    })
    socket.on('next-question', () => {
        console.log('event: next-question')
        let currRoom = rooms.find((r) => (r.roomId === socket.id))
        if (currRoom && currRoom.currQuestionIndex < currRoom.questions.length - 1) {
            currRoom.currQuestionIndex++;
            socket.emit('init-submitters');
            currRoom.submitters = 0;
            io.sockets.in(currRoom.roomId).emit('time-left', (NaN))
            console.log('line224 ', currRoom)
            io.sockets.in(currRoom.roomId).emit('game-status', { status: 'GameOn' })
            currRoom.status = 'GameOn';
            _setQuestion(socket.id)
            _startTimer(socket.id)
        } else if (currRoom && currRoom.currQuestionIndex === currRoom.questions.length - 1) {
            console.log('game over')
            if (currRoom.status !== 'GameOver') {
                console.log('line232 ', currRoom)
                io.sockets.in(currRoom.roomId).emit('game-status', { status: 'GameOver', data: _genWinnersObj(currRoom.users) })
                // io.sockets.in(currRoom.roomId).emit('get-winners', _genWinnersObj(currRoom.users))

                currRoom.status = 'GameOver';
                // console.log('line 222, clearing Timer')
                let Timers = TimerObjs.filter((T) => (T.roomId === currRoom.roomId && T.QuestionIndex === currRoom.currQuestionIndex))
                // console.log('line 225,Timers found:', Timers)
                // let TimerIndices=[]
                Timers.forEach((Timer) => {
                    // console.log('clearing:', Timer.TimerObj[Symbol.toPrimitive]())
                    clearInterval(Timer.TimerObj[Symbol.toPrimitive]())
                })
            }
        }
    })
    socket.on('change-game-status', (newStatus) => { //only host triggers this event, currRoom=host!!!
        let currRoom = rooms.find((r) => (r.roomId === socket.id))
        if (currRoom.status === newStatus) {
            console.log('status already is: ', newStatus, 'bye bye')
            return;
        }
        console.log('event: change-game-status', newStatus)
        console.log('switching status to:', newStatus)
        let Timers = TimerObjs.filter((T) => (T.roomId === currRoom.roomId && T.QuestionIndex === currRoom.currQuestionIndex))
        console.log('line 246, Timers found:', Timers)
        Timers.forEach((Timer) => {
            clearInterval(Timer.TimerObj[Symbol.toPrimitive]())
        })
        currRoom.status = newStatus
        if (newStatus === "ScoreBoard" && !_getCurrHostId(currRoom.roomId, rooms)) {
            console.log('line264 ', currRoom)
            io.sockets.in(currRoom.roomId).emit('curr-score-board', currRoom.users)
            io.sockets.in(currRoom.roomId).emit('game-status', { status: newStatus })
        }
        else if (!_getCurrHostId(currRoom.roomId, rooms)) {
            console.log('line267 ', currRoom)
            io.sockets.in(currRoom.roomId).emit('game-status', { status: newStatus })
        }
    })

    socket.on('block-new-players', () => {
        console.log('event: block-new-players')
        let hostRoom = rooms.find((r) => (r.roomId === socket.id))
        if (!hostRoom.blockPlayers) hostRoom.blockPlayers = true;
        console.log('host with id:', hostRoom.roomId, 'block players:', hostRoom.blockPlayers)
    })
    socket.on("disconnect", () => {
        console.log('event: disconnect')
        var roomNumber = rooms.findIndex(room => {
            return room.roomId === socket.id
        })
        for (let i = 0; i < rooms.length; i++) {
            let room = rooms[i]
            room.users = room.users.filter((user) => (user !== socket.id))
            socket.to(room.roomId).emit('leave', room.users)
        }
        if (roomNumber >= 0) rooms.splice(roomNumber, 1);
        console.log('************\n***************\nrooms finally:\n', rooms)
    })

    socket.on('start-timer', () => {
        console.log('event: start-timer')
        let currRoom = rooms.find((r) => (r.roomId === socket.id))
        if (currRoom.status !== 'GameOn') {
            console.log('line300 ', currRoom, 'socket.id:', socket.id)
            io.sockets.in(socket.id).emit('game-status', { status: 'GameOn' })
            currRoom.status = 'GameOn'
            _setQuestion(socket.id)
            _startTimer(socket.id)
        }
    })
});

















// async function main() {

//     ////////////////////////////////////////////////////////////
//     // var typeNumber = 4;
//     // var errorCorrectionLevel = 'L';
//     // var qr = QR(typeNumber, errorCorrectionLevel);
//     // qr.addData('Hi!');
//     // qr.make();
//     try {

//         const collection = await dbService.getCollection('user');
//         var res = await dbService.getDocById(collection, '616eea77889625f4fd6ec0cd')
//         console.log(res)

//     } catch (e) {
//         console.log(e)
//     }

// }
// main()