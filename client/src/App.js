// import of external modules
import { BrowserRouter, NavLink } from 'react-router-dom';
import { useState } from 'react';

// import of components
import Ongoing from './components/Ongoing';
import Archived from './components/Archived';

// images and icones
import './App.css';


function App() {
  const [ongoing, setOngoing] = useState(true);
  
  return (
    <div className="App">
      <BrowserRouter>
        <header>
          <div className="header-content">
            <div className="header-title">
              <h1>Mes Listes</h1>
            </div>
            <nav className="header-nav">
              <ul>
                <li>
                  <NavLink
                    to="ongoing"
                    className={({ isActive }) =>
                      isActive ? 'active' : undefined
                    }
                    onClick={() => setOngoing(true)}
                  >
                    En cours
                  </NavLink>
                </li>
                <li>
                  <NavLink
                    to="archived"
                    className={({ isActive }) =>
                      isActive ? 'active' : undefined
                    }
                    onClick={() => setOngoing(false)}
                  >
                    Archivées
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>          
        </header>
        <div className="content">
          {ongoing && <Ongoing />}
          {!ongoing && <Archived />}
        </div>
        
      </BrowserRouter>
      
    </div>
  );
}

export default App;
