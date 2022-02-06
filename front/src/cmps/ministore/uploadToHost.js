export default async function uploadToHost(file) {
    const fileData = new FormData();
    var response;
    fileData.append('file', file);
    fileData.append('upload_preset', 'jtwvsv0u'); // upload preset
    try {
        var upload = await fetch('https://api.cloudinary.com/v1_1/dw7o5fmcj/image/upload', {
            method: 'post',
            body: fileData
        })
        response = await upload.json();
        console.log(response)

    } catch (err) {
        console.log('could not upload image to image host', err)
    }
    return response;
}