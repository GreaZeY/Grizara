import React, { Fragment, useEffect, useState } from "react";
import "./ProductDetals.css";
import Carousel from "react-material-ui-carousel";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails,clearErrors } from "../../actions/productAction";
import { addItemsToCart } from "../../actions/cartAction";
import ReactStars from "react-rating-stars-component";
import Loader from "../Loader/Loader"
import MetaData from "../layout/MetaData";
import ReviewCard from "./ReviewCard.jsx"
import {useAlert} from "react-alert"


const ProductDetals = ({ match }) => {
  const dispatch = useDispatch();
  const alert = useAlert();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id,alert,error]);
  const options = {
    edit:false,
    color: "rgba(20,20,20,0.1)",
    activeColor: "#FF007A",
    size: window.innerWidth < 640 ? 11 : 23,
    isHalf: true,
  };
  const [quantity, setQuantity] = useState(1);



  const increaseQuantity = () => {
    if (product.stock <= quantity) return;

    const qty = quantity + 1;
    setQuantity(qty);
  };

  const decreaseQuantity = () => {
    if (1 >= quantity) return;

    const qty = quantity - 1;
    setQuantity(qty);
  };

  const addToCartHandler = () => {
    dispatch(addItemsToCart(match.params.id, quantity));
    alert.success("Item Added To Cart");
  };

  return (
    <Fragment>
    {loading? <Loader></Loader> :
    <Fragment>
        <MetaData title={`${product.name}`}/>
      <div className="ProductDetails">
      <Carousel>
            {product.images &&
              product.images.map((item, i) => (
                <img
                  className="CarouselImage"
                  key={item.url}
                  src={item.url}
                  alt={`${i} slide`}
                  
                />
              ))}
          </Carousel>
        <div>
          <div className="detailsBlock-1">
            <h2>{product.name}</h2>
          </div>
          <div className="detailsBlock-2">
            <ReactStars  value={ product.ratings} {...options} />
            <span>{`(${product.numOfReviews} `+(product.numOfReviews>1? `Reviews)`:`Review)`)}</span>
          </div>
          <div className="detailsBlock-3">
            <h1>{`₹${product.price}`}</h1>
            <div className="detailsBlock-3-1">
              <div className="detailsBlock-3-1-1">
                <button style={{ width:"1.5vmax"}} onClick={decreaseQuantity}>-</button>
                <input readOnly value={quantity} type="Number" />
                <button onClick={increaseQuantity}>+</button>
              </div>
              <button onClick={addToCartHandler} >Add to Cart</button>
            </div>
            <p>
                Stock:
                <b className={product.stock<1?"redColor":"greenColor"}>
                    {product.stock<1?"Out of Stock":"In Stock"}
                </b>
            </p>
          </div>
          <div className="detailsBlock-4">
              Description : <p>{product.description}</p>
          </div>
          <button className="submitReview">Write a review</button>
        </div>
      </div>


      <div className="">
        <h3 className="reviewsHeading">Reviews</h3>
        {
          product.reviews && product.reviews[0]?(
            <div className="reviews">
            {
                product.reviews.map((review)=><ReviewCard review={review}/>)
              }
              </div>
          ):
          <p className="noReviews">No Reviews Yet</p>
        }
      </div>
      
    </Fragment>
}
</Fragment>
  );
};

export default ProductDetals;
