import { Injectable } from "@nestjs/common";
import { TypeOrmCrudService } from "@nestjsx/crud-typeorm";
import { Article } from "entities/article.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { ArticlePrice } from "entities/article-price.entity";
import { ArticleFeature } from "entities/article-feature.entity";

@Injectable()
export class ArticleService extends TypeOrmCrudService<Article>{
    constructor(
        @InjectRepository(Article)
        private readonly article: Repository<Article>,
        
        @InjectRepository(ArticlePrice)
        private readonly articlePrice: Repository<ArticlePrice>,
        
        @InjectRepository(ArticleFeature)
        private readonly articleFeature: Repository<ArticleFeature>){
            super(article);
        }

        async createFullArticle(data: AddArticleDto): Promise<Article>{
            
            let newArticle: Article = new Article();
            newArticle.name = data.name;
            newArticle.description = data.description;
            newArticle.except = data.except;
            newArticle.categoryId = data.categoryId;

            let savedArticle: Article = await this.article.save(newArticle);
        
            let newArticlePrice: ArticlePrice = new ArticlePrice();

            newArticlePrice.articleId = savedArticle.articleId;
            newArticlePrice.price = data.price;

            await this.articlePrice.save(newArticlePrice);

            for(let feature of data.features){

                let newArticleFeature: ArticleFeature = new ArticleFeature();

                newArticleFeature.articleId = savedArticle.articleId;
                newArticleFeature.featureId = feature.featureId;
                newArticleFeature.value = feature.value;

                await this.articleFeature.save(newArticleFeature);
            }

            return await this.article.findOne(savedArticle.articleId, {
                relations: ["category", "articleFeatures", "features", "articlePrices"]
            });

        }
}