import './Marketplace.css'
import { Link } from 'react-router-dom';
const FoodItem=({fooditem})=>{
    const url={pathname:'/fooditem/'+fooditem.tokenId}
    return (
        <Link to={url} style={{textDecoration:"none"}}>

        <li>
<div className="card">
<div className="image">
<img src={fooditem.image} alt=''/>
</div>
<hr/>
<div className="content">
<h2>Name : {fooditem.name}</h2>
<h2>Price : {fooditem.price} ethers</h2>
</div>


</div>
</li>
</Link>
    )
}
export default FoodItem;