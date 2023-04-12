import React, { useEffect, useState, useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "primereact/resources/themes/nova-alt/theme.css"

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
        <Link to="/createWallet"><button>Create Wallet</button></Link>
        <Link to="/sendCrypto"><button>Send Cryptocurrency</button></Link>
        <Link to="/viewWallet"><button>View Wallet</button></Link>
        <Link to="/TransactionHistory"><button>Transaction History</button></Link>
        <Link to="/recieveCrypto"><button>Recieve Crypto</button></Link>
        <Link to="/History"><button>View History</button></Link>
        <Link to="/viewAssets"><button>My Crypto</button></Link>

      </div>
    </div>
  );
}

function ViewAssets(){
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const Crypto = (id, symbol, name, usdPrice, amount, total) => { return { id: id, symbol: symbol, name: name, usdPrice : usdPrice, amount: amount, total: total } }
  const [currentAssets, setCurrentAsset] = useState([]);
  const userAsset = (symbol, amount) => { return { symbol: symbol, amount: amount } }


  const userAssets = [];
  
  userAssets.push(userAsset("AVAX",6.2134));
  userAssets.push(userAsset("LUNA",54.15));
  userAssets.push(userAsset("FET",19.0223));
  userAssets.push(userAsset("DOGE",3453.89));

  //console.log(userAssets);

  React.useEffect(() => {
      const getData = async (asset) => {
      try {
        const response = await fetch(
          `https://api.coincap.io/v2/assets?search=${asset.symbol}`
        );
        if (!response.ok) {
          throw new Error(
            `This is an HTTP error: The status is ${response.status}`
          );
        }
        let actualData = await response.json();
        setCurrentAsset(currentAssets => [...currentAssets, Crypto(actualData['data']['0']['id'], actualData['data']['0']['symbol'], actualData['data']['0']['name'], actualData['data']['0']['priceUsd'], asset.amount, Number(actualData['data']['0']['priceUsd'])*asset.amount)]);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
      };
      userAssets.forEach(asset => {
        getData(asset);
     });
  }, []);

  const useSortableData = (items, config = null) => {
    const [sortConfig, setSortConfig] = React.useState(config);
  
    const sortedItems = React.useMemo(() => {
      let sortableItems = [...items];
      if (sortConfig !== null) {
        sortableItems.sort((a, b) => {
          if (a[sortConfig.key] < b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? -1 : 1;
          }
          if (a[sortConfig.key] > b[sortConfig.key]) {
            return sortConfig.direction === 'ascending' ? 1 : -1;
          }
          return 0;
        });
      }
      return sortableItems;
    }, [items, sortConfig]);
  
    const requestSort = (key) => {
      let direction = 'ascending';
      if (
        sortConfig &&
        sortConfig.key === key &&
        sortConfig.direction === 'ascending'
      ) {
        direction = 'descending';
      }
      setSortConfig({ key, direction });
    };
  
    return { items: sortedItems, requestSort, sortConfig };
  };
  
  const AssetTable = (props) => {
    const { items, requestSort, sortConfig } = useSortableData(props.asset);
    const getClassNamesFor = (name) => {
      if (!sortConfig) {
        return;
      }
      return sortConfig.key === name ? sortConfig.direction : undefined;
    };
    return (
      <div className='assetTable'>
        <table >
          <thead>
            <tr>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('name')}
                  className={getClassNamesFor('name')}
                >
                  Coin
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('amount')}
                  className={getClassNamesFor('amount')}
                >
                  Amount
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('usdPrice')}
                  className={getClassNamesFor('usdPrice')}
                >
                  Market Value
                </button>
              </th>
              <th>
                <button
                  type="button"
                  onClick={() => requestSort('total')}
                  className={getClassNamesFor('total')}
                >
                Total
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.amount}</td>
                <td>${Number(item.usdPrice).toFixed(6)}</td>
                <td>≈ ${item.total.toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
     
    );
  };

  const EstimatedBalance = (props) => {
    var totalbalance = 0;
    props.asset.forEach(asset => {
      totalbalance+=asset.total;
    });
    return(
      <div className='estimatedBal'>
        Estimated Balance ≈ ${totalbalance.toFixed(6)}
      </div>
    );
  };

  return(
    <div className='mine'>
      <h1>My Crypto</h1>
      {loading && <div>Just one sec...</div>}
      {error && (
        <div>{`There is a problem fetching the post data - ${error}`}</div>
      )}
      <EstimatedBalance 
        asset={currentAssets}
      />
      <AssetTable
        asset={currentAssets}
      />      
    </div>
  );
}

function CreateWallet(){
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
        <Link to="/dashboard"><button>Back</button></Link>
      </form>
    </div>
  );
}

function SendCrypto() {
  const [amount, setAmount] = useState('');
  const [recipientAddress, setRecipientAddress] = useState('');
  const [senderAddress, setSenderAddress] = useState('');
  const [cryptoType, setCryptoType] = useState('avax'); // Default set to Avax
  const [walletBalance, setWalletBalance] = useState(0);

  const handleAmountChange = (event) => {
    setAmount(event.target.value);
  }

  const handleRecipientAddressChange = (event) => {
    setRecipientAddress(event.target.value);
  }

  const handleSenderAddressChange = (event) => {
    setSenderAddress(event.target.value);
  }

  const handleCryptoTypeChange = (event) => {
    setCryptoType(event.target.value);
    setAmount(''); // Clear the amount when the crypto type changes
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (parseFloat(amount) > walletBalance) {
      alert(`You don't have enough ${cryptoType} in your wallet to send ${amount} ${cryptoType}`);
      return;
    }

    const data = {
      amount: amount,
      recipientAddress: recipientAddress,
      senderAddress: senderAddress,
      cryptoType: cryptoType
    };
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="crypto-type">Cryptocurrency Type:</label>
        <select id="crypto-type" value={cryptoType} onChange={handleCryptoTypeChange} style={{fontSize: "1.2em", width: "240px"}}>
          <option value="avax">Avax</option>
          <option value="luna">Luna</option>
          <option value="fet">Fet</option>
          <option value="doge">Doge</option>
        </select>
      </div>
      <div>
        <label htmlFor="amount">Amount ({cryptoType}):</label>
        <input type="text" id="amount" value={amount} onChange={handleAmountChange} />
        <span> (Max: {walletBalance} {cryptoType})</span>
      </div>
      <div>
        <label htmlFor="sender-address">Wallet Address:</label>
        <input type="text" id="sender-address" value={senderAddress} onChange={handleSenderAddressChange} />
      </div>
      <div>
        <label htmlFor="recipient-address">Recipient Wallet Address:</label>
        <input type="text" id="recipient-address" value={recipientAddress} onChange={handleRecipientAddressChange} />
      </div>
      <button type="submit">Send Cryptocurrency</button>
      <Link to="/dashboard"><button>Back</button></Link>
    </form>
  );
}

function ViewWallet(){
  return(
    <h1>VIEW WALLET</h1>
  );
}

function TransactionHistory(){  

  const [tx, setTx] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchTx();
  }, []);

  const fetchTx = async () => {

    // Send a GET request to fetch the user details
    const response = await fetch(`http://localhost:8000/details?username=${username}`);
    const txdata = await response.json();
    
    setTx(txdata[0].txHistory);

  }

  return(
    <div className="txApp">

      <h1>Transaction History</h1>
      <DataTable value={tx}>
        <Column field="id" header="Id"/>
        <Column field="type" header="Type"/>
        <Column field="timestamp" header="Timestamp"/>
        <Column field="sender" header="Sender"/>
        <Column field="receiver" header="Receiver"/>
        <Column field="coin" header="Coin"/>
        <Column field="amount" header="Amount"/>
      </DataTable>

    </div>
    );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/login" element={<Login />} />
        <Route path="/createAccount" element={<CreateAccount />} />
        <Route path="/dashboard" element={<Dashboard/>} />
        <Route path="/createWallet" element={<CreateWallet/>} />
        <Route path="/sendCrypto" element={<SendCrypto/>} />
        <Route path="/viewWallet" element={<ViewWallet/>} />
        <Route path="/TransactionHistory" element={<TransactionHistory/>} />
        <Route path="/viewAssets" element={<ViewAssets/>} />
      </Routes>
    </Router>
  );
}

export default App;
