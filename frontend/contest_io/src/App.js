
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/navbar.component"
// import ExerciseList from "./components/exercise-list.component"
// import EditExercise from "./components/edit-exercise.component"
// import CreateExercise from "./components/create-exercise.component"
// import CreateUser from "./components/create-user.component"

// import Home from "./components/home"


function App() {
  return (
    <>
      {
        <Router>
          <div className="container">


            <Navbar />
            {/* <Routes>
              
              <Route path="/" element={<ExerciseList />} />
              <Route path="/edit/:id" element={<EditExercise />} />
              <Route path="/create" element={<CreateExercise />} />
              <Route path="/user" element={<CreateUser />} />

            </Routes> */}

          </div>
        </Router>
      }
    </>
  );
}

export default App;
