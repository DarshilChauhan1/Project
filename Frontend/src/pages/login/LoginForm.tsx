import { useState } from "react"
import {LoginInterface} from './interface/Login.interface'
import axios from "axios"
import { baseBackend } from "../../config/helper"



const LoginForm = () =>{
    const [input, setInput] = useState<LoginInterface>({
        username : "",
        password : ""

    })


    const getDataHandler = (event)=>{
        const {name, value} = event.target
        setInput({
            ...input,
            [name] : value
        })
    }

    const btnHandler = async(e)=>{
        e.preventDefault();
        try {
            console.log(input)
            const response = await axios({
                method : 'post',
                url : `${baseBackend}/login`,
                data : input
            })
            console.log('response---->', response)
            const {accessToken, refreshToken} = response.data.data;
            console.log(accessToken)
            console.log(response.data)
            localStorage.setItem('accessToken', accessToken)
            localStorage.setItem('refreshToken', refreshToken);

        } catch (error) {
            console.log(error)   
        }
    }
    return(
        <div>
            <form className="mt-8" onSubmit={btnHandler}>
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

export default LoginForm