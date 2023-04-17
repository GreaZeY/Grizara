const Product = require("../schemas/productModel")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErros = require('../middleware/catchAsyncErrors')
const ApiFeatures = require("../utils/apifeatures")

// Creating the Products
exports.createProduct = catchAsyncErros(async (req, res, next) => {
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})

// getting all products 
exports.getAllProducts = catchAsyncErros(async (req, res, next) => {
    const resultPerPage = 6
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter()

    let products = await apiFeature.query
    let filteredProductsCount = products.length
    apiFeature.pages(resultPerPage)
    
    products = await apiFeature.query.clone()
    res.status(200).json({
        success: true,
        products,
        resultPerPage,
        filteredProductsCount
    })
})


// update a product --admin
exports.updateProduct = catchAsyncErros(async (req, res, next) => {
    let product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })
    res.status(200).json({
        success: true,
        product
    })
})


// delete a product --admin
exports.deleteProduct = catchAsyncErros(async (req, res, next) => {
    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))
    }
    await product.remove()
    res.status(200).json({
        success: true,
        message: product.name + " deleted"
    })
})


// getting a product's details
exports.getProductDetails = catchAsyncErros(async (req, res, next) => {

    const product = await Product.findById(req.params.id)
    if (!product) {
        return next(new ErrorHandler("Product not found", 404))

    }
    res.status(200).json({
        success: true,
        product,

    })
})

exports.createProductReview = catchAsyncErros(async(req,res,next)=>{
    const {rating, comment,productId} = req.body;

    const review = {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }
    const product = await Product.findById(productId)
    const isReviewed = product.reviews.find((review)=>review.user.toString()===req.user._id.toString())
    if(isReviewed){
        product.reviews.forEach((review)=>{
            if(review.user.toString()=== req.user._id.toString())
            (review.rating=rating),(review.comment=comment)
        })
    }else{
        product.reviews.push(review)
        product.numOfReviews = product.reviews.length
    }
    let sumOfReviews=0;
   product.reviews.forEach(review=>{ return sumOfReviews+= review.rating})
   product.ratings = sumOfReviews/product.reviews.length
    await product.save({validateBeforeSave:false})


    res.status(200).json({
        success: true,
    })

})

// Get all Reviews of a product
exports.getProductReviews=catchAsyncErros(async(req,res,next)=>{
    const product = await Product.findById(req.query.id)

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    res.status(200).json({
        success: true,
        reviews:product.reviews
    })

})

// delete a Reviews of a product
exports.deleteReviews = catchAsyncErros(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId)

    if(!product){
        return next(new ErrorHandler("Product not found",404));
    }
    const reviews = product.reviews.filter(review=>review._id.toString()!==req.query.id.toString())

    let sumOfReviews=0;
    reviews.forEach(review=>{ return sumOfReviews+= review.rating})
    const ratings=0
    if(reviews.length!==0){
        ratings = sumOfReviews/reviews.length
    }
    
    const numOfReviews = reviews.length

    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numOfReviews
    },{
        new:true,
        runValidators:true,
        useFindAndModify:false
    })
 
    res.status(200).json({
        success: true,
        reviews:product.reviews
    })

})