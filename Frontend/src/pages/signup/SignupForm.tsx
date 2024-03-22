import { useState } from "react"
import { SignupInterface } from "./interface/Signup.interface"
import axios from 'axios'
import {baseBackend, baseUrL} from './../../config/helper'
import { useNavigate } from "react-router-dom"

const SignUpForm = () => {
    const navigate  = useNavigate()
    const [input, setInput] = useState<SignupInterface>({
        username: "",
        email: "",
        password: ""
    })

    const getDataHandler = (event : any)=>{
        const {name, value} = event.target;
        setInput({
            ...input,
            [name] : value
        })
    }

    const btnHandler = async(e)=>{
        console.log(input);
        e.preventDefault();
        
        try {
            const data = await axios({
                method : 'post',
                url : `${baseBackend}/signup`,
                data : input
            })
            navigate(`/login`)
            
        } catch (error) {
            console.log(error)
        }
    }
    return (
        <div>
            <form className="mt-8" onSubmit={btnHandler} action="/login">
                <div className="mt-4">
                    <label>
                        Username
                    </label>
                    <input
                        className="w-full rounded-lg outline-none border relative"
                        type="text"
                        name="username"
                        onChange={getDataHandler}
                        value={input.username}
                    />
                </div>
                <div className="mt-4">
                    <label>
                        Email
                    </label>
                    <input
                        className="w-full rounded-lg outline-none border relative"
                        type="text"
                        name="email"
                        onChange={getDataHandler}
                        value={input.email}
                    />
                </div>
                <div className="mt-4">
                    <label>
                        Password
                    </label>
                    <input
                        className="w-full rounded-lg outline-none border relative "
                        type="password"
                        name="password"
                        onChange={getDataHandler}
                        value={input.password}
                    />
                </div>
                <div className="mt-4">
                    <button className="bg-green-100 px-2 text-sm">Submit</button>
                </div>
            </form>
        </div>
    )
}

export default SignUpForm