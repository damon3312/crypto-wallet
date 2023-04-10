import React, { useEffect, useState, useContext } from 'react';
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
      // If valid, set the logged in username and redirect to user dashboard
      localStorage.setItem('username', data[0].username);
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

function Dashboard() {
  const username = localStorage.getItem('username');
  return (
    <div className="center">
      <h1 className="title">Welcome, {username} </h1>
      <h2 className="subtitle">Please select from the options below</h2>
      <div>
        <Link to="/wallet"><button>View Wallet</button></Link>
        <Link to="/sendCrypto"><button>Send Crypto</button></Link>
        <Link to="/recieveCrypto"><button>Recieve Crypto</button></Link>
        <Link to="/History"><button>View History</button></Link>
      </div>
    </div>
  );
}

function ViewAssets(){
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const assets = ["AVAX","LUNA","FET"];

  useEffect(() => {
    assets.forEach(asset => {
      const getData = async () => {
      try {
        const response = await fetch(
          `https://api.coincap.io/v2/assets?search=${asset}`
        );
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        console.log(actualData['data']);
        setData(actualData["data"]);
        setError(null);
      } catch (err) {
        setError(err.message);
        setData(null);
      } finally {
        setLoading(false);
      }
    };
    getData();
    });
    
  }, []);


  return(
    <div>
      <h1>API Posts</h1>
      {loading && <div>Just one sec...</div>}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
      <ul>
        {data &&
          data.map(({ id, name, priceUsd }) => (
            <li key={id}>
              <h3>{name}: ${priceUsd}</h3>
            </li>
          ))}
      </ul>
    </div>
  );
}

function Wallet(){
  const [walletName, setWalletName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');

  function generateWalletAddress() {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 26; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setWalletAddress(result);
  }

  function handleSubmit(event) {
    event.preventDefault();
    if (password.length < 12 || !/[A-Z]/.test(password) || !/[\W_]/.test(password)) {
      setPasswordError('Password must be at least 12 characters long and contain at least one uppercase letter and one special character.');
    } 
  }

  return (
    <div>
      <h1>Create Wallet</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Wallet Name:
          <input type="text" value={walletName} onChange={(event) => setWalletName(event.target.value)} style={{ width: '300px' }} required />
        </label>
        <br />
          
        <label>
          Wallet Address:
          <button type="button" onClick={generateWalletAddress}>Generate Wallet Address</button>
          <input type="text" value={walletAddress} onChange={(event) => setWalletAddress(event.target.value)} style={{ width: '300px' }} required />
        </label>

        <label>
          Password:
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={{ width: '300px' }} required /> 
        </label>
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        <br />
        <button type="submit">Create Wallet</button>
        <Link to="/"><button>Home</button></Link>
      </form>
    </div>
  );
}

function SendCrypto(){
  return(
    <h1>SEND CRYPTO</h1>
  );
}

function RecieveCrypto(){
  return(
    <h1>RECIEVE CRYPTO</h1>
  );
}

function History(){
  return(
    <h1>HISTORY</h1>
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
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/wallet" element={<Wallet/>} />
        <Route path="/sendCrypto" element={<SendCrypto/>} />
        <Route path="/recieveCrypto" element={<RecieveCrypto/>} />
        <Route path="/history" element={<History/>} />
        <Route path="/viewAssets" element={<ViewAssets/>} />
      </Routes>
    </Router>
  );
}

export default App;
