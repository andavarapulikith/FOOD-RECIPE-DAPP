import NavBar from "./NavBar";
// import MarketplaceJSON from '../Marketplace.json';
import foodrecipejson from '../foodrecipe.json'
import axios from 'axios';
import { useEffect, useState } from "react";
import { ClipLoader } from 'react-spinners';
import './Marketplace.css';
import FoodItem from "./FoodItem";
const Marketplace=(props)=>{
  const [data,setData]=useState([]);
  const [fetcheddata,setFetcheddata]=useState(false);
  const [loading,setLoading]=useState(false);
  async function getallfooditems() {
    setLoading(true)
    console.log(loading)
    console.log(props.currentaddress);
    const ethers = require("ethers");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    let contract = new ethers.Contract(foodrecipejson.address, foodrecipejson.abi, signer)
    let transaction = await contract.getAllFoodNFTs()
    const items = await Promise.all(transaction.map(async i => {
        var tokenURI = await contract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        var IPFSUrl = tokenURI.split("/");
        const lastIndex = IPFSUrl.length;
       tokenURI = "https://ipfs.io/ipfs/"+IPFSUrl[lastIndex-1];
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        //    console.log(i.price);
        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        // let rating = Number(ethers.utils.parseEther(i.totalRatingPoints.toString()));
        // let rating=i.totalRatingPoints.toNumber();
        let rating=await contract.getAverageRating(i.tokenId);
        console.log(rating)
        IPFSUrl=meta.image;
        var IPFSUrl = IPFSUrl.split("/");
        const lastIndex1 = IPFSUrl.length;
        IPFSUrl = "https://ipfs.io/ipfs/"+IPFSUrl[lastIndex1-1];
        
        let item = {
            tokenid:i.tokenId,
            price:price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: IPFSUrl,
            name: meta.name,
            ingredients:meta.ingredients,
            recipe:meta.recipe,
            rating:rating
        }
        // console.log(rating)
        // console.log(item)
        return item;
    }))
    // items.splice(0,2);
    setFetcheddata(true);
    setData(items);
    setLoading(false)
    // console.log(items);
}

useEffect(()=>{
    async function allnfts()
    {
     await getallfooditems();
    }
    allnfts();
},[props.currentaddress])

return (<>
<NavBar currentaddress={props.currentaddress} connecttometamask={props.connecttometamask}></NavBar>

{loading?  <ClipLoader size={50} color={'#123abc'}  loading={loading} />:<div>
<ul style={{ display: "flex", flexWrap: "wrap",gap:"60px" }}>
{data.map((fooditem)=>{
    return <FoodItem fooditem={fooditem}></FoodItem>
})}
</ul>       
</div>}
</>)
}
export default Marketplace;