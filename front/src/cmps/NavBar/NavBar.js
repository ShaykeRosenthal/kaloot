import React, { useContext, useEffect, useState } from 'react';
import MainContext from '../../store/MainContext'
import classes from './NavBar.module.css'
import history from '../../history.js';
import KALOOT_SHORT from '../../assets/kaloot-short.png'
import { Link } from 'react-router-dom'
function NavBar(props) {
    const [open, setOpen] = useState(false)

    useEffect(() => {
        console.log('open is:', open)
        // setOpen(false)
    }, [])
    useEffect(() => { console.log('open is:', open) }, [open])
    const mainCTX = useContext(MainContext)
    if (Object.keys(mainCTX.currUser).length > 0) {
        return (<div className={(open === true) ? classes['nav-bar-cont-open'] : classes['nav-bar-cont']}>
            <div className={(open === true) ? classes['hamburger-open'] : classes['hamburger']} onClick={() => {
                if (window.innerWidth <= 770) setOpen(prevState => !prevState)
            }}>
                <div className={(open === true) ? classes['hamburger-bar1-open'] : classes['hamburger-bar1']} ></div>
                <div className={(open === true) ? classes['hamburger-bar2-open'] : classes['hamburger-bar2']} ></div>
                <div className={(open === true) ? classes['hamburger-bar3-open'] : classes['hamburger-bar3']} ></div>
            </div>
            <div className={classes['nav-bar-link-cont-user']}>
                <Link to='/' >
                    <div className={(open === true) ? classes['nav-bar-btn'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><img src={KALOOT_SHORT} style={{ width: '35px' }}></img></div>
                </Link>
                <Link to='/login'>
                    <div className={(open === true) ? classes['nav-bar-btn'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span>LOGIN/SIGNUP</span></div>
                </Link>
                <Link to='/join'>
                    <div className={(open === true) ? classes['nav-bar-btn'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span>JOIN GAME</span></div>
                </Link>
                <Link to='/search'>
                    <div className={(open === true) ? classes['nav-bar-btn'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span >EXPLORE</span></div>
                </Link>
                <Link to='/my baloots'>
                    <div className={(open === true) ? classes['nav-bar-btn'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span >MY KALOOTS</span></div>
                </Link>
                <Link to='/create'>
                    <div className={(open === true) ? classes['nav-bar-btn'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span >CREATE</span></div>
                </Link>
                <Link to='/favorites'>
                    <div className={(open === true) ? classes['nav-bar-btn'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span >FAVORITES</span></div>
                </Link>
            </div>
            <div className={classes['nav-bar-link-cont-user']}>
                <Link to='/'>
                    <div className={(open === false) ? classes['nav-bar-btn-user'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><img src={KALOOT_SHORT} style={{ width: '35px' }}></img></div>
                </Link>
                <Link to='/login'>
                    <div className={(open === false) ? classes['nav-bar-btn-user'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span>LOGIN/SIGNUP</span></div>
                </Link>
                <Link to='/join'>
                    <div className={(open === false) ? classes['nav-bar-btn-user'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span>JOIN GAME</span></div>
                </Link>
                <Link to='/search'>
                    <div className={(open === false) ? classes['nav-bar-btn-user'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span>EXPLORE</span></div>
                </Link>
                <Link to='/my baloots'>
                    <div className={(open === false) ? classes['nav-bar-btn-user'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span >MY KALOOTS</span></div>
                </Link>
                <Link to='/create'>
                    <div className={(open === false) ? classes['nav-bar-btn-user'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span >CREATE</span></div>
                </Link>
                <Link to='/favorites'>
                    <div className={(open === false) ? classes['nav-bar-btn-user'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span >FAVORITES</span></div>
                </Link>
            </div>
        </div>)

    } else {
        return (<div className={(open === true) ? classes['nav-bar-cont-open'] : classes['nav-bar-cont']}>
            <div className={(open === true) ? classes['hamburger-open'] : classes['hamburger']} onClick={() => {
                if (window.innerWidth <= 770) setOpen(prevState => !prevState)
            }}>
                <div className={(open === true) ? classes['hamburger-bar1-open'] : classes['hamburger-bar1']} ></div>
                <div className={(open === true) ? classes['hamburger-bar2-open'] : classes['hamburger-bar2']} ></div>
                <div className={(open === true) ? classes['hamburger-bar3-open'] : classes['hamburger-bar3']} ></div>
            </div>
            <div className={classes['nav-bar-link-cont-no-user']}>
                <Link to='/'>
                    <div className={(open === true) ? classes['nav-bar-btn'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><img src={KALOOT_SHORT} style={{ width: '35px', margin: '5px 5px 5px 5px' }}></img></div>
                </Link>
                <Link to='/login'>
                    <div className={(open === true) ? classes['nav-bar-btn'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span>LOGIN/SIGNUP</span></div>
                </Link>
                <Link to='/join'>
                    <div className={(open === true) ? classes['nav-bar-btn'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span >JOIN GAME</span></div>
                </Link>
                <Link to='/search'>
                    <div className={(open === true) ? classes['nav-bar-btn'] : classes['none']} onClick={() => {
                        if (window.innerWidth <= 770) setOpen(prevState => !prevState)
                    }}><span >EXPLORE</span></div>
                </Link>
            </div>
            <Link to='/login'>
                <div className={(open === false) ? classes['login'] : classes['none']} onClick={() => { if (window.innerWidth <= 770) setOpen(prevState => !prevState) }}><span>LOGIN/SIGNUP</span></div>
            </Link>
            <Link to='/join'>
                <div className={(open === false) ? classes['login'] : classes['none']} onClick={() => { if (window.innerWidth <= 770) setOpen(prevState => !prevState) }}><span>JOIN GAME</span></div>
            </Link>
            <Link to='/search'>
                <div className={(open === false) ? classes['login'] : classes['none']} onClick={() => { if (window.innerWidth <= 770) setOpen(prevState => !prevState) }}><span>EXPLORE</span></div>
            </Link>
            <Link to='/'>
                <div className={(open === false) ? classes['home'] : classes['none']} onClick={() => { if (window.innerWidth <= 770) setOpen(prevState => !prevState) }}><img style={{ width: '35px' }} src={KALOOT_SHORT}></img></div>
            </Link>
        </div>)
    }

} export default NavBar
