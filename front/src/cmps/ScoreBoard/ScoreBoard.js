import React, { useContext, useEffect, useState, useRef } from 'react';
import { useSpring, animated } from 'react-spring'
import AnimatedScore from '../AnimatedScore/AnimatedScore';
import classes from './ScoreBoard.module.css'
function ScoreBoard(props) {
    const { players } = props
    useEffect(() => {
        console.log('score board: ', players)
    }, [])


    let list = players.sort(function (player1, player2) {
        return player1.score - player2.score;
    }).reverse().map((player, index) => (<li key={index} className={classes['player-list-item']}><div className={classes['player-item-container']}><span className={classes['player']}>{player.username}</span><AnimatedScore score={player.score} /></div></li>))

    return (<div className={classes['player-list-container']}><ul className={classes['player-list']}>{list}</ul></div>)
} export default ScoreBoard