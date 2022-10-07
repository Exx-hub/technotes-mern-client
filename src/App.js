import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Public from "./components/Public";
import Login from "./features/auth/Login";
import DashLayout from "./components/layout/dashboard/DashLayout";
import NotesList from "./features/notes/NotesList";
import UserList from "./features/users/UserList";
import Welcome from "./features/auth/Welcome";

import EditUser from "./features/users/EditUser";
import EditNote from "./features/notes/EditNote";

import AddUser from "./features/users/AddUser";
import AddNote from "./features/notes/AddNote";
import Prefetch from "./features/auth/PreFetch";
import ProtectedRoutes from "./features/auth/ProtectedRoutes";
import PersistLogin from "./features/auth/PersistLogin";
import { ROLES } from "./config/roles";
import useTitle from "./hooks/useTitle";

function App() {
  useTitle("Alvin Acosta Technotes")
  
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* public routes  */}
        <Route index element={<Public />} />
        <Route path="login" element={<Login />} />

        <Route element={<PersistLogin />}>
          <Route element={<ProtectedRoutes allowedRoles={[...Object.values(ROLES)]} />}>
            <Route element={<Prefetch />}>
              <Route path="dash" element={<DashLayout />}>
                <Route index element={<Welcome />} />

                <Route element={<ProtectedRoutes allowedRoles={[ROLES.Manager, ROLES.Admin]} />}>
                  <Route path="users">
                    <Route index element={<UserList />} />
                    <Route path=":userId" element={<EditUser />} />
                    <Route path="add" element={<AddUser />} />
                  </Route>
                </Route>

                <Route path="notes">
                  <Route index element={<NotesList />} />
                  <Route path=":noteId" element={<EditNote />} />
                  <Route path="add" element={<AddNote />} />
                </Route>
              </Route>
            </Route>
          </Route>
        </Route>
      </Route>
    </Routes>
  );
}

export default App;

// 2 level nested routes and dash routes are protected. only accessible to authorized users
// after login
// notice in path how you dont need to put a trailing backslash anymore
