import React, { useEffect, useState } from 'react'

import './Ongoing.css'
import unarchiveIcon from '../assets/unarchive_icon.svg'

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
      {/* {archivedLists ? '' : (<h1>Il n'y a pas de liste archivée.</h1>)} */}
      {archivedLists.map(list => (
        <div className="card-list" key={list._id}>
          <div className="card-score">
            66%
          </div>
          <div className="card-gauge">
          </div>
          <div className="card-content">
            <div className="card-title">
              <h2>{list.listName}</h2>
            </div>
            <div className="card-options">
              <div className="card-option" onClick={() => archiveList(list._id)}><img src={unarchiveIcon} alt="Archiver la liste"></img></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default Archived