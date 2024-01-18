import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../server";
import { productValidation } from "../schema/product.validation";
import { NotFoundException } from "../exceptions/404.exception";
import { ErrorCode } from '../exceptions/root';

/**
 * 
 * @param req - Request object
 * @param res - Response object
 */
const createProduct = async (req:Request, res:Response) => {

    // validate product input
    productValidation.parse(req.body)

    // the tags will be an array of strings so we want them in comma separated strings
    // for that we join them together with "," -> req.body.join(",")

    const product = await prismaClient.product.create({
        data: {
            ...req.body,
            tags: req.body.tags.join(",")
        }
    })

    res.status(201).json(product)
}

/**
 * 
 * @param req - Request object
 * @param res - Response object
 */

const updateProduct = async (req:Request, res:Response, next:NextFunction) => {
  
    try {
         // get the product from request body
    const product = req.body
    // check if tags is present and perform -> .join(",") on it
    if(product.tags) {
        product.tags = product.tags.join(",")
    }
    // update the product
    const updatedproduct = await prismaClient.product.update(
        { 
            where: { id: +req.params.id},
            data: product
        }
    )


    res.status(200).json(updatedproduct)
    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }
   

}

/**
 * 
 * @param req - Request object
 * @param res - Response object
 */
const deleteProduct = async (req:Request, res:Response) => {
    try {
    
         await prismaClient.product.delete({
            where: { id: +req.params.id}
        })

        res.status(200).json({ message: "Product deleted successfully"})
    } catch (error) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }
}

/**
 * 
 * @param req - Request object
 * @param res - Response object
 */
const getProductById = async (req:Request, res:Response) => {
    
}

/**
 * 
 * @param req - Request object
 * @param res - Response object
 */

const getAllProducts = async (req:Request, res:Response) => {
    //1. get product the product count
    const productsCount = await prismaClient.product.count();
    // 2. format the product the product count with pagiation res -> { count, data}
    const allproducts = await prismaClient.product.findMany({
        // @ts-ignore
        skip: +req.query.skip || 0,
        take: 2
    })

    res.status(200).json({ productsCount, allproducts})
    
}

export { 
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
}