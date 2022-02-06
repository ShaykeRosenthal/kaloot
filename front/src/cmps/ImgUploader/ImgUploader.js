import React, { useContext, useEffect, useState, useRef } from 'react';
import classes from './ImgUploader.module.css'
import resizeImage from './resizeImage';
import NewQuestionContext from '../ministore/NewQuestionContext';
function ImgUploader(props) {
    const currQuestionContext = useContext(NewQuestionContext);
    const imgURLref = useRef();
    const {imgURL,setImgURL}=currQuestionContext
    const IMAGE_WIDTH = 350;
    const IMAGE_HEIGHT = 350;
    function fileChangedHandler(ev) {
        console.log('file change!')
        readImage(ev.target.files[0])
    }
    function readImage(file) {
        // Check if the file is an image.
        if (file && file.type && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.addEventListener('load', (event) => {
                resizeImage(event.target.result, IMAGE_WIDTH, IMAGE_HEIGHT).then(resizedImg => {
                    setImgURL(resizedImg)
                    imgURLref.current.value = '';
                })
            });
            reader.readAsDataURL(file);
        } else {
            alert('the file is not an image')
            return;
        }

    }
    function uploadHandler() {
        console.log('upload bt was clicked')
    }

    function handleURL(ev){
        setImgURL(ev.target.value)
        imgURLref.current.value=''
    }

    return (<div className={classes['main-container']}>
        <div className={classes['file-upload-container']}>
            <div className={classes['image-url-container']}>
                {!imgURL && <span className={classes['img-upload-label']}>upload a photo: </span>}
                <input type="file" className={classes['file-upload']} onChange={fileChangedHandler} />
            </div>
            <div className={classes['image-url-container']}>
                {!imgURL && <span className={classes['img-upload-label']}>image url: </span>}
                <input type="text" ref={imgURLref} className={classes['image-url-input']} placeholder="image URL" onChange={handleURL} />
            </div>
        </div>
        {Boolean(imgURL) && <img src={imgURL} alt="no image was chosen" className={classes['image-preview']} width={'auto'} height={IMAGE_HEIGHT + 'px'} />}
    </div>)

} export default ImgUploader