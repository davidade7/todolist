import React, { useEffect, useState } from 'react'

/* import of styles and icons */
import './Ongoing.css'
import editIcon from '../assets/edit_icon.svg'
import deleteIcon from '../assets/delete_icon.svg'
import archiveIcon from '../assets/archive_icon.svg'
import addListIcon from '../assets/add_circle.svg'
import sendIcon from '../assets/send.svg'


const api_base = "http://localhost:3001";

function Ongoing() {
  const [lists, setLists] = useState([]);
  const [popupActive, setPopupActive] = useState(false);
  const [newList, setNewList] = useState("");
  
  useEffect(() => {
    GetLists();
  }, [])

  // get all unarchived lists
  const GetLists = () => {
    fetch(api_base + '/lists')
    .then(res => res.json())
    .then(data => setLists(data))
    .catch((err) => console.error("Erreur: ", err));
  }

  // delete a list
  const deleteList = async id => {
		const data = await fetch(api_base + '/list/delete/' + id, { method: "DELETE" }).then(res => res.json());

		setLists(lists => lists.filter(list => list._id !== data.result._id));
	}

  // add a list
  const addList = async () => {
		const data = await fetch(api_base + "/list/new", {
			method: "POST",
			headers: {
				"Content-Type": "application/json" 
			},
			body: JSON.stringify({
				listName: newList
			})
		}).then(res => res.json());

		setLists([...lists, data]);

		setPopupActive(false);
		setNewList("");
	}

  // Archive a list
  const archiveList = async id => {
    await fetch(api_base + '/list/archive/' + id).then(res => res.json());
		GetLists()
	}


  return (
    <div className="page-content">
      
      {lists.map(list => (
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
              <div className="card-option"><img src={editIcon} alt="Renommer la liste"></img></div>
              <div className="card-option" onClick={() => archiveList(list._id)}><img src={archiveIcon} alt="Archiver la liste"></img></div>
              <div className="card-option" onClick={() => deleteList(list._id)}><img src={deleteIcon} alt="Supprimer la liste"></img></div>
            </div>
          </div>
        </div>
      ))}

      <div className="add-list-button" onClick={() => setPopupActive(true)}>
        <img src={addListIcon} alt="Ajouter une liste" />
      </div>


      {/* Popup to add a list */}
      {popupActive ? (
				<div className="popup">
					<div className="popup-content">
						<div className="popup-header">
              <div className="popup-title">
                <h3>Creation d'une nouvelle liste</h3>
              </div>
              <div className="popup-close popup-button" onClick={() => setPopupActive(false)}>
                X
              </div>
            </div>
						<div className="popup-body">
              <div>
                <input type="text" className="add-todo-input" onChange={e => setNewList(e.target.value)} value={newList} />
              </div>
              <div className="popup-button" onClick={addList}>
                <img src={sendIcon} alt="Créer la liste" />
              </div>
            </div>
					</div>
				</div>
			) : ''}
    </div>
      
  )
}

export default Ongoing