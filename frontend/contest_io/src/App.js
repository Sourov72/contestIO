import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component";
import { Signup } from "./components/signup.component";
import { Login } from "./components/login.component";
import { Profileview } from "./components/profileview.component";
import { useState } from "react";
// import ExerciseList from "./components/exercise-list.component"
// import EditExercise from "./components/edit-exercise.component"
// import CreateExercise from "./components/create-exercise.component"
// import CreateUser from "./components/create-user.component"

// import Home from "./components/home"

function App() {
  const onLogin = (user) => {
    console.log("I am on Login", user);
    setuserID({
      userID: user._id,
    });

    console.log("hello this is logged in person userid: ", { userID });
  };

  const [userID, setuserID] = useState("");

  return (
    <>
      {
        <Router>
          <div className="container">
            <Navbar />
            <Routes>
              <Route path="/signup" element={<Signup />} />
              <Route
                path="/profileview"
                element={<Profileview id={userID} />}
              />
              <Route path="/login" element={<Login onLogin={onLogin} />} />
              {/* <Route path="/edit/:id" element={<EditExercise />} />
              <Route path="/create" element={<CreateExercise />} />
              <Route path="/user" element={<CreateUser />} /> */}
            </Routes>
          </div>
        </Router>
      }
    </>
  );
}

export default App;
