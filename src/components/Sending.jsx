import React from 'react';
const e = React.createElement;

class Sending extends React.Component {

    constructor(props) {
        super(props);
        this.state = {text: ''};
        this.sendMessage = this.sendMessage.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render() {
        const form = e('textarea', {className: "form-control my-2", value: this.state.text, onChange: this.handleChange}, this.state.text)
        const send = e("button", {onClick: this.sendMessage, className: "btn btn-primary"}, 'Send');
        return e("div", {}, form, send);
    }

    handleChange(e) {
        this.setState({ text: e.target.value });
    }

    sendMessage(e) {
        e.preventDefault();
        this.props.socket.emit("message", {user: this.props.username, text: this.state.text});
        this.setState({ text: "" });
    }
}

export default Sending;