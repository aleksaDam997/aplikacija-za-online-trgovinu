import * as Validator from 'class-validator';

export class ArticleSearchDeatureComponentDto {
    featureId: number;

    @Validator.IsArray()
    @Validator.IsNotEmpty({ each: true })
    @Validator.IsString({ each: true })
    @Validator.Length(1, 255, { each: true })
    values: string[];
}
