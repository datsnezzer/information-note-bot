/* eslint-disable prettier/prettier */

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserCredential } from 'src/model/usercredential.entity';
import { Repository } from 'typeorm';

@Injectable()
export class UserCredentialService {
  constructor(
    @InjectRepository(UserCredential)
    private readonly userCredentialRepository: Repository<UserCredential>,
  ) {}

  async setPin(pin: string): Promise<void> {
    const userCredential = new UserCredential();
    userCredential.pin = pin;
    await this.userCredentialRepository.save(userCredential);
  }

  async verifyPin(pin: string): Promise<boolean> {
    const usercredential = await this.userCredentialRepository.findOne({
      where: { pin },
    });
    return !!usercredential;
  }

  async changePin(oldPin: string, newPin: string): Promise<boolean> {
    const userCredential = await this.userCredentialRepository.findOne({
      where: { pin: oldPin },
    });

    if (userCredential) {
      userCredential.pin = newPin;
      await this.userCredentialRepository.save(userCredential);
      return true;
    }
    return false;
  }
}
