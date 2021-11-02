import React, { Fragment, useEffect } from "react";
import "./ProductDetals.css";
import Carousel from "react-material-ui-carousel";
import { useSelector, useDispatch } from "react-redux";
import { getProductDetails } from "../../actions/productAction";
import ReactStars from "react-rating-stars-component";
import Loader from "../Loader/Loader"
import MetaData from "../layout/MetaData";


const ProductDetals = ({ match }) => {
  const dispatch = useDispatch();
  const { product, loading, error } = useSelector(
    (state) => state.productDetails
  );

  useEffect(() => {
    dispatch(getProductDetails(match.params.id));
  }, [dispatch, match.params.id]);
  const options = {
    color: "rgba(20,20,20,0.1)",
    activeColor: "tomato",
    size: window.innerWidth < 640 ? 11 : 23,
    value: product.ratings,
    isHalf: true,
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
            <ReactStars {...options} />
            <span>({product.numOfReviews} Reviews)</span>
          </div>
          <div className="detailsBlock-3">
            <h1>{`₹${product.price}`}</h1>
            <div className="detailsBlock-3-1">
              <div className="detailsBlock-3-1-1">
                <button>-</button>
                <input value="1" type="Number" />
                <button>+</button>
              </div>{" "}
              <button>Add to Cart</button>
            </div>
            <p>
                Stock:{" "}
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
      
    </Fragment>
}
</Fragment>
  );
};

export default ProductDetals;
