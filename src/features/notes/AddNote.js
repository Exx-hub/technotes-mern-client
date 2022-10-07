import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersApiSlice";
import NewNoteForm from "./NewNoteForm";

const AddNote = () => {
  const users = useSelector(selectAllUsers);

  return users ? <NewNoteForm users={users} /> : <p>Loading...</p>;
};
export default AddNote;
