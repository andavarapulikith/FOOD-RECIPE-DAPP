import { useEffect, useState } from "react";
import NavBar from "./NavBar";
import Foodrecipejson from '../foodrecipe.json'
import axios from "axios";
import './Profile.css'
import FoodItem from "./FoodItem";
const Profile=(props)=>{
    const [data,setData]=useState([]);
    async function getfooditemdata(tokenId) 
    {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        let contract = new ethers.Contract(Foodrecipejson.address, Foodrecipejson.abi, signer)
        let transaction = await contract.getMyFoodNFTs();
        const items = await Promise.all(transaction.map(async fooditem => {
            const tokenURI = await contract.tokenURI(fooditem.tokenId);
            let foodmetadata = await axios.get(tokenURI);
            foodmetadata = foodmetadata.data;
            let price = ethers.utils.formatUnits(fooditem.price.toString(), 'ether');
            let item = {
                price,
                tokenId: fooditem.tokenId.toNumber(),
                seller: fooditem.seller,
                owner: fooditem.owner,
                image: foodmetadata.image,
                name: foodmetadata.name,
                ingredients:foodmetadata.ingredients,
                recipe:foodmetadata.recipe
            }
            return item;
        }))

        setData(items);
       
        
    }
    useEffect(()=>{
        getfooditemdata();
    },[])
   return (<><NavBar currentaddress={props.currentaddress} connecttometamask={props.connecttometamask}></NavBar>
   <div className="address">
    <h2>Your Address:</h2>
    <h3>{props.currentaddress}</h3>
    
   </div>
   <hr className="hr"/>
   <div className="nftsdisplay">
        <h2>Your NFTs</h2>
        <ul style={{ display: "flex", flexWrap: "wrap",gap:"60px" }}>
{data.map((fooditem)=>{
    return <FoodItem fooditem={fooditem}></FoodItem>
})}
</ul>
    </div>

   </>)
}
export default Profile;