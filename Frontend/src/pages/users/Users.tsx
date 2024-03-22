import React, { useEffect, useState } from 'react'
import { UserInterface } from './interface/User.interface';
import axios from 'axios';
import { baseBackend } from '../../config/helper';
import { useNavigate } from 'react-router-dom';

function Users() {
  const [data, setData] = useState<UserInterface[]>([]);
  const navigate = useNavigate();

  const getData = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      console.log(accessToken)
      const response = await axios({
        method: 'get',
        url: `${baseBackend}/api/users`,
        headers: {
          'Authorization' : `Bearer ${accessToken}`
        }
      })
      console.log(response)

    } catch (error) {
      const refreshToken = localStorage.getItem('refreshToken');
      if(refreshToken!=undefined){
        const refreshToken = localStorage.getItem('refreshToken');
        const response = await axios({
          method : 'post',
          url : `${baseBackend}/refresh`,
          data : {refreshToken : refreshToken}
        })
        if(response.data.name == 'TokenExpiredError') navigate('/login');
        const {accessToken} = response.data.data;
        localStorage.setItem('accessToken', accessToken);
      } else {
        navigate('/login')
      }
      console.log(error)
    }
  }

  useEffect(()=>{
    getData()
  },[])


return (
  <>
    <button>Get User Details</button>
  </>
)
}

export default Users