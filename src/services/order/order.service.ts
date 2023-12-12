import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Cart } from "src/entities/cart.entity";
import { Repository } from "typeorm";
import { Order } from "src/entities/order.entity";
import { ApiResponse } from "src/misc/api.response.class";

@Injectable()
export class OrderService {
    constructor(
        @InjectRepository(Cart)
        private readonly cart: Repository<Cart>,
 
        @InjectRepository(Order)
        private readonly order: Repository<Order>,
    ) { }

    async add(cartId: number): Promise<Order | ApiResponse> {
        const order = await this.order.findOne({
            cartId: cartId,
        });

        if (order) {
            return new ApiResponse("error", -7001, "An order for this cart has already been made.");
        }

        const cart = await this.cart.findOne(cartId, {
            relations: [
                "cartArticles",
            ],
        });

        if (!cart) {
            return new ApiResponse("error", -7002, "No such cart found.");
        }

        if (cart.cartArticles.length === 0) {
            return new ApiResponse("error", -7003, "This cart is empty.");
        }

        const newOrder: Order = new Order();
        newOrder.cartId = cartId;
        const savedOrder = await this.order.save(newOrder);

        cart.createdAt = new Date();
        await this.cart.save(cart);

        return await this.getById(savedOrder.orderId);
    }

    async getById(orderId: number) {
        return await this.order.findOne(orderId, {
            relations: [
                "cart",
                "cart.user",
                "cart.cartArticles",
                "cart.cartArticles.article",
                "cart.cartArticles.article.category",
                "cart.cartArticles.article.articlePrices",
            ],
        });
    }

    async getAllByUserId(userId: number) {
        return await this.order.find({
            where: {
                userId: userId,
            },
            relations: [
                "cart",
                "cart.user",
                "cart.cartArticles",
                "cart.cartArticles.article",
                "cart.cartArticles.article.category",
                "cart.cartArticles.article.articlePrices",
            ],
        });
    }

    async getAll() {
        return await this.order.find({
            relations: [
                "cart",
                "cart.user",
                "cart.cartArticles",
                "cart.cartArticles.article",
                "cart.cartArticles.article.category",
                "cart.cartArticles.article.articlePrices",
            ],
        });
    }

    async changeStatus(orderId: number, newStatus: "rejected" | "accepted" | "shipped" | "pending") {
        const order = await this.getById(orderId);

        if (!order) {
            return new ApiResponse("error", -9001, "No such order found!");
        }

        order.status = newStatus;

        await this.order.save(order);

        return await this.getById(orderId);
    }
}
