const { json } = require("express")

class ApiFeatures{
    constructor(query,queryStr){
        this.query =query
        this.queryStr = queryStr
    }
    search(){
        const keyword = this.queryStr.keyword ? {
            name:{
                $regex: this.queryStr.keyword,
                $options:"i"
            }

        }:{}

        this.query = this.query.find({...keyword})
        return this
    }

    filter(){
        const queryCpy = {...this.queryStr}
        // removing fields for category
        const removeFields = ["keyword","page","limit"]

        removeFields.forEach(key=> delete queryCpy[key])
        
        // filter for price range
        let queryStr = JSON.stringify(queryCpy)
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g , (key)=>`$${key}`)
        // console.log(JSON.parse(queryStr))
        this.query = this.query.find(JSON.parse(queryStr))
        return this
    }

    pages(resultsPerPage){
        const currentPage = Number(this.queryStr.page) || 1;
        const skip = resultsPerPage * (currentPage-1);
        this.query = this.query.limit(resultsPerPage).skip(skip)
        return this
    }
}

module.exports = ApiFeatures