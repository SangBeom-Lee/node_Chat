const express       = require('express')                        // 설치한 express 모듈
const socket        = require('socket.io')                      // 설치한 socket.io 모듈
const http          = require('http')                           // Node.js 기본 내장 모듈
const fs            = require('fs')                             // Node.js 기본 내장 모듈
const app           = express()                                 // express 객체 생성
const server        = http.createServer(app)                    // express http 서버 생성
const io            = socket(server)                            // 생성된 서버를 socket.io 바인딩

// 원하는 미들웨어 추가
app.use('/css', express.static('./html/css'))
app.use('/js', express.static('./html/js'))

// Get 방식으로 /경로 접근시 실행하는 함수
app.get('/', function(request, response){
    fs.readFile('./html/index.html', function(err, data){
        if(err){
            response.send("에러")
        } else {
            response.writeHead(200, {'Content-type':'text/html'})
            response.write(data)
            response.end()
        }
    })
})

io.sockets.on('connection', function(socket){
    console.log('유저 접속 됨')

    socket.on('newUser', function(name){
        console.log(name + '님이 접속하였습니다.')

        socket.name     = name;
        io.sockets.emit('update', {
            type    : 'connect',
            name    : 'SERVER',
            message : name + '님이 접속하였습니다.'
        })
    })

    // 전송한 메시지 받기
    socket.on('message', function (data){
        console.log(data);

        data.name       = socket.name
        socket.broadcast.emit('update', data);
    })

    socket.on('send', function(data){
        console.log('전달된 메시지:', data.msg)
    })

    // 접속 종료
    socket.on('disconnect', function(){
        console.log(socket.name + '님이 나가셨습니다.')

        socket.broadcast.emit('update', {
            type    : 'disconnect',
            name    : 'SERVER',
            message : socket.name + '님이 나가셨습니다.'
        })
    })
})

// 서버를 8080 포트로 listen
server.listen(8080, function(){
    console.log('서버 실행중')
});