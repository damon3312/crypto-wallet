import React, { Component } from 'react';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <div className="center">
          <h1 className="title">Cryptocurrency Wallet</h1>
          <h2 className="subtitle">Manage your cryptocurrencies with ease</h2>
          <button>Create Account</button>
          <button>Log In</button>
        </div>
      </div>
    );
  }
}

export default App;
