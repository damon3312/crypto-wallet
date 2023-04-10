import React, { useEffect, useState } from 'react';
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

  const loginCheck = async (event) => {
    event.preventDefault();

    // Send a GET request to fetch the user details
    const response = await fetch(`http://localhost:8000/details?username=${username}&password=${password}`);
    const data = await response.json();

    // Check if user details are valid
    if (data.length > 0) {
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
      <form className="form" onSubmit={loginCheck}>
        <div className="form-control">
          <label htmlFor="username">Username:</label>
          <input type="text" id="username" name="username" 
            value={username} 
            onChange={(event) => setUsername(event.target.value)} 
          required />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password:</label>
          <input type="password" id="password" name="password" 
            value={password} 
            onChange={(event) => setPassword(event.target.value)} 
          required />
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

  function handleSubmit(event) {
    event.preventDefault();
    // Create new user with username and password
    const newUser = { username, password };

    fetch('http://localhost:8000/details', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser)
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        console.log(data);
        // Redirect to login page
        window.location.href = '/login';
      })
      .catch(error => {
        console.error('Error:', error);
        setError('Unable to create account. Please try again later.');
      });
  }
  
  

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
        <button type="submit">Create Account</button>
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
