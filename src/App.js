import React, {useEffect, useState} from 'react';
// 기본적으로 제공되는 eventsource 가 아닌 추가로 설치한 eventsource 를 사용
const EventSource = require('eventsource');

function App() {
    // Server Sent Event 로 가져온 data 를 화면에 보여주기 위한 state 변수
    const [sseDate, setSseDate] = useState();
    const [sseHeader, setSseHeader] = useState();

    useEffect(() => {
        // Server Sent Event 요청시 header 에 auth-user 를 설정하는 부분
        const eventSourceInitDict = {
            headers: {
                "auth-user": "bearer 123123123123",
            },
        };
        // EventSource 로 Server Sent Event 를 호출하는 부분
        const eventSource = new EventSource("http://localhost:5000/time/sse", eventSourceInitDict);

        // EventSource 로 data 를 받아서 처리하는 event listener 설정
        eventSource.addEventListener('sseData', async function (event) {
            const data = JSON.parse(event.data);
            setSseHeader(data['auth-user']);
            setSseDate(data['date']);
        });

        // Server Sent Event 가 종료되는 경우 연결된 EventSource 를 close 하는 부분
        eventSource.addEventListener('close', () => eventSource.close());
        return () => eventSource.close();
    }, [])
    return (
        <div>
            {/*/
            Server Sent Event 로 가져온 데이터를 화면에 보여주는 부분
            /*/}
            <center>
                <h5>header : {sseHeader}</h5>
                <h5>date : {sseDate}</h5>
            </center>
        </div>
    );
}

export default App;
