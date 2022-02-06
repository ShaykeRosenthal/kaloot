import React, { useContext, useEffect, useState, useRef } from 'react';
import classes from './LobbyPlayerList.module.css'
function LobbyPlayerList(props) {
    const { players, removePlayer } = props
    useEffect(() => {
        console.log('players list: ', players)
    }, [])



    let list = players.map((player, index) => (<li key={index} className={classes['player-list-item']}><div className={classes['player-item-container']}><span className={classes['player']} onClick={() => {
        console.log('removing player:', player)
        removePlayer(player.roomId)
    }}>{player.username}</span></div></li>))

    return (<div className={classes['player-list-container']}><ul className={classes['player-list']}>{list}</ul></div>)
} export default LobbyPlayerList