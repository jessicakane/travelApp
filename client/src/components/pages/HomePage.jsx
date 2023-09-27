import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';


export const HomePage = () => {

    const navigate = useNavigate();

  return (
    <div className = 'homeContainer'>
        <div className = 'welcomeCard'>
        <h1 className = 'welcome'>Welcome to SafePassage</h1>
        <h3 className = 'subtitle'>Wherever you go, safety should follow</h3>
        <button onClick = {() => navigate('/map')}>Let's get started <FontAwesomeIcon className = 'icon' icon={faArrowRight} /></button>
        </div>
        
    </div>
  )
}
