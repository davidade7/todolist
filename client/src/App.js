// import of external modules
import { BrowserRouter, NavLink } from 'react-router-dom';
import { useState } from 'react';

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
                    to="completed"
                    className={({ isActive }) =>
                      isActive ? 'active' : undefined
                    }
                    onClick={() => setOngoing(false)}
                  >
                    Terminées
                  </NavLink>
                </li>
              </ul>
            </nav>
          </div>          
        </header>

      </BrowserRouter>
      
    </div>
  );
}

export default App;
