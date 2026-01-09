import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChannelService } from './channel.service';
import { ChannelController } from './channel.controller';
import { Channel } from './entities/channel.entity';
import { Topic } from 'src/topics/entities/topic.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Channel, Topic])],
    controllers: [ChannelController],
    providers: [ChannelService],
    exports: [ChannelService],
})
export class ChannelModule { }
