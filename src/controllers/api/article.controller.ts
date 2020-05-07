import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { ArticleService } from "src/services/article/article.service";
import { Article } from "entities/article.entity";

@Controller('/api/article')
@Crud({
    model:{
        type: Article
    },
    params:{
        id: {
            field: 'article_id',
            type: 'number',
            primary: true
        }
    },
    query:{
        join:{
            category: {
                eager: true
            },
            photos:{
                eager: true
            },
            articlePrice: {
                eager: true
            },
            features:{
                eager: true
            }
        }
    }
})
export class ArticleController{
    constructor(
        public service: ArticleService
    ){}
}