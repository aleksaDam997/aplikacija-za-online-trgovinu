import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  ManyToMany,
  JoinTable
} from "typeorm";
import { ArticleFeature } from "./article-feature.entity";
import { Category } from "./category.entity";
import { Article } from "./article.entity";
import * as Validator from 'class-validator';

@Index("fk_feature_category_id", ["categoryId"], {})
@Index("uq_feature_name_category_id", ["name", "categoryId"], { unique: true })
@Entity("feature")
export class Feature {
  @PrimaryGeneratedColumn({ type: "int", name: "feature_id", unsigned: true })
  featureId: number;

  @Column({ type: "varchar", length: 32 })
  @Validator.IsNotEmpty()
  @Validator.IsString()
  @Validator.Length(3, 32)
  name: string;

  @Column({ type: "int", name: "category_id", unsigned: true })
  categoryId: number;

  @OneToMany(
    () => ArticleFeature,
    articleFeature => articleFeature.feature
  )
  articleFeatures: ArticleFeature[];

  @ManyToMany(type => Article, article => article.features)
  @JoinTable({
    name: "article_feature",
    joinColumn: { name: "feature_id", referencedColumnName: "featureId" },
    inverseJoinColumn: { name: "article_id", referencedColumnName: "articleId" }
  })
  articles: Article[];

  @ManyToOne(
    () => Category,
    category => category.features,
    { onDelete: "NO ACTION", onUpdate: "CASCADE" }
  )
  @JoinColumn([{ name: "category_id", referencedColumnName: "categoryId" }])
  category: Category;
}
