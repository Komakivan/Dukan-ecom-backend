import { Request, Response } from "express";
import { prismaClient } from "../server";
import { UnauthorizedException } from "../exceptions/auth-exception";
import { ErrorCode } from "../exceptions/root";
import { NotFoundException } from "../exceptions/404.exception";
import { BadRequestException } from "../exceptions/bad-requests";
import { cartValidation } from "../schema/product.validation";
import { Prisma } from "@prisma/client";



const addItemToCart = async (req:Request, res:Response) => {
    // we will add item using their id 
    const validatedData = cartValidation.parse(req.body);
    try {
        // @ts-ignore
        const userId = req.user.id

        const itemId = +req.params.id
        // get the item from the products table
        const product = await prismaClient.product.findFirstOrThrow({ where: { id: itemId } })
        
        // check if the product is already in the cart
        const isInCart = await prismaClient.cartItems.findFirst({ where: { productId: product.id, userId: userId}})
        // Check if validatedData.quantity is explicitly provided (not undefined or null)
        const quantityProvided = validatedData.quantity !== undefined && validatedData.quantity !== null;

    if (isInCart && !quantityProvided) {
        // Product is already in the cart -> update the quantity
        await prismaClient.cartItems.update({
            where: { id: isInCart.id, userId: userId },
            data: { quantity: isInCart.quantity + 1 },
        });

        return  res.status(200).json({ message: "Quantity updated successfully" });
        } else {

            // Create a new product in the cart
         const cartQuantity = quantityProvided ? validatedData.quantity! : 1;

    
            const cartItem = await prismaClient.cartItems.create({ data: {
                userId: userId,
                productId: product.id,
                quantity: cartQuantity
            }})
    
            res.status(200).json(cartItem)
        }

    } catch (error) {
        // Handle different error scenarios and return appropriate response
        console.log(error)
        if (error instanceof Prisma.PrismaClientKnownRequestError) {
            res.status(400).json({ error: "Invalid input", errorCode: ErrorCode.INTERNAL_EXCEPTION });
        } else {
            res.status(500).json({ error: "Internal Server Error", errorCode: ErrorCode.INTERNAL_EXCEPTION });
        }
    }
}



const removeItemFromCart = async (req:Request, res:Response) => {
    // @ts-ignore
    const owner = req.user?.id
    const itemId = req.params.id;
    // check if product exists
    const isItem = await prismaClient.cartItems.findFirst({ where: { id: +itemId }})
    if(isItem?.userId !== owner) {
        throw new UnauthorizedException("This is not your item", ErrorCode.UNAUTHORIZED)
    } 
    if(!isItem) {
        throw new NotFoundException("Item not in  cart", ErrorCode.PRODUCT_NOT_FOUND);
    } else {
        await prismaClient.cartItems.delete({ where: { id: +itemId}})
    }

    res.status(200).json({ message: "Item deleted successfully"})
}



const getCart = async (req:Request, res:Response) => {
    // @ts-ignore
    const userId = req.user?.id
    const cartCount = await prismaClient.cartItems.count()
    const cartItems = await prismaClient.cartItems.findMany({
        where: { userId: userId},
        // @ts-ignore
        skip: +req.query.skip | 0,
        take: 5,
        include: {
            product: true
        }
    })

    res.status(200).json({ cartCount, cartItems})
}


// change the product quantity in the cart
const changeQuantity = async (req:Request, res:Response) => {
    const itemId = +req.params.id;
    const newQuantity = req.body.quantity;

    // @ts-ignore
    const owner = req.user?.id

    const product = await prismaClient.cartItems.findFirst({ where: { id: itemId }})
    if(!product) {
        throw new NotFoundException("Product not found", ErrorCode.PRODUCT_NOT_FOUND)
    }

    if(product.userId !== owner) {
        throw new UnauthorizedException("Unauthorized access", ErrorCode.UNAUTHORIZED)
    }

    const updatedItem =    await prismaClient.cartItems.update({ where: { id: itemId}, data: { quantity: newQuantity}})
    res.status(200).json(updatedItem)
    
}


export {  
    addItemToCart,
    removeItemFromCart,
    getCart,
    changeQuantity
}