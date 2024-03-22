import { Route, Routes } from "react-router-dom"
import { baseUrL } from "../config/helper"
import Login from "../pages/login/Login"
import Users from "../pages/users/Users"
import Signup from "../pages/signup/Signup"


function Routing() {
  return (
    <>
    <Routes>
        <Route path={'/signup'} element={<Signup/>}></Route>
        <Route path={'/login'} element = {<Login/>}></Route>
        <Route path={`${baseUrL}/users`} element = {<Users/>}></Route>
    </Routes>
    </>
  )
}

export default Routing