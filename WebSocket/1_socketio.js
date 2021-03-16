const express = require('express');
const bodyParser = require('body-parser');
const logger = require('morgan');
const static = require('serve-static');
const path = require('path');
const expressErrorHandler = require('express-error-handler');
// npm i Socket.io
const socketio = require('socket.io');
// npm i cors 
// 여러명이 한꺼번에 쓰기 위해서.. 실제 서비스에서는 필요없다 
const cors = require('cors');

const app = express();
const router = express.Router();

app.use(logger('dev'));
app.use(bodyParser.urlencoded({extended: false}))
app.use('/public', static(path.join(__dirname, "public")));

app.use('/', router);

// 에러가 나면 404 페이지로 이동시킨다.
const errorHandler = expressErrorHandler({
    static: {
        '404': './public/404.html'
    }
});

app.use(expressErrorHandler.httpError(404));
app.use(errorHandler);

const config = require('./config/config');

const server = app.listen(config.server_port, () => {
    console.log(`${config.server_port}포트로 웹서버 실행중`);
});

// socketio(socek.io 모듈)로 server를 넘겨준다.
const io = socketio(server);
console.log('socket.io 서버 준비 완료');

// io라는 객체에 sockets에 connection이라는 이벤트가 발생하면 사용자 socket객체를 socket파라미터로 받을것이다.
io.sockets.on('connection', (socket) => {
                            //socket에 사용자정보에 컨넥션에 peername이면 클라이언트의 이름이 찍히게 된다.
    console.dir(`connection : ${socket.request.connection._peername}`)  // 사용자의 해당 이름이 찍히게 된다.
    // socket객체에 remoteAddress라는 이름으로 사용자의 ip주소를 넣어준다.
    socket.remoteAddress = socket.request.connection._peername.address;
    socket.remotePort = socket.request.connection._peername.port; // 포트 번호를 넣어준다.
    console.dir(`socket.remoteAddress : ${socket.remoteAddress}`)
    console.dir(`socket.remotePort : ${socket.remotePort}`)

    // 이벤트 메세지가 발생했을 때 함수가 자동으로 실행되는데 JSON으로 만든 메세지를 보냈던걸 서버가 파라미터로 받는 것이다.
    socket.on('message', function(message){
        console.log('message 이벤트를 받았습니다.')
        console.dir(message);

        if(message.recepient == 'all'){
            console.log('모든 클라이언트에게 메세지를 보냅니다.');
            // 서버가 emit 메세지를 발생시킨다. 서버쪽에서 클라이언트에게 보내는 것이다.
            io.sockets.emit('message', message);
        }
    })
})