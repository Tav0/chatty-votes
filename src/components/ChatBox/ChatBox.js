import React from 'react';
import style from './styles.css';
import { isLoading, isError } from '../../util/loadingObject';

// IndexLinkContainer ensures that's active only if route matches.
import ChatView from 'react-chatview';

class Message extends React.Component {
    static propTypes = {
//        myself: React.PropTypes.bool,
        username: React.PropTypes.string,
        text: React.PropTypes.string,
        time: React.PropTypes.string
    }

    render() {
        
        return (
            <div className="message">
                <span>{this.props.username}: {this.props.text}</span>
            </div>
        );
    }
}

class Compose extends React.Component {
    static propTypes = {
        sendMessage: React.PropTypes.func.isRequired,
    }

    render () {
        return (
            <div className="composition-area">
                <textarea
                    ref="submitBox"
                    style={{width: "100%"}}
                    onKeyDown={this.onKeyDown.bind(this)}
                    onChange={this.onChange}
                    //value={this.props.cursor.value}
                />
            </div>
        );
    }

/*
    onChange(e) {
        this.props.cursor.set(e.target.value);
    }
*/

    onKeyDown (e) {
        if (e.keyCode === 13) {
            console.log('enter pressed: ' + e.target.value);
            e.preventDefault();
            this.props.sendMessage(e.target.value);
            this.refs.submitBox.value = "";
        }
    }
}

/**
 * Chat box component
 */
class ChatBox extends React.Component {
    static propTypes = {
        messages: React.PropTypes.array,
        sendMessage: React.PropTypes.func.isRequired,
        loadmoreHistory: React.PropTypes.func
    }

    render() {
        const messages = this.props.messages
        console.log("Chat Messages: " + JSON.stringify(messages));

//        var sendMessage = _.partial(this.props.sendMessage, _, user.id);
        
        if (isLoading(this.props.loadingStatus)) return (<p>Loading...</p>);
        return (
            <div className="message-display" style={{height: "245px"}}>
                <ChatView className="messageList"
                    flipped={true}
                    scrollLoadThreshold={15}
                    onInfiniteLoad={this.props.loadmoreHistory}>
                    {messages.map((m) => { 
                        return (
                            <Message
                                //myself={m.uid === user.id}
                                username={m.username}
                                text={m.message}
                                key={m.id}
                                time={m.time} />
                        ); 
                    })}
                </ChatView>
                <Compose sendMessage={this.props.sendMessage} />
            </div>
       );
    }
}

export default ChatBox;
