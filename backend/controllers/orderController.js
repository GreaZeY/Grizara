const Order = require("../schemas/orderModel")
const Product = require("../schemas/productModel")
const User = require("../schemas/userModel")
const ErrorHandler = require("../utils/errorhandler")
const catchAsyncErros = require('../middleware/catchAsyncErrors')

// Create new Oreder
exports.newOrder = catchAsyncErros(async (req,res,next)=>{
    const {shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,

    } = req.body
console.log(req.body.paymentInfo)
    const order = await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        itemsPrice,
        taxPrice,
        shippingPrice,
        totalPrice,
        paidAt:Date.now(),
        user:req.user._id
    })

    res.status(201).json({
        success: true,
        order
    })
})

// Get Order by id
exports.getSingleOrder = catchAsyncErros(async (req,res,next)=>{

    const order = await Order.findById(req.params.id).populate(
        "user",
        "name email"
    )

    if(!order){
        return next(new Error("Order not found with this ID",404))
    }

    res.status(200).json({
        success:true,
        order
    })

})

// My orders
exports.myOrder = catchAsyncErros(async (req,res,next)=>{
    const orders = await Order.find({user:req.user._id})
    res.status(200).json({
        success:true,
        orders
    })

})

// get all orders -admin
exports.getAllOrders = catchAsyncErros(async (req,res,next)=>{
    const orders = await Order.find()
    let totalAmount = 0
    orders.forEach(order=>totalAmount+=order.totalPrice)
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })
})

// Update order status
exports.UpdateOrder = catchAsyncErros(async (req,res,next)=>{
    const order = await Order.findById(req.params.id)

    if(!order){
        return next(new Error("Order not found with this ID",404))
    }
    if(order.orderStatus==="Delivered"){
        return next(new ErrorHandler("This order has already  been delivered.",400))
    }

    order.orderItems.forEach(async Porder=>{
        await updateStock(Porder.product,Porder.quantity);
    })
    order.orderStatus= req.body.status;

    if(req.body.status === "Delivered"){
        order.deliveredAt = Date.now();
    }
    await order.save({ValidateBeforeSave:false});
    res.status(200).json({
        success:true,
        order
    })
})

// updating the stock
async function updateStock(id,quantity){
    const product = await Product.findById(id);

    product.stock-=quantity;

    await product.save({ValidateBeforeSave:false})
}

// Delete Orders
exports.deleteOrder = catchAsyncErros(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new Error("Order not found with this ID",404))
    }
    await order.remove()
    res.status(200).json({
        success:true,
    })
})