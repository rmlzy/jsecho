import { Test, TestingModule } from "@nestjs/testing";
import { WebController } from "./web.controller";
import { WebService } from "./web.service";

describe("WebController", () => {
  let controller: WebController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WebController],
      providers: [WebService],
    }).compile();

    controller = module.get<WebController>(WebController);
  });

  it("should be defined", () => {
    expect(controller).toBeDefined();
  });
});
