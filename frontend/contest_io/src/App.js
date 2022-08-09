import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/navbar.component";
import { Signup } from "./components/signup.component";
import { Login } from "./components/login.component";
import { Logout } from "./components/logout.component";
import { Profileview } from "./components/profileview.component";
import { EditProfile } from "./components/user/edituser";
import { Search } from "./components/search.component";
import { CreateContest } from "./components/createcontest.component";
import { Contest } from "./components/contests/Contest";
import { ContestShow } from "./components/contests/contestshow";
import { ContestCategoryAdd } from "./components/contests/category";
import { ContestContentAdd } from "./components/contests/contestcontent";
import { useState } from "react";
import { Home } from "./components/Home";
import { About } from "./components/About";
import { UploadedContentsShow } from "./components/contents/uploadedcontentsshow";
// hooks
// import { useContestContext } from "./hooks/useContestContext";

function App() {
  let id;

  const [userID, setuserID] = useState("");

  const onLogin = (user) => {
    console.log("I am on Login", user);

    // setuserID({
    //   userID: user._id,
    // });
    setuserID(user._id);
    localStorage.setItem("id", userID);

    console.log("hello this is logged in person userid: ", userID);
    alert("Loged in Successfully in appjs", userID);

    id = localStorage.getItem("id");
    console.log("from local sto ", id, " fj");

    // window.location = "/profileview";
  };

  // useEffect(() => {
  //   setuserID(localStorage.getItem('id'));
  // }, []);

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
              <Route
                path="/profile"
                element={<Profileview id={localStorage.getItem("id")} />}
              />
              <Route path="/profileedit" element={<EditProfile />} />
              <Route path="/login" element={<Login onLogin={onLogin} />} />
              <Route path="/logout" element={<Logout />} />
              <Route
                path="/contests/*"
                element={<Contest id={localStorage.getItem("id")} />}
              />
              <Route path="/createcontest" element={<CreateContest />} />
              <Route path="/contestshow" element={<ContestShow />} />
              <Route
                path="/contestaddcategory"
                element={<ContestCategoryAdd />}
              />
              <Route
                path="/contestcontentadd"
                element={<ContestContentAdd />}
              />
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
