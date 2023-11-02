import React, { useState, useEffect } from "react";
import "./favouritepage.css"; // Import the CSS file
import foodrecipeJSON from '../foodrecipe.json'
import axios from 'axios'
import NavBar from "./NavBar";
import { Link } from "react-router-dom";
function FavoritesPage(props) {
    const [favoriteItems, setFavoriteItems] = useState([]);

  
      async function loadFavoriteItems() {
        try {
          // Load favorite items from the smart contract
          const ethers = require("ethers");
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const signer = provider.getSigner();
            let contract = new ethers.Contract(foodrecipeJSON.address, foodrecipeJSON.abi, signer);
          const transaction = await contract.getFavoriteItems();
          
          // Fetch details of favorite items
          const items = await Promise.all(transaction.map(async fooditem => {
            const tokenURI = await contract.tokenURI(fooditem.tokenId);
            let foodmetadata = await axios.get(tokenURI);
            let rating=await contract.getAverageRating(fooditem.tokenId);
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
                recipe:foodmetadata.recipe,
                rating:rating
            }
            console.log(item)
            return item;
        }))
  
          setFavoriteItems(items);
        } catch (error) {
          console.error("Error loading favorite items:", error);
        }
      }
      useEffect(()=>{
        loadFavoriteItems();
      },[])
  
    const removeFromFavorites = async (tokenId) => {
      try {
        const ethers = require("ethers");
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        let contract = new ethers.Contract(foodrecipeJSON.address, foodrecipeJSON.abi, signer);
        await contract.removeFromFavorites(tokenId);
        setFavoriteItems(favoriteItems.filter((item) => item.tokenId !== tokenId));
      } catch (error) {
        console.error("Error removing from favorites:", error);
      }
    };

  return (
    <>
    <NavBar currentaddress={props.currentaddress} connecttometamask={props.connecttometamask}></NavBar>
    <div className="favorites-container">
      <h2 className="favorites-header">Favourites</h2>
      {favoriteItems.length === 0 ? (
        <p>No favorite items.</p>
      ) : (
        <ul className="favorites-list">
          {favoriteItems.map((item) => (
            <li key={item.tokenId} className="favorites-item">
            <Link to={`/fooditem/${item.tokenId}`} style={{textDecoration:"none"}}>
              <span>
                {item.name} - Price: {item.price} ETH
              </span>
              </Link>
              <button
                className="remove-button"
                onClick={()=>{
                  removeFromFavorites(item.tokenId)
                }}
              >
                Remove from Favorites
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
  );
}

export default FavoritesPage;
