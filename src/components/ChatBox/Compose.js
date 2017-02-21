import React from 'react';
import style from './styles.css';

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

export default Compose;
