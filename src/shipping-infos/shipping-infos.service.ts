import { Injectable } from '@nestjs/common';
import { ShippingInfosRepository } from './shipping-infos.repository';
import { BillingInfoDto } from 'src/billing-infos/dtos/billing-info.dto';

@Injectable()
export class ShippingInfosService {
  constructor(private shippingInfosRepository: ShippingInfosRepository) {}
  async create(data: BillingInfoDto) {
    return await this.shippingInfosRepository.create({
      data,
    });
  }
}
