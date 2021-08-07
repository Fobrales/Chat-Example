import React from 'react';

class Sending extends React.Component {

    // this component send message to chat
    constructor(props) {
        super(props);
        this.state = {text: '', error: ''};
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        return (
            <div>
                <textarea className={"form-control my-2"} value={this.state.text} placeholder="Enter your message!" onChange={this.handleChange} />
                <button onClick={this.sendMessage} className={"btn btn-primary"}>Send</button>
                {this.state.error.length > 0 && <div class={'alert alert-danger my-2'}>{this.state.error}</div>}
            </div>
        );
    }

    // handle changes in message text box and set state
    handleChange(e) {
        this.setState({ text: e.target.value });
        this.setState({ error: ''})
    }

    // if message valid it send message to websocket server and clear text box
    sendMessage(e) {
        if (this.state.text.length && this.state.text.trim() !== '') {
            e.preventDefault();
            this.props.socket.emit("message", {user: this.props.username, text: this.state.text});
            this.setState({ text: "" });
        } else {
            this.setState({ error: "Enter message before sending."})
        }
    }
}

export default Sending;