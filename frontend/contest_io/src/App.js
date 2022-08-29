import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { Navbar } from "./components/navbar.component";
import { Signup } from "./components/signup.component";
import { Login } from "./components/login.component";
import { Logout } from "./components/logout.component";
import { Profileview } from "./components/profileview.component";
import { EditProfile } from "./components/user/edituser";
// import { Search } from "./components/search.component";
import { ContestHome } from "./components/contests/ContestHome";
import { Contest } from "./components/contests/Contest";
import { ContestSearch } from "./components/contests/ContestSearch";
import { Search } from "./components/contests/search";
import { CreateContest } from "./components/createcontest.component";
import { ContestShow } from "./components/contests/contestshow";
import { ContestContentAdd } from "./components/contests/contestcontent";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { UploadedContentsShow } from "./components/contents/uploadedcontentsshow";
import { ProtectedRoutes } from "./components/protectedRoutes.component";
// hooks
// import { useContestContext } from "./hooks/useContestContext";

function App() {
  return (
    <>
      {
        <Router>
          <Navbar id={localStorage.getItem("id")} />
          <div className="container">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/search" element={<Search />} />
              <Route path="/profile">
                <Route path=":userID" element={<Profileview />} />
                <Route
                  path="edit"
                  element={
                    <ProtectedRoutes redirectPath="/login">
                      <EditProfile />
                    </ProtectedRoutes>
                  }
                />
              </Route>

              <Route path="/login" element={<Login />} />
              <Route path="/logout" element={<Logout />} />
              <Route path="/contests" element={<Contest />}>
                <Route
                  path=""
                  element={<ContestHome id={localStorage.getItem("id")} />}
                />
                <Route path="search" element={<ContestSearch />} />
                <Route
                  path="create"
                  element={
                    <ProtectedRoutes redirectPath="/login">
                      <CreateContest />
                    </ProtectedRoutes>
                  }
                />
                <Route path=":contestID" element={<ContestShow />} />
              </Route>
              <Route
                path="/uploadcontentshow"
                element={<UploadedContentsShow />}
              />
            </Routes>
          </div>
        </Router>
      }
    </>
  );
}

export default App;
