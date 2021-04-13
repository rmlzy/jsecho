import { Test, TestingModule } from "@nestjs/testing";
import { WebService } from "./web.service";

describe("WebService", () => {
  let service: WebService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WebService],
    }).compile();

    service = module.get<WebService>(WebService);
  });

  it("should be defined", () => {
    expect(service).toBeDefined();
  });
});
