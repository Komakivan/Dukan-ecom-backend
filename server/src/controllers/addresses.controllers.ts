import { Request, Response } from "express";
import { prismaClient } from "../server";
import { addressvalidation } from "../schema/address.validation";
import { User } from "@prisma/client";
import { NotFoundException } from "../exceptions/404.exception";
import { ErrorCode } from '../exceptions/root';

/**
 * 
 * @param req - Request object
 * @param res - Response object
 */
const addAddress = async (req:Request, res:Response) => {

    addressvalidation.parse(req.body)
    
    // create a new address
    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            // @ts-ignore
            userId: req?.user.id
        }
    })

    res.status(201).json(address)
}

/**
 * 
 * @param req - Request object
 * @param res - Response object
 */
const deleteAddress = async (req:Request, res:Response) => {
    try {
        await prismaClient.address.delete({
            where: { 
                id: +req.params.id
            }
        })
        res.status(200).json({ message: "address deleted successfully"})
    } catch (error) {
        throw new NotFoundException("Address not found", ErrorCode.ADDRESS_NOT_FOUND)
    }
}


/**
 * 
 * @param req - Request object
 * @param res - Response object
 */
const getAllAddresses = async (req:Request, res:Response) => {
    // get the number of all addresses
    // @ts-ignore
   const addressCount = await prismaClient.address.count({
    where:{
        // @ts-ignore
        userId: req.user?.id,
    }
   })
   const addresses = await prismaClient.address.findMany({
        where: {
            // @ts-ignore
            userId: req.user?.id
        }
   })

   res.status(200).json({ addressCount, addresses})
}

/**
 * 
 * @param req - the request object
 * @param res - the response object
 
 */

const updateUser = async (req:Request, res:Response) => {

}

export {
    addAddress,
    deleteAddress,
    getAllAddresses,
    updateUser
}