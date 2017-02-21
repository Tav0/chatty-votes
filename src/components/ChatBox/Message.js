import React from 'react';
import style from './styles.css';

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

export default Message;
