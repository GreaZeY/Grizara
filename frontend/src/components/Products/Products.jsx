import React from "react";
import { Grid } from "@material-ui/core";

const products = [
    {id:1,name:'Shoes',description:"Sneakers"},
    {id:2,name:'Shirt',description:"Formal Shirt"}
];
const Products = () =>{
    <main>
        <Grid container justify="center" spacing={4}>
            {
            products.map(prod=>{
                <Grid item key={prod.id} xs ={12} sm={6} md={4} lg={3}>
                    <Product />
                    </Grid>
            })}
        </Grid>
    </main>
}
export default Products