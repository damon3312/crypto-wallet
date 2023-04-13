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
        <Link to="/receiveCrypto"><button>Deposit Crypto</button></Link>
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

function CreateWallet() {
  // Set up state variables to store input values and error messages
  const [walletName, setWalletName] = useState('');
  const [walletAddress, setWalletAddress] = useState('');
  const [password, setPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Function to generate a random wallet address
  function generateWalletAddress() {
    const characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let result = '';
    const charactersLength = characters.length;
    for (let i = 0; i < 26; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    setWalletAddress(result);
  }

  // Function to handle form submission
  async function handleSubmit(event) {
    event.preventDefault();
    // Check password meets requirements
    if (password.length < 12 || !/[A-Z]/.test(password) || !/[\W_]/.test(password)) {
      setPasswordError('Password must be at least 12 characters long and contain at least one uppercase letter and one special character.');
    } else {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:8000/details?username=${username}`);
      const userData = await response.json();
      const userId = userData[0].id;

      // Create new wallet object
      const newWallet = {
        walletName: walletName,
        walletAddress: walletAddress,
        walletPassword: password,
        wallet: []
      };

      // Send POST request to add new wallet to database
      const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWallet),
      };

      await fetch(`http://localhost:8000/wallet/${userId}`, requestOptions);

      // Update user's details in database with new wallet details
      const updatedUserData = [...userData];
      const currentUserData = updatedUserData[0];
      if (!currentUserData.walletDetails) {
        currentUserData.walletDetails = [newWallet];
      } else {
        currentUserData.walletDetails.push(newWallet);
      }

      const updateUserRequestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentUserData),
      };

      await fetch(`http://localhost:8000/details/${userId}`, updateUserRequestOptions);

      // Reset the form after submitting and display success message to user
      setWalletName('');
      setWalletAddress('');
      setPassword('');
      setPasswordError('');
      setSuccessMessage('Wallet created successfully!');
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
          Wallet Password:
          <input type="password" value={password} onChange={(event) => setPassword(event.target.value)} style={{ width: '300px' }} required />
        </label>
        {passwordError && <p style={{ color: 'red' }}>{passwordError}</p>}
        <br />
        <button type="submit">Create Wallet</button>
        {successMessage && <p style={{ color: 'green' }}>{successMessage}</p>}
        <Link to="/dashboard"><button>Back</button></Link>
      </form>
    </div>
  );
}

function SendCrypto() {

  const localUsername = localStorage.getItem("username");
  const [coinform , setCoinform] = useState();
  const [amountform, setAmountform] = useState();
  const [receiverform, setReceiverform] = useState();

  const handleSubmit = (event) => {
    event.preventDefault();
    sendCrypto()
  };

  const sendCrypto = async () => {

    // Get the user's wallet details
    const response = await fetch(
      `http://localhost:8000/details?username=${localUsername}`
    );
    const data = await response.json();

    // Check if the coin exists in the user's wallet
    const coinIndex = data[0].walletDetails[0].wallet.findIndex(
      (coin) => coin.coin === coinform
    );

    // If coin in wallet
    if (coinIndex >= 0) {

      // If balance greater or equal to send request amount
      if (Number(data[0].walletDetails[0].wallet[coinIndex].value) >= amountform) {

          // Subtract value from users wallet
          data[0].walletDetails[0].wallet[coinIndex].value =
          Number(data[0].walletDetails[0].wallet[coinIndex].value) -
          Number(amountform);

          // Get the receivers's wallet details
          const response2 = await fetch(
            `http://localhost:8000/details?username=${receiverform}`
          );
          const data2 = await response2.json();

          // Check if the coin already exists in the receivers's wallet
          const coinIndex2 = data2[0].walletDetails[0].wallet.findIndex(
            (coin) => coin.coin === coinform
          );

          if (coinIndex2 >= 0) {
            // If the coin already exists, update its value
            data2[0].walletDetails[0].wallet[coinIndex2].value =
              Number(data[0].walletDetails[0].wallet[coinIndex2].value) +
              Number(amountform);
          } else {
            // If the coin doesn't exist, create a new entry
            data2[0].walletDetails[0].wallet.push({
              coin: coinform,
              value: amountform,
            });
          }

          // Send the updated data to the server for user
          fetch(`http://localhost:8000/details/${data[0].id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data[0]),
          })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error(error));

          console.log("done");

          // Send the updated data to the server for receiver
          fetch(`http://localhost:8000/details/${data2[0].id}`, {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(data[0]),
          })
            .then((response) => response.json())
            .then((data) => console.log(data))
            .catch((error) => console.error(error));

          console.log("done");
            }

    }
  }
  return (
    <div className="center">
      <h1>Send Crypto</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Crypto (Symbol):</label>
          <input type="text"
            value={coinform} 
            onChange={(e) => setCoinform(e.target.value)} 
          required />
        </div>
        <div className="form-control">
          <label>Amount:</label>
          <input type="text"
            value={amountform} 
            onChange={(e) => setAmountform(e.target.value)} 
          required />
        </div>
        <div className="form-control">
          <label>Receiver:</label>
          <input type="text"
            value={receiverform} 
            onChange={(e) => setReceiverform(e.target.value)} 
          required />
        </div>
        <button type="submit">Send</button>
        <Link to="/dashboard"><button>Back</button></Link>
      </form>
      </div>
  ); 
}



function ViewWallet(){

  const [wallet, setWallet] = useState([]);
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchWallet();
  }, []);

  const fetchWallet = async () => {

    // Send a GET request to fetch the user details
    const response = await fetch(`http://localhost:8000/details?username=${username}`);
    const txdata = await response.json();
    
    setWallet(txdata[0].walletDetails[0].wallet)

  }

  return(
    <div className="txApp">

      <h1>VIEW WALLET</h1>
      <DataTable value={wallet} className='center'>
        <Column field="coin" header="Coin"/>
        <Column field="value" header="Value"/>
      </DataTable>

    </div>
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
      <DataTable value={tx} className='center'>
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

function DepositCrypto() {
  const localUsername = localStorage.getItem("username");
  const [coinform, setCoinform] = useState("");
  const [amountform, setAmountform] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();
    depositPost();
  };

  const depositPost = async () => {
    // Get the user's wallet details
    const response = await fetch(
      `http://localhost:8000/details?username=${localUsername}`
    );
    const data = await response.json();

    // Check if the coin already exists in the user's wallet
    const coinIndex = data[0].walletDetails[0].wallet.findIndex(
      (coin) => coin.coin === coinform
    );

    if (coinIndex >= 0) {
      // If the coin already exists, update its value
      data[0].walletDetails[0].wallet[coinIndex].value =
        Number(data[0].walletDetails[0].wallet[coinIndex].value) +
        Number(amountform);
    } else {
      // If the coin doesn't exist, create a new entry
      data[0].walletDetails[0].wallet.push({
        coin: coinform,
        value: amountform,
      });
    }

    // Send the updated data to the server
    fetch(`http://localhost:8000/details/${data[0].id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data[0]),
    })
      .then((response) => response.json())
      .then((data) => console.log(data))
      .catch((error) => console.error(error));

    console.log("done");
  };

  return(

    <div className="center">
      <h1>Deposit Crypto</h1>
      <form className="form" onSubmit={handleSubmit}>
        <div className="form-control">
          <label>Crypto Symbol:</label>
          <input type="text"
            value={coinform} 
            onChange={(e) => setCoinform(e.target.value)} 
          required />
        </div>
        <div className="form-control">
          <label>Amount:</label>
          <input type="text"
            value={amountform} 
            onChange={(e) => setAmountform(e.target.value)} 
          required />
        </div>
        <button type="submit">Deposit</button>
        <Link to="/dashboard"><button>Back</button></Link>
      </form>
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
        <Route path="/receiveCrypto" element={<DepositCrypto/>}/>
        <Route path="/viewAssets" element={<ViewAssets/>} />
      </Routes>
    </Router>
  );
}

export default App;
