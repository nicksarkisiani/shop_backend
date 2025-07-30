import { Module } from '@nestjs/common';
import {TokenCleanupService} from "./token-cleanup.service";
import {TokenModule} from "../token/token.module";

@Module({
    providers: [TokenCleanupService],
    imports: [TokenModule]
})
export class SchedulerModule {}
