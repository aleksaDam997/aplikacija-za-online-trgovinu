import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Article } from "entities/article.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";

@Injectable()
export class ArticleService extends TypeOrmCrudService<Article>{
    constructor(
        @InjectRepository(Article)
        private readonly article: Repository<Article>){
            super(article);
        }
}