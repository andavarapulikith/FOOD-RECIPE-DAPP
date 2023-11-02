import NavBar from "./NavBar";
import { useParams } from "react-router-dom";
import foodrecipeJSON from '../foodrecipe.json'
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import './Fullfooddetail.css'
const Fulldetailfood=(props)=>{
    const params=useParams();
    const tokenid=params.tokenId;
    const location=useLocation();
    const [data,setData]=useState({})
    const [datafetched,setDatafetched]=useState(false);
    async function getfooditemdata(tokenId) {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        let contract = new ethers.Contract( foodrecipeJSON.address,foodrecipeJSON.abi, signer)
        var tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getListedItemGivenId(tokenId);
        var IPFSUrl = tokenURI.split("/");
        const lastIndex = IPFSUrl.length;
        tokenURI = "https://ipfs.io/ipfs/"+IPFSUrl[lastIndex-1];
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        console.log(listedToken);
    
        let item = {
            price: meta.price,
            tokenId: tokenId,
            seller: listedToken.seller,
            owner: listedToken.owner,
            image: meta.image,
            name: meta.name,
            ingredients:meta.ingredients,
            recipe:meta.recipe
        }
        setData(item);
        setDatafetched(true);
      
       
    }
    useEffect(()=>{
        getfooditemdata(tokenid);
    },[])
    const [message,setMessage]=useState('')
    async function buyNFT(tokenId) {
        try {
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contract = new ethers.Contract( foodrecipeJSON.address,  foodrecipeJSON.abi, signer);
            console.log(data.price)
            const salePrice = ethers.utils.parseUnits(data.price, 'ether')
            console.log(salePrice)
            setMessage("Buying the NFT... Please Wait (Upto 1 min )")
            let transaction = await contract.PurchaseFoodItem(tokenId, {value:salePrice});
            await transaction.wait();
            alert('You successfully bought the food recipe!');
            window.location.replace(location.pathname)
            setMessage("");
        }
        catch(e) {
            alert("Upload Error"+e)
        }
    }
    return (
        <>
        <NavBar currentaddress={props.currentaddress} connecttometamask={props.connecttometamask}></NavBar>
    <div className="cardex">
        <div className="left">
        <div className="image">
            <img src={data.image} alt="" />
            </div>
            <h2>Item Name : {data.name}</h2>
            <h2>Price : {data.price} ethers</h2>
            <p className="message" style={{color:"red"}}>{message!=''&&message}</p>
            {data.owner!=props.currentaddress?<button onClick={()=>{
                buyNFT(tokenid)
            }}>Buy this NFT</button>:<p>You are the owner of this NFT</p>}
        </div>
        <div className="right">
        <h2>Ingredients:</h2>
        <p>{data.ingredients}</p>
        <h2>Owner Address:</h2>
        <p>{data.owner}</p>
        <h2>Recipe:</h2>
        <p>{data.recipe}</p>
        </div>
    </div>
    </>);
}
export default Fulldetailfood;