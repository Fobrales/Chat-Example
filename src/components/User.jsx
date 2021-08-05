import { io } from "socket.io-client";
import Chat from './Chat'
import Sending from './Sending'
import React from 'react';
import ReactDOM from 'react-dom';
const e = React.createElement;
const ws = io('http://localhost:5000', { query: {"url" : getUrl()}, transports: ['websocket', 'polling', 'flashsocket'] });

function getUrl() {
    return window.location.pathname.replace("/chat=","").replace("/", "");
}

class User extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: null };
        this.setUsername = this.setUsername.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render () {
        const form = e("input", {type: "text", onChange: this.handleChange, placeholder: "Enter your name", className: "form-control my-2", size: "12"}, null);
        const enter = e("button", {onClick: this.setUsername, className: "btn btn-primary"}, 'OK');
        return e('div', null, form, enter);
    }

    componentDidMount() {
        ws.on('inviteURL', function(url) {
            ReactDOM.render(e("div", {className: "alert alert-primary my-2"}, "Invite friends using " + window.location.origin + "/chat=" + url), document.getElementById('info'));
        });
    }

    handleChange(e) {
        this.setState({"username": e.target.value})
    }

    setUsername() {
        if (this.state.username && ws) {
            ws.emit("username", this.state.username);
            ReactDOM.render(e(Chat, {username: this.state.username, socket: ws}, null), document.getElementById('chat'));
            ReactDOM.render(e(Sending, {username: this.state.username, socket: ws}, null), document.getElementById('send'))
        }
    }
}

export default User;