import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';




function Home() {
  return (
    <div className="center">
      <h1 className="title">Cryptocurrency Wallet</h1>
      <h2 className="subtitle">Manage your cryptocurrencies with ease</h2>
      <div>
        <Link to="/login"><button>Log In</button></Link>
        <Link to="/createAccount"><button>Create Account</button></Link>
        <Link to="/about"><button>About</button></Link>
      </div>
    </div>
  );
}


function About() {
  return (
    <div>
      <h1>About Cryptocurrency Wallet</h1>
      <p>Welcome to our new crypto wallet - allowing you to invest, save, and trade new upcoming crypto on a single platform</p>
      <p>We revolve around being user-friendly, simplistic to use, with heightened levels of security</p>
      <p> Sign upto our desktop app and join us on the road through investment</p>
      <Link to="/"><button>Back to Home</button></Link>
    </div>
  );
}

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // Check if login details are valid
    if (username === 'user' && password === 'password') {
      // If valid, redirect to user dashboard
      window.location.href = '/dashboard';
    } else {
      // If invalid, display error message
      setError('Invalid username or password. Please try again.');
    }
  };

  return (
    <div className="center">
      <h1>Login</h1>
      {error && <p className="error">{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <button type="submit">Sign In</button>
      </form>
      <p>Don't have an account?</p> 
      <div>
        <Link to="/createAccount"><button>Create Account</button></Link>
        <Link to="/"><button>Back to Home</button></Link>
      </div>
      
    </div>
  );
}

function CreateAccount() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    // TODO: Add logic to create new user with username and password
    console.log(`Username: ${username}, Password: ${password}`);
  };

  return (
    <div className="center">
      <h1>Create Account</h1>
      {error && <p className="error">{error}</p>}
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" value={username} onChange={(event) => setUsername(event.target.value)} required />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} required />
        </div>
        <Link to="/login"><button type="submit">Create Account</button></Link>
      </form>
      <p>Already have an account?</p> 
      <div>
        <Link to="/login"><button>Log In</button></Link>
        <Link to="/"><button>Back to Home</button></Link>
      </div>
      
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createAccount" element={<CreateAccount />} />
      </Routes>
    </Router>
  );
}

export default App;
