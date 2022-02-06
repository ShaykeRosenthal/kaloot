import MainContext from '../../store/MainContext';
import classes from './BalootThumbnail.module.css'
import React, { useContext, useEffect, useState } from 'react';
import history from '../../history';
function BalootThumbnail(props) {
    const mainCTX = useContext(MainContext)
    const [isFavorite, toggleFavorite] = useState(props.isFavoriteDefault)
    return (<div className={classes['tumbnail-container']} >
        {props.favoriteButton && Object.keys(mainCTX.currUser).length > 0 && <div className={classes['heart-cont']} onClick={() => {

            console.log('toggle favorite');
            mainCTX.toggleFavoriteItem(props.balootId)
            toggleFavorite(!isFavorite)
        }}>
            <svg viewBox="0 0 24 24" fill={(isFavorite === true || mainCTX.currUser.favorites.find(fav => (fav._id === props.balootId))) ? "red" : "white"} fillOpacity="1" stroke="#222222" strokeWidth="1.4" focusable="false" aria-hidden="true" role="presentation" strokeLinecap="round" strokeLinejoin="round"><path d="m17.5 2.9c-2.1 0-4.1 1.3-5.4 2.8-1.6-1.6-3.8-3.2-6.2-2.7-1.5.2-2.9 1.2-3.6 2.6-2.3 4.1 1 8.3 3.9 11.1 1.4 1.3 2.8 2.5 4.3 3.6.4.3 1.1.9 1.6.9s1.2-.6 1.6-.9c3.2-2.3 6.6-5.1 8.2-8.8 1.5-3.4 0-8.6-4.4-8.6" stroke-linejoin="round"></path></svg>
        </div>}
        <div style={{ backgroundColor: 'black', backgroundImage: `url(${props.imgURL})`, backgroundSize: 'cover', backgroundPosition: 'center', width: '100%', height: '100%' }} className={classes['baloot-image']} onClick={() => { mainCTX.getBalootById(props.balootId, true, false); history.push(`play/${props.balootId}`) }} />
        <span className={(props.favoriteButton && Object.keys(mainCTX.currUser).length > 0) ? classes['baloot-name-with-fav'] : classes['baloot-name']}>{props.balootName}</span>
    </div>)
}
export default BalootThumbnail