import React, { useContext, useEffect, useState } from 'react';
import MainContext from '../../store/MainContext'
import Logo from '../../assets/kahoot.png'
import BalootThumb from '../../cmps/BalootThumbnail/BalootThumbnail'
import classes from './home.module.css'
import history from '../../history';
import KALOOT_LOGO from '../../assets/kaloot.png'
function HomePage(props) {
    var mainCTX = useContext(MainContext)
    useEffect(() => {
        mainCTX.getTopRated();
        document.querySelector('body').style.backgroundColor = "white";
        if (document.querySelector('div#qr-cont')) document.querySelector('div#qr-cont').remove()
        // sessionStorage.setItem('turlak','makak')
        // fetch('http://localhost:3030/').then(res => console.log(res))
        // console.log('cookie:',document.cookie)
        console.log('user is', mainCTX.currUser)
    }, [])
    useEffect(() => {
        console.log(mainCTX.topRated)
    }, [mainCTX.topRated])
    return (<div className={classes['home-page-cont']}>
        <img src={KALOOT_LOGO} className={classes.big} />
        <h1>Top Rated Kaloots</h1>
        {mainCTX.topRated ? <ul className={classes['top-rated-cont']} style={window.innerWidth > 400 ? { paddingLeft: `${(window.innerWidth - (mainCTX.topRated.length * 150 + (mainCTX.topRated.length - 1) * 10)) / 2}px` } : { paddingLeft: 'calc((100% - 310px) / 2)' }}>{mainCTX.topRated.map((baloot, index) => (<li key={index} className={classes['top-rated-list-item']}><BalootThumb balootName={baloot.balootName} imgURL={baloot.imgURL} balootId={baloot._id} /></li>))}</ul> : <span style={{ color: 'black' }}>Hold your Horses..</span>}

    </div>)
}

export default HomePage