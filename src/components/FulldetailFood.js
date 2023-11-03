import NavBar from "./NavBar";
import { useParams } from "react-router-dom";
import foodrecipeJSON from '../foodrecipe.json'
import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import './Fullfooddetail.css'

import { ClipLoader } from "react-spinners";
const Fulldetailfood=(props)=>{
    const params=useParams();
    const tokenid=params.tokenId;
    const location=useLocation();
    const [data,setData]=useState({})
    const [useralreadyrated,setalreadyrated]=useState(false);
    const [datafetched,setDatafetched]=useState(false);
    const [loading,setLoading]=useState(false);
    async function getfooditemdata(tokenId) {
        setLoading(true)
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const addr = await signer.getAddress();
        let contract = new ethers.Contract( foodrecipeJSON.address,foodrecipeJSON.abi, signer)
        var tokenURI = await contract.tokenURI(tokenId);
        const listedToken = await contract.getFoodItem(tokenId);
        var IPFSUrl = tokenURI.split("/");
        const lastIndex = IPFSUrl.length;
        tokenURI = "https://ipfs.io/ipfs/"+IPFSUrl[lastIndex-1];
        let meta = await axios.get(tokenURI);
        meta = meta.data;
        let rating=await contract.getAverageRating(tokenId);
        console.log(rating)
        let item = {
            price: meta.price,
            tokenId: tokenId,
            seller: listedToken.seller,
            rating:rating,
            owner: listedToken.owner,
            image: meta.image,
            name: meta.name,
            ingredients:meta.ingredients,
            recipe:meta.recipe,
            ratedusers:listedToken.ratedUsers
        }
        console.log(item.ratedusers)
        console.log(props.currentaddress)
        item.ratedusers.map((user)=>{
            // console.log(user==props.currentaddress)
            if(user===props.currentaddress)
            {
                // console.log(user,props.currentaddress)
            setalreadyrated(true);
            }
        })
        setData(item);
        setDatafetched(true);
        setLoading(false)
        
      
       
    }
    
    useEffect(()=>{
        getfooditemdata(tokenid);
        // setalreadyratedfunction();
    },[datafetched])
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
    const [rating,setRating]=useState(0)
    const handleRateItem = async () => {
        if (rating === 0 ) {
            alert("Please select a rating between 1 and 5.");
            return;
        }
       

        try {
            const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(foodrecipeJSON.address, foodrecipeJSON.abi, signer);

            setMessage("Rating the food item... Please Wait");
            const transaction = await contract.rateFoodItem(tokenid, rating);
            await transaction.wait();

            alert('You successfully rated the food item!');
            setMessage("");
            getfooditemdata(tokenid)
        } catch (e) {
            alert("Rating Error: " + e);
        }
    };
    const handleRatingChange = (event) => {
        const newRating = parseInt(event.target.value);
        setRating(newRating);
    };
    return (
        <>
        <NavBar currentaddress={props.currentaddress} connecttometamask={props.connecttometamask}></NavBar>
    {loading? <ClipLoader size={50} color={'#123abc'}  loading={loading} />:<div className="cardex">
        <div className="left">
        <div className="image">
            <img src={data.image} alt="" />
            </div>
            <br/>
          { data.owner!=props.currentaddress &&(!useralreadyrated ? <div className="totalrating">
            <div className="rating">
                                {/* <label htmlFor="ratingSelect" className="ratingSelect">Rate me: </label> */}
                                <select id="ratingSelect" onChange={handleRatingChange}>
                                    <option value="0">Select a rating</option>
                                    <option value="1">1</option>
                                    <option value="2">2</option>
                                    <option value="3">3</option>
                                    <option value="4">4</option>
                                    <option value="5">5</option>
                                </select>
                                <button onClick={handleRateItem} className="btn">GIVE RATING</button>
                            </div>
                                </div>:<h3 style={{textAlign:"center",margin:"2px",color:"green"}}>You already rated</h3>)}
            <h2>Price : {data.price} ethers</h2>
            <h2>Rating :{data.rating!=0?[...Array(data.rating)].map((_, index) => (<span key={index} className="filled-star">⭐ </span>)):"not yet rated"}</h2>
            <p className="message" style={{color:"red",fontSize:"16px"}}>{message!=''&&message}</p>
            
            {data.owner!=props.currentaddress?<button className="button" onClick={()=>{
                buyNFT(tokenid)
            }}>Buy this NFT</button>:<p>You are the owner of this NFT</p>}
        </div>
        <div className="right">
        <h2 style={{textAlign:"center",fontSize:"30px"}}>🍴🥂{data.name}🥣🍽️</h2>
        <h2>Ingredients:</h2>
        <p>{data.ingredients}</p>
        <h2>Owner Address:</h2>
        <p>{data.owner}</p>
        <h2>Recipe:</h2>
        <p>{data.recipe}</p>
        </div>
    </div>}
    </>);
}
export default Fulldetailfood;