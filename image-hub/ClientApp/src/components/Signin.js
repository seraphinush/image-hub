import React from 'react';
import main_logo from './img/1_logo.png';
import sign_in_azure from './img/1_azure.png';
import './signin.css';

const signin = () => {
  return (
    <div id="outer_div">
      <div id="inner_div">
        <img src={'./img/1_logo.png'} alt="main logo" />
        <br /><br /><br /><br /><br /><br />
        <a href="./home.html"><img src={sign_in_azure} alt="sign in" /></a>

      </div>
    </div>
  )
}

export default signin;
