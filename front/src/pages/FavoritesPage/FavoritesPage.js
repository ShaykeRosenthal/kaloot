import React, { useContext, useEffect, useState } from 'react';
import MainContext from '../../store/MainContext'
import Logo from '../../assets/kahoot.png'
import BalootThumb from '../../cmps/BalootThumbnail/BalootThumbnail'
import classes from './FavoritesPage.module.css'
import history from '../../history.js';
import KALOOT_LOGO from '../../assets/kaloot.png'

function FavoritesPage(props) {
    var mainCTX = useContext(MainContext)
    useEffect(() => {
        // mainCTX.getTopRated();
        console.log('mainCTX.currUser:', mainCTX.currUser)
        document.querySelector('body').style.backgroundColor = "white";
        if (document.querySelector('div#qr-cont')) document.querySelector('div#qr-cont').remove()
    }, [])
    useEffect(() => {
        console.log('mainCTX.currUser:', mainCTX.currUser)
    }, [mainCTX.currUser])
    return (<div className={classes['home-page-cont']}>
        <img src={KALOOT_LOGO} className={classes.big} />
        <h1>Favorites</h1>
        {(mainCTX.currUser && mainCTX.currUser.favorites.length > 0) ? <ul className={classes['top-rated-cont']}>{mainCTX.currUser.favorites.map((baloot, index) => (<li key={index} className={classes['top-rated-list-item']}><BalootThumb balootName={baloot.balootName} imgURL={baloot.imgURL} balootId={baloot._id} favoriteButton={true} isFavoriteDefault={true} /></li>))}</ul> : ''}

    </div>)
}

export default FavoritesPage