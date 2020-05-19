import { Controller, Post, Body, Param, UseInterceptors, UploadedFile, Req } from "@nestjs/common";
import { Crud } from "@nestjsx/crud";
import { ArticleService } from "src/services/article/article.service";
import { Article } from "src/entities/article.entity";
import { AddArticleDto } from "src/dtos/article/add.article.dto";
import { FileInterceptor } from "@nestjs/platform-express";
import { diskStorage } from "multer";
import { StorageConfig } from "config/storage.config";
import { Photo } from "src/entities/photo.entity";
import { PhotoService } from "src/services/photo/photo.service";
import { ApiResponse } from "misc/api.response.class";
import * as fileType from "file-type";
import * as fs from "fs";
import * as sharp from "sharp";

@Controller('/api/article')
@Crud({
    model:{
        type: Article
    },
    params:{
        articleId: {
            field: 'article_id',
            type: 'number',
            primary: true, 
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
        public service: ArticleService,
        public photoService: PhotoService
    ){}

    @Post("/createFull")
    createFullArticle(@Body() data: AddArticleDto){
        return this.service.createFullArticle(data);
    }

    @Post(':articleId/uploadPhoto')
    @UseInterceptors(
        FileInterceptor('photo', {
            storage: diskStorage({
                destination: StorageConfig.photo.destinaion,
                filename: (req, file, callback) =>{
                    let original: string = file.originalname;
                    let normalized: string = original.replace(/\s+/g, '-');
                    normalized.replace(/[^A-z0-9\.\-]/g, "");

                    let randomNum: string = "";

                    for(let i: number = 0; i < 10; i++){
                        randomNum += (Math.random() * 10).toFixed(0).toString();
                    }

                    let now: Date = new Date();
                    let datePart: string = "";
                    datePart += now.getFullYear().toString();
                    datePart += (now.getMonth() + 1).toString();
                    datePart += now.getDate().toString();

                    let fileName: string = datePart + "-" + randomNum + "-" + normalized;

                    callback(null, fileName);
                }
            }),
            fileFilter: (req, file, callback) =>{
                if(file.originalname.match(/\.(JPG|PNG)$/)){
                    req.fileFilterError = "Bad file extension!";
                    callback(null, false);
                    return;
                }

                if(!(file.mimetype.includes("jpeg") || file.mimetype.includes("png"))){
                    req.fileFilterError = "Bad file content!";
                    callback(null, false);
                    return;
                }

                callback(null, true);
            },
            limits: {
                files: 1, 
                fileSize: StorageConfig.photo.sizeLimit
            }
        })
    )
    async uploadPhoto(@Param('articleId')articleId: number, @UploadedFile() photo, @Req() req): Promise<ApiResponse | Photo>{

        if(req.fileFiltererror){
            return new ApiResponse("error", -4002, req.fileFilterError);
        }
        
        if(!photo){
            return new ApiResponse("error", -4002, "Photo not uploaded!");
        }

        const fileTypeRes = await fileType.fromFile(photo.path);

        if(!fileTypeRes){
            fs.unlinkSync(photo.path);
            return new ApiResponse("error", -4002, "Cannot detect mime type!");
        }

        const realMimeType = await fileTypeRes.mime;

        if(!(realMimeType.includes("jpeg") || realMimeType.includes("png"))){
            fs.unlinkSync(photo.path);
            return new ApiResponse("error", -4002, "Bad file contenr type!");

        }

        await this.createResizedImage(photo, StorageConfig.photo.small);
        await this.createResizedImage(photo, StorageConfig.photo.thumb);

        //TODO: real mime type check
        // TODO: resize and save image

        const newPhoto = new Photo();
        newPhoto.articleId = articleId;
        newPhoto.imagePath = photo.filename.toLowerCase();

        const savedPhoto = await this.photoService.add(newPhoto);

        if(!savedPhoto){
            return new ApiResponse("error", -4001);
        }
        return savedPhoto;
    }

    async createResizedImage(photo, type){
        const destinationName = StorageConfig.photo.destinaion + type.destination + photo.filename;
        
        sharp(photo.path).resize({
            fit: "cover", //moze biti 'contain'
            width: type.width,
            height: type.height,
            background: {
                r: 255,
                g: 255,
                b: 255,
                alpha: 0.0
            }
        }).toFile(destinationName);
    }
}