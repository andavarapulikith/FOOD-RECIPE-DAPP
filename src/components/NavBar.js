// NavBar.js
import React from 'react';
import './NavBar.css';
import { Link } from 'react-router-dom';

function NavBar(props) {
  return (
    <div className="navbar">
      <ul className="nav-list">
        <li className="nav-item"><Link to="/">Marketplace</Link></li>
        <li className="nav-item"><Link to='/addfoodrecipe'>Add Food Recipe</Link></li>
        <li className="nav-item"><Link to="/profile">Your NFTs</Link></li>
        <li className="nav-item"><Link to="/favourites">Your Favourites</Link></li>
        
      </ul>
      {/* {props.currentaddress} */}
      <div style={{display:"flex"}}>
      <span style={{marginTop:"7px",marginRight:"30px",color:"rgba(2, 77, 66, 0.978)",fontWeight:"700",fontSize:"20px"}}>{props.currentaddress!='0x'&&props.currentaddress.substring(0,15)+'...'}</span>
      <button className="nav-button enableEthereumButton" onClick={props.connecttometamask}>{props.currentaddress!='0x'? "Connected":"Connect Wallet"} </button>
      </div>
      
    </div>
  );
}

export default NavBar;
