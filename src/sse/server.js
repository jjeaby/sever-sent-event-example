const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser');
const SseStream = require('ssestream'); // Server Send Event

const PORT = 5000;

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.get('/time/sse', function (request, response, next) {
    const headers = request.headers;
    // sseStream 생성
    const sseStream = new SseStream(request);
    // stream pipe 설정
    sseStream.pipe(response);
    // 1초(1000) 간격으로 시간을 보내주는 setInterval 구성
    const pusher = setInterval(async () => {
        // header 에 셋팅된 auth-user 정보 가져오기
        const authUser = headers["auth-user"];
        // 현재 시간, auth-user 정보를 client 로 보내주는 부분
        sseStream.write({
            event: 'sseData',
            data: { 'auth-user': authUser, 'date': new Date()},
        });
    }, 1000);

    // close 시점에 setInterval 삭제, sseStream pipe 설정 해제
    response.on('close', () => {
        console.log('server send event connection closed!');
        clearInterval(pusher);
        sseStream.unpipe(response);
    });
});


app.listen(PORT, () => {
    console.log(`Success! Your application is running on port ${PORT}.`);
});



