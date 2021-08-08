import Chat from './Chat'
import Sending from './Sending'
import React from 'react';
import { io } from "socket.io-client";

const url = window.location.pathname.replace("/chat=","").replace("/", "");
const ws = io('http://localhost:5000', { query: {"url" : url}, transports: ['websocket', 'polling', 'flashsocket'] })

    class User extends React.Component {

    // this component provide form for create username
    // component connect to websocket server, then server send to client url for invite friends to room.
    // there can be several chat rooms at the same time.
    constructor(props) {
        super(props);
        this.state = { username: null, url: null, enter: null, ws: null, error: null};
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
                    {this.state.error && <div className={'alert alert-danger my-2'}>{this.state.error}</div>}
                </div>) : (<div>
                    < Chat username={this.state.username} socket={ws}/>
                    < Sending username={this.state.username} socket={ws}/>
                </div>)}
            </div>
        );
    };

    // handle changes in the text box and set state 'username'
    handleChange(e) {
        if (!this.state.enter) {
            this.setState({username: e.target.value.trim()});
        }
    }

    // server send url for invite friends (if user was invited, this url is the same as that of the inviter).
    componentDidMount() {
        ws.on('inviteURL', (url) => {
                this.setState({url: url})
        });
    }

    // if username is valid, state "enter" change on "true" then user join to room and chat can be render.
    setUsername(e) {
        e.preventDefault();
        if (this.state.username && this.state.username.trim() !== '') {
            this.setState({enter: true, error: null});
            ws.emit("username", this.state.username);
        } else {
            this.setState({error: "Enter your name."})
        }
    }
}

export default User;