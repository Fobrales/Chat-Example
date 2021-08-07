import Chat from './Chat'
import Sending from './Sending'
import React from 'react';
import Video from './Video'
import { io } from "socket.io-client";

const url = window.location.pathname.replace("/chat=","").replace("/", "");
const ws = io('http://localhost:5000', { query: {"url" : url}, transports: ['websocket', 'polling', 'flashsocket'] })

    class User extends React.Component {

    //this component provide form for create username and connect to websocket server, then server send to client url for invite friends to room.
    // There can be several chat rooms at the same time.
    constructor(props) {
        super(props);
        this.state = { username: null, url: null, enter: null, ws: null, peerId: null};
        this.setUsername = this.setUsername.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    render () {
        return (
            <div>
                {this.state.url && <div className={"alert alert-primary my-2"} style={{overflowWrap: "anywhere"}}>Invite friends using {window.location.origin}/chat={this.state.url}</div>}
                {!this.state.enter ? (<div>
                    <input onChange={this.handleChange} placeholder={"Enter your name"} className={"form-control my-2"} />
                    <button onClick={this.setUsername} className={"btn btn-primary"}>OK</button>
                </div>) : (<div>
                    < Video username={this.state.username} socket={ws}/>
                    < Chat username={this.state.username} socket={ws}/>
                    < Sending username={this.state.username} socket={ws}/>
                </div>)}
            </div>
        );
    };

    // handle changes in the text box and set state 'username'
    handleChange(e) {
        this.setState({username: e.target.value.trim()})
    }

    // server send url for invite friends (if user was invited, this url is the same as that of the inviter).
    componentDidMount() {
        ws.on('inviteURL', (url) => {
                this.setState({url: url})
        });
    }

    // if username is valid, state "enter" change on "true" then user join to room and chat and video can be render.
    setUsername() {
        if (this.state.username.length && this.state.username.trim() !== '') {
            this.setState({enter: true})
            ws.emit("username", this.state.username);
        }
    }
}

export default User;