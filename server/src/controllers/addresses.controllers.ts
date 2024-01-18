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
    let user:User
    // find a user or throw an error if not found
    try {
        user = await prismaClient.user.findFirstOrThrow({ where: { id: req.body.userId }})
    } catch (error) {
        throw new NotFoundException("User not found", ErrorCode.USER_NOT_FOUND)
    }
    // create a new address
    const address = await prismaClient.address.create({
        data: {
            ...req.body,
            user: user.id
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
   const addressCount = await prismaClient.address.count()
   const addresses = await prismaClient.address.findMany({
    // @ts-ignore
    skip: req.query.skip || 0,
    take: 10
   })

   res.status(200).json({ addressCount, addresses})
}

export {
    addAddress,
    deleteAddress,
    getAllAddresses
}