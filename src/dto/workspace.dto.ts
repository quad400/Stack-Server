import { IsMongoId, IsNotEmpty, IsUrl } from "class-validator";

export class CreateModelDto {
  @IsNotEmpty()
  name: string;

  @IsUrl()
  image: string;
}

export class CreateBoardDto{
    @IsNotEmpty()
    name: string;
    
    @IsUrl()
    image: string;
}



export class CreateListDto{
    @IsNotEmpty()
    name: string;
    }


