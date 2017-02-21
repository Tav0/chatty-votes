import React from 'react';

class HomePage extends React.Component {
    render() {
        return (
            <div>
                <h2>Chatty Survey</h2>
                <div>Take surveys while chatting about the questions!</div>
                <div>
                    <h5>Technologies used:</h5>
                    <ul>
                        <li>React.JS and Redux for our front-end</li>
                        <li>node.js with express for our API server</li>
                        <li>passport.js for sessions</li>
                        <li>MySQL as our database</li>
                        <li>Integration of Redis and websockets(socket.io) for realtime voting</li>
                    </ul>
                </div>
            </div>
        );
    }
}

export default HomePage
