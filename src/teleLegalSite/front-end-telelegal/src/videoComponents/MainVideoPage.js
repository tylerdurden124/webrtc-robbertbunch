import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import axios from 'axios';

const MainVideoPage = ()=>{

  //grab query string finder hook
  const [searchParams, setSearchParams] = useSearchParams();
  const [apptInfo, setApptInfo] = useState({});

  useEffect(()=>{

    //grab the token out fof the query string
    const token = searchParams.get('token');  //get token out querystring
    console.log(token);
    
    const fetchDecodedToken = async () =>{
      const resp = await axios.post('https://localhost:9000/validate-link', {token});
      console.log(resp.data);
      setApptInfo(resp.data);
    }

    fetchDecodedToken();
    
  }, []);

  return (
    <h1>{apptInfo.professionalsFullName} at {apptInfo.apptDate}</h1>
  )
}

export default MainVideoPage;