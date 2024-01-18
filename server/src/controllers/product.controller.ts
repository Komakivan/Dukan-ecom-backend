import { NextFunction, Request, Response } from "express";
import { prismaClient } from "../server";
import { productValidation } from "../schema/product.validation";
import { NotFoundException } from "../exceptions/404.exception";
import { ErrorCode } from "../exceptions/root";

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
    // validate the request input
    productValidation.parse(req.body)
    const productId = req.params.id
    // get the product from the database and check where it exists
    let product = await prismaClient.product.findFirst({ where: { id: Number(req.params.id) }})
    if(!product) {
        return next(new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND))
    }
    // update product
    product = await prismaClient.product.update({ where: { id: Number(req.params.id)},
                    data: {
                        ...req.body
                    }
            })

}

/**
 * 
 * @param req - Request object
 * @param res - Response object
 */
const deleteProduct = async (req:Request, res:Response) => {

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

}

export { 
    createProduct,
    updateProduct,
    deleteProduct,
    getAllProducts,
    getProductById,
}