import React from 'react';
const e = React.createElement;

class Chat extends React.Component {
    constructor(props) {
        super(props);
        this.state = {messages: [], users: []};
        this.addMessage = this.addMessage.bind(this);
        this.addUser = this.addUser.bind(this);
    }

    componentDidMount() {
        var comp = this;
        this.props.socket.on('message', function(data) {
            comp.addMessage(data);
        });
        this.props.socket.on('users', function(data) {
            comp.addUser(data);
        })
    }

    addMessage (newMessage) {
        this.setState(prevState => ({
            messages: [...prevState.messages, newMessage]
        }))
    }

    addUser (user) {
        this.setState({users: user})
    }

    render() {
        const messages = this.state.messages;
        const users = this.state.users.join(', ') + ".";
        const listUsers = e("span", {className: "my-2"}, "Here is " + users);
        const listMessages = messages.map((message, index) => e("div", {key: index, className: "border border-primary p-2 my-2"},
            e("span", null, message.time + " "),
            e("span", {style: {fontWeight: 'bold'}}, message.user + ": "),
            e("span", {style: {overflowWrap: "anywhere"}}, message.text)));
        return e('div', null, listUsers, listMessages);
    }
}

export default Chat;