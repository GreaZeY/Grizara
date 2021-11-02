import React from 'react';
import {Link} from "react-router-dom";
import ReactStars from "react-rating-stars-component";

const Product = ({product}) => {
    const options = {
        edit:false,
        color:"rgba(20,20,20,0.1)",
        activeColor:"tomato",
        size:window.innerWidth<640?11:23,
        value:product.ratings,
        isHalf:true
    
    }
    return (
       <Link className="productCard" to={`/product/${product._id}/${product.name}`}>
           <img src={product.images[0].url} alt={product.name}></img>
            <p>{product.name}</p>
            <div>
                <ReactStars {...options}>
            </ReactStars><span>({product.numOfReviews} Reviews)</span>
            </div>
            <span>{'₹'+product.price}</span>
       </Link>
    );
};




export default Product;
