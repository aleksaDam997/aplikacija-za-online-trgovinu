export class AddArticleDto{
    name: string;
    categoryId: number;
    except: string;
    description: string;
    price: number;
    features: {
        featureId: number;
        value: string;
    }[];   
}