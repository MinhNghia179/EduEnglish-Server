import { IsEmail, IsNotEmpty, IsOptional, IsUrl } from "class-validator";

export class UpdateChannelDto {
    @IsNotEmpty()
    name: string;

    @IsOptional()
    description?: string;

    @IsOptional()
    @IsEmail()
    contactInfo?: string;

    @IsOptional()
    @IsUrl()
    bannerUrl?: string;

    @IsOptional()
    handle?: string;
}
