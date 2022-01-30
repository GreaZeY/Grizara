import React, { Fragment, useEffect, useState } from "react";
import "./Products.css";
import { useSelector, useDispatch } from "react-redux";
import { clearErrors, getProduct } from "../../actions/productAction";
import Loading from "./Loading";
import Product from "../Home/ProductCard";
import { useAlert } from "react-alert";
import Typography from "@material-ui/core/Typography";
import MetaData from "../layout/MetaData";
import ReactStars from "react-rating-stars-component";
import FilterAltIcon from "@mui/icons-material/FilterAlt";

const categories = [
  "Laptop",
  "Footwear",
  "Electronics",
  "Camera",
  "Smart Phones",
];
const options = {
  color: "rgba(20,20,20,0.1)",
  activeColor: "#FF007A",
  size: window.innerWidth < 640 ? 20 : 35,
  isHalf: true,
};
const Products = ({ match }) => {
  const alert = useAlert();
  const dispatch = useDispatch();
  const keyword = match.params.keyword;
  const [nextPage, setNextPage] = useState([]);
  const [pageNumber, setPageNumber] = useState(1);
  const [price, setPrice] = useState([0, 512987.69]);
  const [category, setCategory] = useState();
  const [ratings, setRatings] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  const { loading, error, products, resultPerPage, filteredProductsCount } =
    useSelector((state) => state.products);
  let count = filteredProductsCount;
  useEffect(() => {
    if (error) {
      alert.error(error);
      dispatch(clearErrors());
    }
    dispatch(getProduct(keyword, pageNumber, price, category, ratings));
  }, [dispatch, error, alert, keyword, pageNumber, price, category, ratings]);

  useEffect(() => {
      setNextPage((prevNextPage) => {
        if(products) return [...prevNextPage, ...products];
      });
  }, [products]);

  if (pageNumber * resultPerPage < count) {
    window.onscroll = function () {
      // console.log('ih',window.innerHeight,'top',document.documentElement.scrollTop ,'off',document.documentElement.offsetHeight)
        
      if (
        window.innerHeight + document.documentElement.scrollTop>=
        document.documentElement.offsetHeight-document.documentElement.offsetHeight*0.15
      ) {
        setPageNumber(pageNumber + 1);
        // console.log('hit')
      }
    };
  }


  useEffect(() => {
    setNextPage([]);
    setPageNumber(1);
  }, [price, category, ratings]);

  const priceHandler = (e) => {
    e.preventDefault();

    if (Number(e.target.max.value) < 100) {
      alert.error("Max Price should be greater than ₹100");
    } else {
      setPrice([Number(e.target.min.value), Number(e.target.max.value)]);
    }
  };
  return (
    <Fragment>
      {
        <div className="productsbox">
                  <MetaData title="Products" />
          <div className="filterBox">
            <div className="filterh1">
              <FilterAltIcon />
              <Typography>Filters</Typography>&nbsp;&nbsp;&nbsp;&nbsp;
              {category | (ratings !== 0) | (price[1] !== 512987.69) ? (
                <button
                style={{marginTop:'.38rem',marginLeft:'20%'}}
                  className="removefilter"
                  onClick={() => {
                    setPrice([0, 512987.69]);
                    setCategory();
                    setRatings(0);
                  }}
                >
                  Remove All Filters
                </button>
              ) : (
                ""
              )}
            </div>
            <Typography style={{ fontSize: "1.1vmax" }}>
              Price &nbsp;&nbsp;
              {price[1] !== 512987.69 ? (
                <button
                  className="removefilter"
                  onClick={() => setPrice([0, 512987.69])}
                >
                  ✖
                </button>
              ) : (
                ""
              )}
            </Typography>
            <div className="pricefilter">
              <form onSubmit={priceHandler}>
                <input
                  type="number"
                  name="min"
                  placeholder="₹Min"
                  id="min"
                ></input>
                <input
                  type="number"
                  name="max"
                  placeholder="₹Max"
                  id="max"
                ></input>
                <button type="submit">Go</button>
              </form>
            </div>
            <div className="categoryBox">
              <p style={{ fontSize: "1.1vmax", marginRight: "1vmax" }}>
                Categories &nbsp;&nbsp;
                {category ? (
                  <button
                    className="removefilter"
                    onClick={() => setCategory()}
                  >
                    ✖
                  </button>
                ) : (
                  ""
                )}
              </p>

              {categories.map((category) => (
                <p
                  style={{ fontSize: "1vmax" }}
                  className="category-link"
                  key={category}
                  onClick={() => {
                    setCategory(category.toLowerCase());
                  }}
                >
                  {category}
                </p>
              ))}
            </div>
            <div className="ratingsabove">
              <fieldset>
                <Typography style={{ fontSize: "1.1vmax" }} component="legend">
                  Ratings Above
                </Typography>
                <ReactStars
                  onChange={(newRating) => setRatings(newRating)}
                  {...options}
                />
              </fieldset>
              {ratings !== 0 ? (
                <button className="removefilter" onClick={() => setRatings(0)}>
                  ✖
                </button>
              ) : (
                ""
              )}
            </div>
          </div>
          <div className="search">
            {keyword ? (
              <h2 className="productsHeading">{`Search Results for ${keyword}`}</h2>
            ) : (
              <h2 className="productsHeading">Products</h2>
            )}
            <div className="products">
              {products &&
                nextPage.map((product, i) => (
                  <Product key={i} product={product} />
                ))}
            </div>
            {<div class="load">{loading && <Loading />}</div>}
          </div>
        </div>
      }
    </Fragment>
  );
};

export default Products;
