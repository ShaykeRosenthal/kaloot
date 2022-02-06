import { createContext, useState, useReducer, useEffect, useRef } from 'react'
import bringMeStuff from '../services/httpService'
import socketIOClient from "socket.io-client";
// var socket = socketIOClient(`http://localhost:3030`);
var socket = socketIOClient(`https://kaloot.herokuapp.com/`);
const MainContext = createContext({
    currUser: {},
    topRated: [],
    currBaloot: {},
    currRoomId: '',
    players: [],
    currGameData: { question: '', answers: [], imgURL: '', timeToAnswer: '', score: 0, winners: {} },
    currTimeLeft: '',
    numberOfSubmitters: 0,
    gameFlag: 'init',
    handleCurrUser: () => { },
    getTopRated: () => { },
    getBalootById: () => { },
    toggleFavoriteItem: () => { },
    joinRoomId: () => { },
    addNewBaloot: () => { },
    updateBaloot: () => { },
    deleteBaloot: () => { },
    publishBaloot: () => { },
    submitAnswer: () => { },
    advanceQuestion: () => { },
    updateRoomDataWithBalootData: () => { },
    startTimer: () => { },
    setCurrGameData: () => { },
    setCurrTimeLeft: () => { },
    removePlayer: () => { },
    blockNewPlayers: () => { },
    handleGameFlag: () => { },
    handleCurrBaloot: () => { },
    logOut: () => { },
    setGameFlag: () => { },
    setNumberOfSubmitters: () => { },
    setPlayers: () => { },
    gameInit: () => { }
})
export function MainContextProvider(props) {
    const [currUser, setCurrUser] = useState({})
    const [topRated, setTopRated] = useState([])
    const [currBaloot, setCurrBaloot] = useState({})
    const [currGameData, setCurrGameData] = useState({ question: '', answers: [], timeToAnswer: '', imgURL: '', score: 0, winners: {} })
    const [currTimeLeft, setCurrTimeLeft] = useState('')
    const [players, setPlayers] = useState([])
    const [currRoomId, setCurrRoomId] = useState('')
    const [gameFlag, setGameFlag] = useState('init')
    const [numberOfSubmitters, setNumberOfSubmitters] = useState(0)
    // const refUser = useRef({})
    const refBaloot = useRef({})
    const context = {
        currUser: currUser,
        topRated: topRated,
        currBaloot: (Object.keys(refBaloot.current).length !== 0) ? refBaloot.current : currBaloot,
        currRoomId: currRoomId,
        players: players,
        currTimeLeft: currTimeLeft,
        currGameData: currGameData,
        numberOfSubmitters: numberOfSubmitters,
        gameFlag: gameFlag,
        handleCurrUser: handleUserLogin, // add also a signUp function and combime it with login function
        getTopRated: getTopRatedBaloots,
        getBalootById: getBalootById,
        toggleFavoriteItem: toggleFavoriteItem,
        joinRoomId: joinRoomId,
        addNewBaloot: () => { },
        updateBaloot: () => { },
        deleteBaloot: () => { },
        publishBaloot: () => { },
        submitAnswer: submitAnswer,
        advanceQuestion: advanceQuestion,
        updateRoomDataWithBalootData: updateRoomDataWithBalootData,
        startTimer: startTimer,
        setCurrGameData: setCurrGameData,
        setCurrTimeLeft: setCurrTimeLeft,
        removePlayer: removePlayer,
        blockNewPlayers: blockNewPlayers,
        handleGameFlag: handleGameFlag,
        handleCurrBaloot: handleCurrBaloot,
        setGameFlag: setGameFlag,
        setNumberOfSubmitters: setNumberOfSubmitters,
        setPlayers: setPlayers,
        gameInit: gameInit,
        logOut: logOut
    }

    useEffect(() => {
        sessionStorage.setItem('score', JSON.stringify(currGameData.score))
        // sessionStorage.setItem('currUser', JSON.stringify(currUser));
        sessionStorage.setItem('currBaloot', JSON.stringify(refBaloot.current))
        sessionStorage.setItem('answers', JSON.stringify(currGameData.answers))
        sessionStorage.setItem('imgURL', JSON.stringify(currGameData.imgURL))
        sessionStorage.setItem('question', JSON.stringify(currGameData.question))
        sessionStorage.setItem('# submits', JSON.stringify(numberOfSubmitters))
        // socket.emit('change-game-status', 'init')
        if (Object.keys(currUser).length === 0 && sessionStorage.getItem('currUser')) {

            setCurrUser(JSON.parse(sessionStorage.getItem('currUser')))
            // console.log("~~~getting user from sessionStorage", JSON.parse(sessionStorage.getItem('currUser')))
        }
    }, [])
    useEffect(() => {
        console.log('number of submitters so far is: ', numberOfSubmitters)
        if (numberOfSubmitters > 0 && numberOfSubmitters === players.length) {
            // console.log('gonna fire status change, gameFlag:', gameFlag)
            socket.emit('change-game-status', 'ScoreBoard')

        }
    }, [numberOfSubmitters])
    useEffect(() => {
        sessionStorage.setItem('timeLeft[sec]', currTimeLeft)
        if ((parseInt(currTimeLeft) <= 0) && (gameFlag === 'GameOn')) {
            socket.emit('change-game-status', 'ScoreBoard')
        }
    }, [currTimeLeft, gameFlag])
    useEffect(() => {
        console.log("refBaloot:", refBaloot.current)
        console.log("currBaloot:", currBaloot)


    }, [currBaloot, refBaloot])

    socket.on('room', (room) => { //get all the rooms
        if (Object.keys(room).length !== 0) {
            sessionStorage.setItem('roomId', JSON.stringify(room.roomId))
            setCurrRoomId(room.roomId)
            sessionStorage.setItem('players', JSON.stringify(room.users))
            setPlayers(room.users)
            sessionStorage.setItem('QR', JSON.stringify(room.QR))
        }
    })

    socket.on('error', (msg) => {
        alert(msg)
    })
    socket.once('curr-score-board', (playersArr) => {
        // console.log('event: curr-score-board')
        setPlayers(playersArr)
        // socket.removeListener('curr-score-board')

    })
    socket.on('init-submitters', () => {
        setNumberOfSubmitters(0)
        sessionStorage.setItem('# submits', JSON.stringify(numberOfSubmitters))
    })
    socket.on('update-players', (data) => {

        // if(currRoomId===socket.id){

        // console.log('updating players arr', data)
        setPlayers(data.players)
        sessionStorage.setItem('players', JSON.stringify(data.players))
        sessionStorage.setItem('# submits', JSON.stringify(data.submitters))
        setNumberOfSubmitters(data.submitters)

        // }
    })
    socket.on('time-left', (timeSTR) => {
        setCurrTimeLeft(timeSTR)
    })
    socket.on('update-score', (newScore) => {
        setCurrGameData((prevState) => ({ ...prevState, score: newScore }))
        sessionStorage.setItem('score', JSON.stringify(newScore))
    })
    socket.on('visitor', (room) => { //gets the updated room
        if (socket.id === room.roomId) {
            sessionStorage.setItem('roomId', JSON.stringify(room.roomId))
            // var currPlayers = room.users.map((player) => (player.username))
            setPlayers(prevState => (room.users))
            sessionStorage.setItem('players', JSON.stringify(room.users))
        }
    })
    socket.on('current-answers', (data) => {
        // console.log('yoohoo some data arrived:', data)
        setCurrGameData((prevState) => ({ ...prevState, question: data.question, timeToAnswer: data.timeToAnswer, answers: data.answers, imgURL: data.imgURL }))

    })
    socket.on('leave', (updatedRoomPlayers) => {
        sessionStorage.setItem('players', JSON.stringify(updatedRoomPlayers))
    })
    socket.once('game-status', handleStatus)
    // socket.on('get-winners', (winnersObj) => {
    //     if (!Boolean(Object.keys(currGameData.winners).length)) {

    //         console.log('get winners: ', winnersObj)
    //         setCurrGameData((prevState) => ({ ...prevState, winners: winnersObj }))
    //     }

    // })
    function gameInit() {
        setCurrGameData({ question: '', answers: [], timeToAnswer: '', imgURL: '', score: 0, winners: {} })
        setCurrTimeLeft('')
        setGameFlag('init')
        setNumberOfSubmitters(0)
        setPlayers([])
        sessionStorage.setItem('players', JSON.stringify([]))
        sessionStorage.setItem('score', 0)
        sessionStorage.setItem('answers', JSON.stringify([]))
        sessionStorage.setItem('question', JSON.stringify(""))
        sessionStorage.setItem('# submits', 0)
    }
    function handleGameFlag() {
        socket.emit('change-game-status', 'GetReady')
    }
    function handleStatus(statusObj) {


        // console.log('status:', statusObj.status, 'winners: ', statusObj.data)
        setGameFlag(statusObj.status)
        if (statusObj.status === 'GameOver') {
            // socket.removeAllListeners()
            setCurrGameData((prevState) => ({
                ...prevState, winners: statusObj.data
            }))
        }


    }

    async function removePlayer(playerId) {
        try {
            socket.emit('remove-player', playerId)
        } catch (err) {
            console.log(err)
        }

    }
    async function logOut() {
        setCurrUser({})
        // let username=currUser.username
        // let password=
        bringMeStuff('auth/logout', 'GET')
        sessionStorage.setItem('currUser', JSON.stringify({}))
    }
    async function handleUserLogin(creds) {
        var res;
        if (Object.keys(creds).length === 0) return
        // console.log('user tried to login with: ', creds)
        try {
            if (creds.action === 'LOGIN') {
                res = await bringMeStuff('auth/login', 'POST', creds)
            }

            if (creds.action === 'SIGNUP') {
                var check = await bringMeStuff(`user?email=${creds.email}`, 'GET')
                if (Object.keys(check).length !== 0 && Object.keys(check).includes('error')) check = false;
                // console.log("check is: ", check)
                res = (!check) ? await bringMeStuff('auth/signup', 'POST', creds) : { error: 'this user already exists' }
            }

            if (creds.action === 'GET_BY_ID') {
                console.log('handleUserLogin here, creds:', creds)
                res = await bringMeStuff(`user?id=${creds.id}`, 'GET')
                console.log('user after grabbing by id:', res)
            }
            let { baloot } = res
            console.log('~~baloot:', baloot, '~~res', res)
            let baloots_prms;
            if (baloot) baloots_prms = baloot.map((id) => {
                let prm = getBalootById(id, false, false)
                return prm
            })
            let full_baloots = baloot ? await Promise.all(baloots_prms) : []
            res.baloot = full_baloots
            let { favorites } = res
            let favorites_prms
            if (favorites) favorites_prms = favorites.map((id) => {
                let prm = getBalootById(id, false, false)
                return prm
            })
            let full_favorites = favorites ? await Promise.all(favorites_prms) : []
            res.favorites = full_favorites
            setCurrUser(res)
            // refUser.current = res;
            setCurrUser(res)
            sessionStorage.setItem('currUser', JSON.stringify(res));

        } catch (err) {
            console.log(err)
        }
    }
    async function getTopRatedBaloots() {
        try {

            var res = await bringMeStuff(`baloot?isTopRated=true`, 'GET')
            setTopRated(prevState => res)
            sessionStorage.setItem('BalootTopRated', JSON.stringify(res))
        } catch (err) {
            console.log(err)
        }
    }
    function handleCurrBaloot(baloot) {
        setCurrBaloot(baloot)
        refBaloot.current = baloot;
        sessionStorage.setItem('currBaloot', JSON.stringify(baloot))
    }
    async function getBalootById(id, updateBalootFlag = false, updateUserFlag = false) {
        try {
            var res = await bringMeStuff(`baloot/${id}`, 'GET')
            if (updateBalootFlag) {
                handleCurrBaloot(res)
                refBaloot.current = res;
            }
            if (updateUserFlag) handleUserLogin({ action: "GET_BY_ID", id: currUser._id })
        } catch (err) {
            console.log(err)
        }
        return res
    }

    async function toggleFavoriteItem(id) {
        try {
            console.log(`this is mainCTX,adding/removing item ${id} to your favorites..`)
            let user = currUser;
            let newFavs = []
            if (currUser.favorites.find(fav => (fav._id === id))) {
                newFavs = currUser.favorites.filter(fav => (fav._id !== id)).map((fav) => (fav._id))
                console.log('baloot exists in favs--->removing baloot')
            } else {
                newFavs = currUser.favorites.map((fav) => (fav._id))
                newFavs.push(id)
                console.log('baloot does not exist in favs--->adding baloot')
            }
            user.favorites = newFavs
            user.baloot = currUser.baloot.map((baloot) => (baloot._id))
            console.log('user before update:', user)
            var updatedUser = await bringMeStuff(`user/${user._id}`, 'PUT', user)
            console.log('updatedUser:', updatedUser)
            await handleUserLogin({ action: "GET_BY_ID", id: currUser._id })
        } catch (err) {
            console.log(err)
        }
    }
    async function advanceQuestion() {
        try {
            socket.emit('next-question')
            console.log('next question!!!')
        } catch (err) {
            console.log(err)
        }
    }
    async function joinRoomId(playerData) {
        try {
            // console.log('this is function joinRoomId, the id recieved is:', playerData)
            socket.emit('join-room', playerData)
        } catch (err) {
            console.log(err)
        }
    }

    async function submitAnswer(ans) {
        try {
            // console.log('submitting answer: ', ans, 'to socket server')
            socket.emit('submit-answer', ans)

        } catch (err) {

        }
    }
    async function updateRoomDataWithBalootData() {
        try {
            if (currUser && currBaloot && Object.keys(currBaloot).length !== 0 && Object.keys(currUser).length !== 0) {
                let dataToSend = { questions: currBaloot.questions, username: currUser.username }
                socket.emit('update-room-data', dataToSend)
            }
        } catch (err) {
            console.log('err', err)
        }
    }
    async function startTimer() {
        try {
            socket.emit('start-timer')
        } catch (err) {
            console.log('err', err)
        }
    }

    async function blockNewPlayers() {
        try {
            socket.emit('block-new-players')
        } catch (err) {
            console.log(err)
        }
        return true;
    }


    return (
        <MainContext.Provider value={context}>
            {props.children}
        </MainContext.Provider>

    )

}
export default MainContext;