import { Module, Global, OnModuleDestroy } from "@nestjs/common";
import { MongoClient, Db } from "mongodb";

export const DATABASE_CONNECTION = "DATABASE_CONNECTION";

@Global()
@Module({
  providers: [
    {
      provide: DATABASE_CONNECTION,
      useFactory: async (): Promise<Db> => {
        const uri =
          process.env.MONGODB_URI ?? "mongodb://localhost:27017/iot_monitoring";

        const client = new MongoClient(uri);
        await client.connect();

        console.log("Connected to MongoDB");

        return client.db();
      },
    },
  ],
  exports: [DATABASE_CONNECTION],
})
export class DatabaseModule implements OnModuleDestroy {
  async onModuleDestroy() {
    // Connection cleanup is handled by NestJS lifecycle
  }
}
