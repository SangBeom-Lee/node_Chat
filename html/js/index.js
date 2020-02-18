var socket          = io()                                                              // Socket IO

/* 접속 되었을 때 실행 */
socket.on('connect', function() {
  var name          = prompt('반갑습니다!', '')

  if(!name) {
    name            = '익명'
  }

  /* 서버에 새로운 유저가 왔다고 알림 */
  socket.emit('newUser', name)
})

// 시간 가져오기
var getDate         = function(){
  var date          = new Date();
  var result        = {};

  result.hour       = date.getHours();
  result.minute     = date.getMinutes();

  return result;
}

/* 서버로부터 데이터 받은 경우 */
socket.on('update', function(data) {
  var chat          = document.getElementById('chat')                                   // 채팅창

  var message       = document.createElement('div')                                     // 메시지 DIV
  var node          = "";          // 형식 넣기
  var className     = ''                                                                // DIV 클래스

  // 타입에 따라 적용할 클래스를 다르게 지정
  switch(data.type) {
    case 'message':
      className     = 'other'
      node          = ""
      break

    case 'connect':
      className     = 'connect'
      node          = document.createTextNode(`${data.name}: ${data.message}`)
      break

    case 'disconnect':
      className     =  'disconnect'
      node          = document.createTextNode(`${data.name}: ${data.message}`)
      break
  }

  if(className == "other"){
      var img       = document.createElement('img')
      var msg       = document.createElement('div')
      var h3        = document.createElement('h3')
      var msgBody   = document.createElement('span')
      var time      = document.createElement('span')
      var date      = getDate();
      var sendTime  = date.hour+":"+date.minute;
      var timeLine  = document.createTextNode(sendTime)                                 // 발송 시간

      
      h3.appendChild(document.createTextNode(`${data.name}`))                           // 이름
      msgBody.appendChild(document.createTextNode(`${data.message}`))                   // 메시지
      time.appendChild(timeLine)                                                        //
      msg.appendChild(h3)
      msg.appendChild(msgBody)
      message.appendChild(img)
      message.appendChild(msg)
      message.appendChild(time)
  }

  message.classList.add(className)                                                      // DIV 해당 클래스 넣기
  if(node != "" && node != null){
    message.appendChild(node)
  }  
  chat.appendChild(message)
})

/* 메시지 전송 함수 */
var send            = function() {
  var message       = document.getElementById('test').value                             // 입력되어있는 데이터 가져오기
  document.getElementById('test').value = ''                                            // 가져왔으니 데이터 빈칸으로 변경
  var date          = getDate();
  var sendTime      = date.hour+":"+date.minute;

  var chat          = document.getElementById('chat')                                   // 내가 전송할 메시지 클라이언트에게 표시
  var msg           = document.createElement('div')
  var msgTag        = document.createElement('span')
  var node          = document.createTextNode(message)
  var timeTag       = document.createElement('span')
  var timeLine      = document.createTextNode(sendTime)

  msg.classList.add('me')
  timeTag.appendChild(timeLine)
  msgTag.appendChild(node)
  msg.appendChild(timeTag)
  msg.appendChild(msgTag)
  chat.appendChild(msg)

  // 서버로 message 이벤트 전달 + 데이터와 함께
  socket.emit('message', {
    type    : 'message', 
    message : message,
    time    : sendTime
  })
}
