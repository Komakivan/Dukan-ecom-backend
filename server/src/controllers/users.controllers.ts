import { Request, Response } from "express";
import { prismaClient } from "../server";
import { addressvalidation } from "../schema/address.validation";
import { NotFoundException } from "../exceptions/404.exception";
import { ErrorCode } from '../exceptions/root';
import { updateUserSchema } from "../schema/users.validation";
import { BadRequestException } from "../exceptions/bad-requests";



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


const updateUser = async (req: Request, res: Response) => {

    const validatedData = updateUserSchema.parse(req.body);

    try {
        // @ts-ignore
        const userId = req.user?.id;

        if (!userId) {
            throw new BadRequestException("User not authenticated", ErrorCode.UNAUTHORIZED);
        }

        if (validatedData.defaultBillingAddress) {
            const billingAddress = await prismaClient.address.findFirst({ where: { id: +validatedData.defaultBillingAddress } });

            if (!billingAddress || billingAddress.userId !== userId) {
                throw new BadRequestException("Please choose your address or create a new one", ErrorCode.NOT_YOUR_ADDRESS);
            }
        }

        if (validatedData.defaultShippingAddress) {
            const shippingAddress = await prismaClient.address.findFirst({ where: { id: +validatedData.defaultShippingAddress } });

            if (!shippingAddress || shippingAddress.userId !== userId) {
                throw new BadRequestException("Please choose your address or create a new one", ErrorCode.NOT_YOUR_ADDRESS);
            }
        }
        // @ts-ignore
        const updatedUser = await prismaClient.user.update({ where: { id: userId }, data: validatedData });

        res.status(201).json(updatedUser);
    } catch (error) {

        if (error instanceof BadRequestException) {
            res.status(400).json({ error: error.message, errorCode: ErrorCode.NOT_YOUR_ADDRESS });
        } else {
            res.status(500).json({ error: "Internal Server Error", errorCode: ErrorCode.INTERNAL_EXCEPTION });
        }
    }
};


const listAllUser = async (req: Request, res: Response) => {
    //
}


const getUserById = async (req: Request, res: Response) => {

}


const changeUserRole = async (req: Request, res: Response) => {

}

export {
    addAddress,
    deleteAddress,
    getAllAddresses,
    updateUser,
    listAllUser,
    getUserById,
    changeUserRole,
}