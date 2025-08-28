import { Injectable } from '@nestjs/common';
import { BillingInfoDto } from './dtos/billing-info.dto';
import { BillingInfosRepository } from './billing-infos.repository';

@Injectable()
export class BillingInfosService {
  constructor(private billingInfosRepository: BillingInfosRepository) {}
  async create(data: BillingInfoDto) {
    return await this.billingInfosRepository.create({
      data,
    });
  }
}
