import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Relationship } from '../../entities';

@Injectable()
export class RelationshipsService {
  constructor(
    @InjectRepository(Relationship)
    private relationRepo: Repository<Relationship>,
  ) {}

  bulkCreate(metas) {
    return this.relationRepo.save(metas);
  }

  removeByMid(mid: number) {
    return this.relationRepo.delete({ mid });
  }

  removeByCid(cid: number) {
    return this.relationRepo.delete({ cid });
  }
}
