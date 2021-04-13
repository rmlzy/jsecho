import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { In, Repository } from "typeorm";
import { uniq } from "lodash";
import { MetaService } from "../meta/meta.service";
import { IMetaType } from "../meta/meta.interface";
import { MetaVo } from "../meta/meta.vo";
import { ContentMetaMapVo } from "../content/content.vo";
import { RelationshipEntity } from "./relationship.entity";

@Injectable()
export class RelationshipService {
  constructor(
    @InjectRepository(RelationshipEntity)
    private relationRepo: Repository<RelationshipEntity>,
    private metaService: MetaService,
  ) {}

  async findMetasByCid(cid, type: IMetaType): Promise<MetaVo[]> {
    const relations = await this.relationRepo.find({
      where: { cid },
      select: ["mid"],
    });
    const mids: number[] = uniq(relations.map((item) => item.mid));
    const metaMap = await this.metaService.findMetaMapByMids(mids, type);
    return Object.values(metaMap);
  }

  async findContentMetaMapByCids(cids: number[], type: IMetaType): Promise<ContentMetaMapVo> {
    const relations = await this.relationRepo.find({
      where: { cid: In(cids) },
      select: ["mid"],
    });
    const mids: number[] = uniq(relations.map((item) => item.mid));
    const metaMap = await this.metaService.findMetaMapByMids(mids, type);
    const contentMap = {};
    relations.forEach((item) => {
      const meta = metaMap[item.mid];
      if (meta) {
        if (contentMap[item.cid]) {
          contentMap[item.cid].push(meta);
        } else {
          contentMap[item.cid] = [meta];
        }
      }
    });
    return contentMap;
  }
}
