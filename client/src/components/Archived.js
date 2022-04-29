/* import of react modules */
import React, { useEffect, useState } from 'react'

/* import of styles and icons */
import './Ongoing.css'
import unarchiveIcon from '../assets/unarchive_icon.svg'
import infoIcon from '../assets/info_icon.svg'

const api_base = "http://localhost:3001";

function Archived() {
  const [archivedLists, setArchivedLists] = useState([]);

  useEffect(() => {
    GetLists();
  }, [])

  // get all archived lists
  const GetLists = () => {
    fetch(api_base + '/archived-lists')
    .then(res => res.json())
    .then(data => setArchivedLists(data))
    .catch((err) => console.error("Erreur: ", err));
  }

  // Unarchive a list
  const archiveList = async id => {
    await fetch(api_base + '/list/archive/' + id).then(res => res.json());
		GetLists()
	}


  return (
    <div className="page-content">
      {/* default message if no lists */}
      {archivedLists.length===0 && <div className="default-message">
        <div>
          <img src={infoIcon} alt="Archiver la liste"></img>
        </div> 
        <div>
          <p>Il n'y a actuellement, aucune liste d'archivée.</p>
        </div>
      </div>}

      {/* ----- lists ----- */}
      {archivedLists.map(list => (
        <div className="list-card" key={list._id}>
          <div className="list-header">
            <div className="card-gauge">
              66%
            </div>
            <div className="card-content">
              <div className="card-title">
                <h2>{list.listName}</h2>
              </div>
              <div className="options">
                <div className="option tooltip" onClick={() => archiveList(list._id)}>
                  <img src={unarchiveIcon} alt="Archiver la liste"></img>
                  <span className="tooltip-text">Désarchiver</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Archived