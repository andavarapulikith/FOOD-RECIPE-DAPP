import './App.css';
import Fulldetailfood from './components/FulldetailFood';
import Marketplace from './components/Marketplace';
import FoodRecipeForm from './components/RecipeForm';
import Profile from './components/Profile';
import { useState,useEffect } from 'react';

import FavoritesPage from './components/Favourites';
import {
  Routes,
  Route,
} from "react-router-dom";


function App() {

  const [currentaddress,setCurrentaddress]=useState("0x");
  async function getAddress()
  {
      const ethers=require("ethers");
      let provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer=provider.getSigner();
      const addr=await signer.getAddress();
      console.log(addr)
      setCurrentaddress(addr);
  }
  async function connectWebsite() {

    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    if(chainId !== '0x11155111')
    {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x11155111' }],
     })
    }  
    await window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(() => {
        getAddress();
       
      });


      
}
useEffect(()=>{
  function getaddressdetails()
  {
    getAddress();
  
  }
  getaddressdetails();
},[])
  return (

    <div>

       
        <Routes>
     
        <Route path='/' element={<Marketplace currentaddress={currentaddress} connecttometamask={getAddress}/>}></Route>
          <Route path="/addfoodrecipe" element={<FoodRecipeForm currentaddress={currentaddress} connecttometamask={getAddress}/>}/>
          <Route path='/fooditem/:tokenId' element={<Fulldetailfood currentaddress={currentaddress} connecttometamask={getAddress} ></Fulldetailfood>}/> 
          <Route path='/profile' element={<Profile currentaddress={currentaddress} connecttometamask={getAddress} ></Profile>} />
          <Route path='/favourites' element={<FavoritesPage currentaddress={currentaddress} connecttometamask={getAddress} ></FavoritesPage>} />      
        </Routes>
       
    </div>
  );
}

export default App;
