import React from 'react'
import LoginForm from './LoginForm'

function Login() {
  return (
    <div className='min-h-screen w-full flex justify-center items-center rounded-md'>
      <div className='flex-col w-auto h-auto bg-slate-200 px-4 py-3 rounded-lg'>
        <h1 className='text-center'>Login</h1>
        <div className='max-w-40vw px-3'>
          <LoginForm />
        </div>
      </div>
    </div>
  )
}

export default Login