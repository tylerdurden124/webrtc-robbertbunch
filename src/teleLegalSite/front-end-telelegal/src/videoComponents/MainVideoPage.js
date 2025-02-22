import {useEffect, useState} from 'react';
import {useSearchParams} from 'react-router-dom';
import axios from 'axios';

import './VideoComponents.css';
import CallInfo from './CallInfo';
import ChatWindow from './ChatWindow';

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
    <div clasName = "main-video-Page">
      <div className="video-chat-wrapper">
        {/* div to hold remote video AND local video, AND chat window */}
        <video id="large-feed" autoPlay controls playsInline></video>
        <video id="own-feed" autoPlay controls playsInline></video>
        {
          apptInfo.professionalsFullName ? <CallInfo apptInfo={apptInfo} /> : <></>
        }
        <ChatWindow/>
      </div>
    </div>
    
    
  )
}

export default MainVideoPage;