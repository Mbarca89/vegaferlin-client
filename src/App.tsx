/* eslint-disable react-hooks/exhaustive-deps */
import "./App.css"
import "./Global.css"
import 'bootstrap-icons/font/bootstrap-icons.css'
import { Routes, Route, Outlet, Navigate } from "react-router-dom"
import { useState, useEffect, Suspense } from "react"
import { useRecoilState } from "recoil"
import { logState, userState } from "./app/store"
import { Toaster } from 'react-hot-toast';
import NavBar from "./components/Nav/NavBar"
import Landing from "./views/landing/Landing"
import Home from "./views/Home/Home"
import Users from "./views/Users/Users"
import Patients from "./views/Patients/Patients"
import PatienDetail from "./views/PatientDetail/PatientDetail"
import Agenda from "./views/Agenda/Agenda"

const App = () => {

  const [isLogged, setLogged] = useRecoilState(logState)
  const [user, setUser] = useRecoilState(userState)

  const [initialCheckDone, setInitialCheckDone] = useState(false)

  useEffect(() => {
    if (!initialCheckDone) {
      if (localStorage.getItem("userName")) {
        setLogged(true)
        setUser({
          name: localStorage.getItem("name") || "",
          surname: localStorage.getItem("surname") || "",
          id: parseInt(localStorage.getItem("id") || "0"),
          userName: localStorage.getItem("userName") || "",
          role: localStorage.getItem("role") || ""
        })
      } else if (user.userName) {
        setLogged(true)
      }
      setInitialCheckDone(true)
    }
  }, [initialCheckDone, setLogged])
  if (!initialCheckDone) {
    return <div>Loading...</div>
  }

  return (
    <div className="App align-items-center d-flex flex-column flex-grow-1 bg-dark mv-100">
      <Toaster />
      <Routes>
        <Route element={(
          <>
            <NavBar />
            <Suspense>
              <Outlet />
            </Suspense>
          </>
        )}>
          <Route path="/home" element={isLogged ? <Home /> : <Navigate to="/" />} />
          <Route path="/patients" element={isLogged ? <Patients /> : <Navigate to="/" />} />
          <Route path="/agenda" element={isLogged ? <Agenda /> : <Navigate to="/" />} />
          <Route path="/patient/:id/:tab" element={isLogged ? <PatienDetail /> : <Navigate to="/" />} />
          <Route path="/patient/:id/:tab/:protocolId" element={isLogged ? <PatienDetail /> : <Navigate to="/" />} />
          <Route path="/users" element={isLogged && user.role === "Administrador" ? <Users /> : <Navigate to="/" />} />
        </Route>
        <Route path="/" element={<Landing />} />
      </Routes>
    </div>
  )
}

export default App
