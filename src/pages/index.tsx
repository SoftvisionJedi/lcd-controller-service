import { Component } from "react";
import io from "socket.io-client";
import axios, { AxiosResponse } from "axios";

class HomePage extends Component<any, any> {
  static async getInitialProps(): Promise<object> {
    const response: AxiosResponse = await axios("/messages");
    const messages = await response.data;
    return { messages };
  }

  static defaultProps: any = {
    messages: [],
  };

  // init state with the prefetched messages
  state: any = {
    field: '',
    messages: this.props.messages,
  };

  socket: SocketIOClient.Socket;

  // connect to WS server and listen event
  componentDidMount() {
    this.socket = io('http://localhost:3000');
    this.socket.on('message', this.handleMessage);
  }

  // close socket connection
  componentWillUnmount() {
    this.socket.off("message", this.handleMessage);
    this.socket.close();
  }

  // add messages from server to the state
  handleMessage = (message) => {
    this.setState((state) => ({ messages: state.messages.concat(message) }));
  };

  handleChange = (event) => {
    this.setState({ field: event.target.value });
  };

  // send messages to server and add them to the state
  handleSubmit = (event) => {
    event.preventDefault();

    // create message object
    const message = {
      id: new Date().getTime(),
      value: this.state.field,
    };

    // send object to WS server
    this.socket.emit('message', message);

    // add it to state and clean current input value
    this.setState((state) => ({
      field: '',
      messages: state.messages.concat(message),
    }));
  };

  render() {
    return (
      <main>
        <div>
          <ul>
            {this.state.messages.map((message) => (
              <li key={message.id}>{message.value}</li>
            ))}
          </ul>
          <form onSubmit={this.handleSubmit}>
            <input
              onChange={this.handleChange}
              type="text"
              placeholder="Hello world!"
              value={this.state.field}
            />
            <button>Send</button>
          </form>
        </div>
      </main>
    );
  }
}

export default HomePage;
