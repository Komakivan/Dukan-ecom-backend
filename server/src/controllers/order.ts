import { Request, Response } from "express";
import { prismaClient } from "../server";


const createOrder = async (req:Request, res:Response) => {
    // 1. create a prisma transaction
    // 2. list all cart items and proceed id cart is empty
    // 3. calculate total amount
    // 4. fetch address of user -> default shipping address
    // 5. format address
    // 6. create order and oder producs
    // 7. create event
    // 8. empty the cart

    // @ts-ignore
    const user = req.user
    try {
        
        return await prismaClient.$transaction( async (tx) => {
            const cartItems = await tx.cartItems.findMany({ 
                where: { userId: user?.id},
                include: {
                    product: true
                }
            })
    
            if(cartItems.length == 0) {
                return res.status(400).json({ message: "Cart is empty"})
            }
            // calculate total amount -> reduce()
            const amount = cartItems.reduce( (sum, item) => {
                return sum + (item.quantity * +item.product.price)
            },0)
            // get address
            const address = await tx.address.findFirst({ 
                where: {
                    // @ts-ignore
                    id: user?.defaultShippingAddress
                }
            })
            // create the order
            const order = await tx.order.create({
                data: {
                    userId: user?.id,
                    netAmount: amount,
                    // @ts-ignore
                    address: address?.formattedAddress,
                    products: {
                        create: cartItems.map(item => {
                            return {
                                productId: item.productId,
                                quantity: item.quantity
                            }
                        })
                    }
    
                }
            })
    
            const orderEvent = await tx.orderEvents.create({
                // @ts-ignore
                data: {
                    id: order.id,
                    orderId: order.id
                }
            })
    
            // empty the cart
            await tx.cartItems.deleteMany({
                where: {
                    id: user?.id
                }
            })
    
            return res.status(201).json({order, orderEvent,  message: "Order created successfully"})
    
        })
    } catch (error) {
        console.log(error)
    }


}

const listOrders = async (req:Request, res:Response) => {
    // @ts-ignore
    const userId = req.user?.id
    const orders = await prismaClient.order.findMany({
        where: {
            userId: userId
        }
    })

    res.status(200).json(orders)
}



const cancelOrder = async (req:Request, res:Response) => {
    // @ts-ignore

    const userId = req.user?.id

     await prismaClient.$transaction([ // this will rollback the transaction if errors occur
         prismaClient.order.update({
            where: {
                id: +req.params.id,
                userId: userId // check if user is cancelling own order
            },
            data: {
                status: "CANCELLED"
            }
        }),
        prismaClient.orderEvents.create({
            data: {
                orderId: +req.params.id,
                orderStatus: "CANCELLED"
            }
        })

    ])

    

    res.status(200).json({ message: `order of id ${req.params.id} was cancelled}`})
}

const getOderById = async (req:Request, res:Response) => {
    // @ts-ignore
    const userId = req.user?.id
    const order = await prismaClient.order.findFirst({
        where: {
            id: +req.params.id,
            userId: userId
        },
        include: {
            products: true,
            events: true
        }
    })

    res.status(200).json(order)
}


const listAllOrders =  async (req:Request, res:Response) => {

    let whereCluase = {}
    const status = req.query.status;
    if(status) {
        whereCluase = {
            status
        }
    }
    const count = await prismaClient.order.count()
    const orders = await prismaClient.order.findMany({
        where: whereCluase,
        // @ts-ignore
        skip: +req.query.skip || 0,
        take: 5,
        include: {
            products: true
        }
    })

    res.status(200).json({ count, orders})
}


const changeStatus = async (req:Request, res:Response) => {
    const orderId = +req.params.id

    // this two operations can be wrapped inside a transaction
    const updatedOrder = await prismaClient.order.update({
        where: {
            id: orderId,
        },
        data: {
            status: req.body.status
        },
        include: {
            events: true
        }
    })

    await prismaClient.orderEvents.create({
        data: {
            orderId: orderId,
            orderStatus: req.body.status
        }
    })

    res.status(201).json({updatedOrder, message: "Order updated successfully"})
}



const listOrderByUser = async (req:Request, res:Response) => {
    // @ts-ignore
    let whereClause: any = {
        userId: +req.params.id
    }
    let status = req.query.status
    if(status) {
        whereClause = {
            ...whereClause,
            status
        }
    }
    const orders = await prismaClient.order.findMany({
        where: whereClause,
        include: {
            products: true,
            events: true
        }
    })

    res.status(200).json(orders)
}



export {
    createOrder,
    listOrders,
    cancelOrder,
    getOderById,
    listAllOrders,
    listOrderByUser,
    changeStatus
}