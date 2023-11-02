import React, { useState } from "react";
import "./Food.css";
import NavBar from "./NavBar";
import {uploadFileToIPFS,uploadJSONToIPFS} from '../pinata'
import Foodrecipe from '../foodrecipe.json'
import { useNavigate } from "react-router-dom";
const FoodRecipeForm = (props) => {
  const navigate=useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    ingredients: "",
    price: "",
    recipe: ""
  });
  const [imageurl,setImageurl]=useState(null);
  const ethers=require('ethers');
  const [message,setMessage]=useState('');
  async function onChangeFile(e)
     {
        handleChange(e);
         var file=e.target.files[0];
         
        try{
            const response=await uploadFileToIPFS(file);
            if(response.success)
            {
                console.log("uploaded image to pinata:",response.pinataURL)
                setImageurl(response.pinataURL);
            }
        }
        catch(e)
        {
            console.log("error during file upload:",e)
        }

     }
     async function uploadMetadataTOIPFS()
     {
       const {name,image,ingredients,price,recipe}=formData;
       if(!name||!ingredients||!price||!recipe ||!imageurl)
       {
        return;
       }
       const nftJSON={
        name,ingredients,price,recipe,image:imageurl
       }
       try{
             const response=await uploadJSONToIPFS(nftJSON);
             if(response.success==true)
             {
                console.log("uploaded json to pinata",response);
                return response.pinataURL;
             }
       }
       catch(e)
       {
        console.log("error uploading JSON metadata: ",e);
       }
     }
     async function listNFT(e)
     {
        e.preventDefault();
        try {
            const metadataURL=await uploadMetadataTOIPFS();
            const provider=new ethers.providers.Web3Provider(window.ethereum);
            const signer=provider.getSigner();
            setMessage("please wait ...data is uploading (upto 5 min)");
            let contract=new ethers.Contract(Foodrecipe.address,Foodrecipe.abi,signer);
            const price=ethers.utils.parseUnits(formData.price,'ether');
            let listingprice=await contract.getListPrice();
            listingprice=listingprice.toString();
            let transaction=await contract.createFoodToken(metadataURL,price,{value:listingprice});
            await transaction.wait();
          alert("successfully added your food recipe!!!");

          setMessage("");
          setFormData({ name: "",
          image: "",
          ingredients: "",
          price: "",
          recipe: ""});
           navigate('/')

        }
        catch(e)
        {
         alert("upload error"+e);
        }
     }
    



 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  return (
    <>
    <NavBar currentaddress={props.currentaddress} connecttometamask={props.connecttometamask}></NavBar>
    {props.num}
    <div className="container">
      <div className="form-container">
        <form onSubmit={listNFT}>
          <h1>Recipe Form</h1>
          <label htmlFor="name">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
          />

          <label htmlFor="image">Image</label>
          <input
            type="file"
            id="image"
            name="image"
            value={formData.image}
            onChange={onChangeFile}
          />

          <label htmlFor="ingredients">Ingredients</label>
          <textarea
            id="ingredients"
            name="ingredients"
            value={formData.ingredients}
            onChange={handleChange}
            style={{ height: "50px", fontSize: "15px" }}
          />

          <label htmlFor="price">Price</label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
          />

          <label htmlFor="recipe">Recipe</label>
          <textarea
            id="recipe"
            name="recipe"
            value={formData.recipe}
            onChange={handleChange}
            style={{ height: "150px",fontSize: "15px" }}
          />
             <p style={{textAlign:"center",color:"red",fontWeight:"700"}}>{message!=''&&message}</p>
          <button type="submit" className="button" disabled={imageurl==null}>Submit</button>
        </form>
      </div>
    </div>
    </>
  );
};

export default FoodRecipeForm;