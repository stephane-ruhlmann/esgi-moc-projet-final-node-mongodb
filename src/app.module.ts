import { Module } from "@nestjs/common";
import { DatabaseModule } from "./common/database/database.module";
import { PingModule } from "./ping/ping.module";

@Module({
  imports: [DatabaseModule, PingModule],
})
export class AppModule {}
