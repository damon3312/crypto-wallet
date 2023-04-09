import React from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';

function About() {
  return (
    <div>
      <h1>About Cryptocurrency Wallet</h1>
      <p>This is a cryptocurrency wallet app that lets you manage your cryptocurrencies with ease. It is built with React.</p>
    </div>
  );
}

function MainPage() {
  return (
    <Router>
      <div className="center">
        <h1 className="title">Cryptocurrency Wallet</h1>
        <h2 className="subtitle">Manage your cryptocurrencies with ease</h2>
        <div>
          <button>Create Account</button>
          <button>Log In</button>
          <Link to="/about"><button>About</button></Link>
        </div>
      </div>
      <Switch>
        <Route path="/about">
          <About />
        </Route>
      </Switch>
    </Router>
  );
}

export default MainPage;