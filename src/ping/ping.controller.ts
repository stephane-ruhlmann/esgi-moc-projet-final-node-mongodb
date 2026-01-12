import { Controller, Get } from "@nestjs/common";

@Controller()
export class PingController {
  @Get("ping")
  ping(): { ok: boolean } {
    return { ok: true };
  }
}
