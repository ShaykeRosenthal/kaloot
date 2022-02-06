function joinRoom(req,res){
    // now use socket.io in your routes file
    var io = req.app.get('socketio');
    // io.emit('hi!');
    io.emit('serverMsg', 'BLAHHHH')
}

function createRoom(req,res){
    // now use socket.io in your routes file
    var io = req.app.get('socketio');
    // io.emit('hi!');
    io.emit('serverMsg', 'BLAHHHH')
}
module.exports={joinRoom,createRoom}