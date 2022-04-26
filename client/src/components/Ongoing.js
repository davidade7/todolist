import React, { useEffect, useState } from 'react'

/* import of styles and icons */
import './Ongoing.css'
import editIcon from '../assets/edit_icon.svg'
import deleteIcon from '../assets/delete_icon.svg'
import archiveIcon from '../assets/archive_icon.svg'
import addListIcon from '../assets/add_circle_icon.svg'
import sendIcon from '../assets/send_icon.svg'
import addTaskIcon from '../assets/add_circle_outline_icon.svg'


const api_base = "http://localhost:3001";

function Ongoing() {
  const [lists, setLists] = useState([]);
  const [addPopupActive, setAddPopupActive] = useState(false);
  const [editListPopupActive, setEditListPopupActive] = useState(false);
  const [listName, setListName] = useState("");
  const [listId, setListId] = useState("")
  
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
				listName: listName
			})
		}).then(res => res.json());

		setLists([...lists, data]);

		setAddPopupActive(false);
		setListName("");
	}

  // Archive a list
  const archiveList = async id => {
    await fetch(api_base + '/list/archive/' + id).then(res => res.json());
		GetLists()
	}

  // Rename a list
  const setupRename = (list_Name, list_Id) => {
    setListName(list_Name);
    setListId(list_Id);
    setEditListPopupActive(true);
  }

  const renameList = async () => {
    await fetch(api_base + "/list/update/" + listId, {
		 	method: "PUT",
		 	headers: {
		 		"Content-Type": "application/json" 
		 	},
		 	body: JSON.stringify({
		 		listName: listName
		 	})
		 }).then(res => res.json());

     setEditListPopupActive(false);
     setListName("");
     setListId("");
     GetLists()
  }


  return (
    <div className="page-content">
      
      {lists.map(list => (
        <div className="list-card" key={list._id}>
          <div className="list-header">
            <div className="card-gauge">
              66%
            </div>
            <div className="card-content">
              <div className="card-title">
                <h2>{list.listName}</h2>
              </div>
              <div className="card-options">
                <div className="option tooltip" onClick={() => setupRename(list.listName, list._id)}>
                  <img src={editIcon} alt="Renommer la liste"></img>
                  <span className="tooltip-text">Renommer</span>
                </div>
                <div className="option tooltip" onClick={() => archiveList(list._id)}>
                  <img src={archiveIcon} alt="Archiver la liste"></img>
                  <span className="tooltip-text">Archiver</span>
                </div>
                <div className="option tooltip" onClick={() => deleteList(list._id)}>
                  <img src={deleteIcon} alt="Supprimer la liste"></img>
                  <span className="tooltip-text">Supprimer</span>
                </div>
              </div>
            </div>
          </div>
          <div className="list-footer">
            {/* tasks                      */}
            {list.tasks.map(task => (
              <div className="task" key={task.id}>
                <div className="task-left">
                  <div>
                    {task.isCompleted && <input type="checkbox" checked/>}
                    {!task.isCompleted && <input type="checkbox"/>}
                  </div>
                  <div className="task-content"> 
                    {task.id}
                    {task.name}
                  </div>
                </div>
                <div className="task-options">
                  <div className="option tooltip">
                    <img src={editIcon} alt="Renommer la liste"></img>
                    <span className="tooltip-text">Renommer</span>
                  </div>
                  <div className="option tooltip">
                    <img src={deleteIcon} alt="Supprimer la liste"></img>
                    <span className="tooltip-text">Supprimer</span>
                  </div>
                </div>
              </div>
            ))}
            <div className="task-add">
              <div>
                <img src={addTaskIcon} alt="Ajouter une tâche"></img>
              </div>
              <div className="task-content">
                Ajouter une tâche
              </div>
            </div>
          </div>
          
        </div>
      ))}

{/* {lists.map(list => (
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
              <div className="card-option tooltip" onClick={() => setupRename(list.listName, list._id)}>
                <img src={editIcon} alt="Renommer la liste"></img>
                <span className="tooltip-text">Renommer</span>
              </div>
              <div className="card-option tooltip" onClick={() => archiveList(list._id)}>
                <img src={archiveIcon} alt="Archiver la liste"></img>
                <span className="tooltip-text">Archiver</span>
              </div>
              <div className="card-option tooltip" onClick={() => deleteList(list._id)}>
                <img src={deleteIcon} alt="Supprimer la liste"></img>
                <span className="tooltip-text">Supprimer</span>
              </div>
            </div>
          </div>
        </div>
      ))} */}

      <div className="add-list-button tooltip" onClick={() => setAddPopupActive(true)}>
        <img src={addListIcon} alt="Ajouter une liste" />
        <span className="tooltip-text">Nouvelle liste</span>
      </div>


      {/* Popup to add a list */}
      {addPopupActive ? (
				<div className="popup">
					<div className="popup-content">
						<div className="popup-header">
              <div className="popup-title">
                <h3>Creation d'une nouvelle liste</h3>
              </div>
              <div className="popup-close popup-button" onClick={() => setAddPopupActive(false)}>
                X
              </div>
            </div>
						<div className="popup-body">
              <div>
                <input type="text" className="add-todo-input" onChange={e => setListName(e.target.value)} value={listName} />
              </div>
              <div className="popup-button" onClick={addList}>
                <img src={sendIcon} alt="Créer la liste" />
              </div>
            </div>
					</div>
				</div>
			) : ''}


      {/* Popup to edit a list name */}
      {editListPopupActive ? (
				<div className="popup">
					<div className="popup-content">
						<div className="popup-header">
              <div className="popup-title">
                <h3>Renommer la liste</h3>
              </div>
              <div className="popup-close popup-button" onClick={() => setEditListPopupActive(false)}>
                X
              </div>
            </div>
						<div className="popup-body">
              <div>
                <input type="text" className="add-todo-input" onChange={e => setListName(e.target.value)} value={listName} />
              </div>
              <div className="popup-button" onClick={renameList}>
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