import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrash } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { selectNoteById, useDeleteNoteMutation, useGetNotesQuery } from "./notesApiSlice";

const Note = ({ noteId }) => {
  const note = useSelector((state) => selectNoteById(state, noteId)); // uses noteId to fetch specific note

  const myNote = useGetNotesQuery("notesList", {
    selectFromResult: (result) => ({
      note: result?.data?.entities[noteId]
    })
  })
  

  const navigate = useNavigate();

  const [deleteNote, { isSuccess }] = useDeleteNoteMutation();

  if (note) {
    const created = new Date(note.createdAt).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const updated = new Date(note.updatedAt).toLocaleString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const handleEdit = () => navigate(`/dash/notes/${noteId}`);

    const handleDelete = async () => {
      await deleteNote(noteId);
    };

    return (
      <tr className="table__row">
        <td className="table__cell note__status">
          {note.completed ? (
            <span className="note__status--completed">Completed</span>
          ) : (
            <span className="note__status--open">Open</span>
          )}
        </td>
        <td className="table__cell note__created">{created}</td>
        <td className="table__cell note__updated">{updated}</td>
        <td className="table__cell note__title">{note.title}</td>
        <td className="table__cell note__username">{note.username}</td>

        <td className="table__cell">
          <button className="icon-button table__button" onClick={handleEdit}>
            <FontAwesomeIcon icon={faPenToSquare} />
          </button>
          <button className="icon-button table__button" onClick={handleDelete}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </td>
      </tr>
    );
  } else return null;
};
export default Note;
