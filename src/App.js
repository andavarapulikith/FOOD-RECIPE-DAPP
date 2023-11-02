import './App.css';
import FoodItem from './components/FoodItem';
import Fulldetailfood from './components/FulldetailFood';
import Marketplace from './components/Marketplace';
import NavBar from './components/NavBar';
import foodrecipeJSON from './foodrecipe.json'
import FoodRecipeForm from './components/RecipeForm';
import Profile from './components/Profile';
import { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import FavoritesPage from './components/Favourites';
import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";


function App() {
  const [currentaddress,setCurrentaddress]=useState("0x");
  const [Signer,setSigner]=useState({});
  const [contract,setContract]=useState({})
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
    if(chainId !== '0x5')
    {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: '0x5' }],
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
     
        <Route path='/' element={<Marketplace currentaddress={currentaddress} connecttometamask={connectWebsite}/>}></Route>
          <Route path="/addfoodrecipe" element={<FoodRecipeForm currentaddress={currentaddress} connecttometamask={connectWebsite}/>}/>
          <Route path='/fooditem/:tokenId' element={<Fulldetailfood currentaddress={currentaddress} connecttometamask={connectWebsite} contract={contract}></Fulldetailfood>}/> 
          <Route path='/profile' element={<Profile currentaddress={currentaddress} connecttometamask={connectWebsite} signer={Signer}></Profile>} />
          <Route path='/favourites' element={<FavoritesPage currentaddress={currentaddress} connecttometamask={connectWebsite} signer={Signer}></FavoritesPage>} />      
        </Routes>
       
    </div>
  );
}

export default App;
