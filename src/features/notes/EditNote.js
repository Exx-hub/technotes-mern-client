import React from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { selectAllUsers } from "../users/usersApiSlice";
import EditNoteForm from "./EditNoteForm";
import { selectNoteById } from "./notesApiSlice";

function EditNote() {
  const { noteId } = useParams();

  const users = useSelector(selectAllUsers);
  const noteSelected = useSelector((state) => selectNoteById(state, noteId));
  return noteSelected && users ? <EditNoteForm note={noteSelected} users={users} /> : <h2>Dito yan...</h2>;
}

export default EditNote;
