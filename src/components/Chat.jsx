import React from 'react';

class Chat extends React.Component {

    // this component render list of message (user see who sent message to the chat and when) and list of users who is in the chat room right now;
    constructor(props) {
        super(props);
        this.state = {messages: [], users: []};
        this.addMessage = this.addMessage.bind(this);
        this.addUser = this.addUser.bind(this);
    }

    // client get event from server then calling functions
    componentDidMount() {
        var comp = this;
        this.props.socket.on('message', function(data) {
            comp.addMessage(data);
        });
        this.props.socket.on('users', function(data) {
            comp.addUser(data);
        })
    }

    // add message to array of message
    addMessage (newMessage) {
        this.setState(prevState => ({
            messages: [...prevState.messages, newMessage]
        }))
    }

    // add username to array of users
    addUser (user) {
        this.setState({users: user})
    }

    render() {
        let users = "Here is " + this.state.users.join(', ') + ".";
        return (
            <div>
                <span className={"my-2"}>{users}</span>
                {this.state.messages.map((message, index) =>
                    <div key={index} className={"border border-primary p-2 my-1"}><span style={{float: 'right'}}>{message.time}</span>
                        <span style={{fontWeight: 'bold'}}>{message.user}: </span>
                        <span style={{overflowWrap: "anywhere"}}>{message.text}</span>
                    </div>
                )}
            </div>
        );
    }
}

export default Chat;