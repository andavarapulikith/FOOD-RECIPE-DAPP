import './Marketplace.css'
import { Link } from 'react-router-dom';
import foodrecipeJSON from '../foodrecipe.json'
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
const FoodItem=({fooditem})=>{
    const [message,setmessage]=useState("")
    const url={pathname:'/fooditem/'+fooditem.tokenId}
    const navigate=useNavigate();
    async function addtofavorites()
    {
        try{
            setmessage("adding.....")
        const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(foodrecipeJSON.address, foodrecipeJSON.abi, signer);
            const transaction = await contract.addToFavorites(fooditem.tokenid);
            await transaction.wait();

            alert('You successfully added the food item to your favourites!');
            setmessage("")
            navigate("/favourites")
        }
        catch(err)
        {
            console.log("an error occured:", err);
        }
    }
    return (
    
      

        <li>
<div className="card">
<Link to={url} style={{textDecoration:"none"}}>
<div className="image">
<img src={fooditem.image} alt=''/>
</div>
<hr/>
<div className="content">
<h2>Name : {fooditem.name}</h2>
<h2>Price : {fooditem.price} ethers</h2>
<h2>Rating :{fooditem.rating!=0?[...Array(fooditem.rating)].map((_, index) => (<span key={index} className="filled-star">⭐ </span>)):"not yet rated"}</h2>

</div>
</Link>


<button onClick={addtofavorites} className='addbtn'>{message!=''?message:"add to favourites"}</button>
</div>
</li>

    )
}
export default FoodItem;