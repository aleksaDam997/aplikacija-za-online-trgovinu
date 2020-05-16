import { Controller } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { Category } from "entities/category.entity";
import { CategoryService } from "src/services/category/category.service";

@Controller('/api/category')
@Crud({
    model: {
        type: Category
    },
    params: {
        categoryId: {
        field: 'category_id',
        type: 'number',
        primary: true
        }
    },
    query:{
        join:{
            categories:{
                eager: true //true da ukljucim podkategorije false da iskljucim
            },
            parentCategory:{
                eager: false
            },
            features:{
                eager: true
            },
            articles: {
                eager: false
            },
            articleFeatures: {
                eager: true
            }
        }
    }
    })
export class CategoryController{

    constructor(public service: CategoryService){}
}