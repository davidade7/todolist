import React from 'react'

/* import of styles and icons */
import './Ongoing.css'
import editIcon from '../assets/edit_icon.svg'
import deleteIcon from '../assets/delete_icon.svg'
import archiveIcon from '../assets/archive_icon.svg'

function Ongoing() {
  return (
    <div className="page-content">
      <div className="card-list">
        <div className="card-score">
          66%
        </div>
        <div className="card-gauge">
        </div>
        <div className="card-content">
          <div className="card-title">
            <h1>TITRE</h1>
          </div>
          <div className="card-options">
            <div className="card-option"><img src={editIcon} alt="Renommer la liste"></img></div>
            <div className="card-option"><img src={archiveIcon} alt="Archiver la liste"></img></div>
            <div className="card-option"><img src={deleteIcon} alt="Supprimer la liste"></img></div>
          </div>
        </div>
      </div>
    </div>
      
  )
}

export default Ongoing