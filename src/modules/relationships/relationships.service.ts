import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { uniq, keyBy } from 'lodash';
import { MetaEntity, RelationshipEntity } from '../../entities';
import { MetasService } from '../metas/metas.service';

interface ICategory {
  [key: string]: MetaEntity;
}

@Injectable()
export class RelationshipsService {
  constructor(
    @InjectRepository(RelationshipEntity)
    private relationRepo: Repository<RelationshipEntity>,
    private metaService: MetasService,
  ) {}

  async findCategoriesByCids(cids: number[]): Promise<ICategory> {
    const relations = await this.relationRepo.find({
      where: { cid: In(cids) },
    });
    const mids: number[] = uniq(relations.map((item) => item.mid));
    const metas = await this.metaService.findCategoriesByMids(mids);
    const metaMap = keyBy(metas, 'mid');
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
