// import React, { Component } from 'react';
import { useState, useEffect, useContext } from 'react'
import MainContext from '../../store/MainContext'
import history from '../../history'
import classes from './login.module.css'
import Logo from '../../assets/kahoot.png'
import USER_IMAGE from '../../assets/user_prof_img.png'
import KALOOT_LOGO from '../../assets/kaloot.png'
function LoginPage(props) {
    var mainCTX = useContext(MainContext)
    const [userName, setUserName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [email2, setEmail2] = useState('')
    const [password2, setPassword2] = useState('')
    const [imgURL, setImgURL] = useState('')
    const [msg, setMsg] = useState({ msg: '' })
    const [userCreds, setUserCreds] = useState({})
    const [JustEntered, setJustEntered] = useState(true)
    useEffect(() => {
        console.log(mainCTX)
        document.querySelector('body').style.backgroundColor = 'white'
        if (document.querySelector('div#qr-cont')) document.querySelector('div#qr-cont').remove()
    }, [])
    // useEffect(() => { console.log('username:', userName) }, [userName])
    // useEffect(() => { console.log('imgURL:', imgURL) }, [imgURL])
    // useEffect(() => { console.log('email:', email) }, [email])
    // useEffect(() => { console.log('email2:', email2) }, [email2])
    useEffect(() => { setMsg({ msg: '' }) }, [userCreds])
    useEffect(() => { if (msg.msg !== '') alert(msg.msg) }, [msg])
    useEffect(() => {
        console.log(userCreds)
        const blah = async () => {
            try {

                await mainCTX.handleCurrUser(userCreds);

            } catch (err) {
                console.log(err)
            }
        }
        blah();
    }, [userCreds])
    useEffect(() => {
        console.log("JustEntered: ", JustEntered)
        console.log('Object.keys(mainCTX.currUser).length :', Object.keys(mainCTX.currUser).length)
        if (Object.keys(mainCTX.currUser).length === 0 && JustEntered === true) return
        if (Object.keys(mainCTX.currUser).length !== 0 && JustEntered === false && !Object.keys(mainCTX.currUser).includes('error')) {
            history.push('/')
        } if (Object.keys(mainCTX.currUser).includes('error')) {
            setMsg({ msg: mainCTX.currUser['error'] })
            initPage()
        }
        // else {
        //     setMsg({ msg: "login unsuccessful" })
        // }

    }, [mainCTX.currUser])
    function initPage() {
        setUserName('')
        setEmail('')
        setPassword('')
        setEmail2('')
        setPassword2('')
        setImgURL('')
        setUserCreds({})
    }
    const doSignup = async ev => {
        ev.preventDefault();
        if (!email || !password || !userName) {
            setMsg({ msg: 'All inputs besides image are required!' });
            initPage()
            return;
        }
        setJustEntered(false)
        setUserCreds({ action: 'SIGNUP', email, password, "username": userName, imgURL });

    };
    const doLogin = async ev => {
        ev.preventDefault();
        if (!email2 || !password2) {
            setMsg({ msg: 'Login info missing!' });
            initPage()
            return;
        }
        setJustEntered(false)
        setUserCreds({ action: 'LOGIN', email: email2, password: password2 });

    };
    const doLogOut = async ev => {
        console.log('logging out...')
        mainCTX.logOut()
    }
    if (Object.keys(mainCTX.currUser).length === 0 || Object.keys(mainCTX.currUser)[0] === 'error') {
        if (Object.keys(mainCTX.currUser)[0] === 'error') {
            mainCTX.logOut()
        }
        return (<div className="login-page-container">
            <img src={KALOOT_LOGO} className={classes.logo}></img>
            <div className={classes['login-forms-container']}>
                <form className={classes['user-login']} onSubmit={doSignup}>
                    <input type="text" name="email" placeholder="email address" autoComplete="email" required onChange={(event) => { setEmail(event.target.value) }} value={email} />
                    <input type="password" name="password" placeholder="password" autoComplete="current-password" required onChange={(event) => { setPassword(event.target.value) }} value={password} />
                    <input type="text" name="username" placeholder="username" required autoComplete="username" onChange={(event) => { setUserName(event.target.value) }} value={userName} />
                    <input type="text" name="img-url" placeholder="profile image URL" onChange={(event) => { setImgURL(event.target.value) }} value={imgURL} />
                    <button className={classes['login-submit-btn']}>Sign Up</button>

                </form>
                <form className={classes['user-login']} onSubmit={doLogin}>

                    <input type="text" name="email2" placeholder="email address" autoComplete="email" required onChange={(event) => { setEmail2(event.target.value) }} value={email2} />
                    <input type="password" name="password2" placeholder="password" required autoComplete="current-password" onChange={(event) => { setPassword2(event.target.value) }} value={password2} />
                    <button className={classes['login-submit-btn']}>Login</button>
                </form>
                <div className={classes['info']}>
                    <span className={classes['info-header']}>Signup or Login with a demo account </span>
                    <div className={classes['info-username-cont']}>
                        <span className={classes['info-username']}>username:</span>
                        <span>user1@mail.com</span>
                    </div>
                    <div className={classes['info-password-cont']}>
                        <span className={classes['info-password']}>password:</span>
                        <span>user1</span>
                    </div>
                </div>
            </div>
        </div>);
    }
    else {
        return (<div className={classes['log-out-cont']}>
            <div className={classes['log-out']}>
                <span>Logged In as:{mainCTX.currUser.username}</span>

                <img className={classes['user-image']} src={mainCTX.currUser.imgURL || USER_IMAGE}></img>
                <button onClick={doLogOut}>LOGOUT</button>

            </div>

        </div>)
    }
}

export default LoginPage