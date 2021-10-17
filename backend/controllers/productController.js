const Product = require("../schemas/productModel")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErros = require('../middleware/catchAsyncErrors')
const ApiFeatures = require("../utils/apifeatures")

// Creating the Products
exports.createProduct = catchAsyncErros(async (req, res, next) => {
    // console.log(req.body)
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(201).json({
        success: true,
        product
    })
})

// getting all products --admin
exports.getAllProducts = catchAsyncErros(async (req, res, next) => {
    const resultPerPage = 5
    const productCount = await Product.countDocuments()
    const apiFeature = new ApiFeatures(Product.find(), req.query).search().filter().pages(resultPerPage)
    const products = await apiFeature.query
    res.status(200).json({
        success: true,
        products,
        productCount
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