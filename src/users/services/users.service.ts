import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDTO } from '../dtos';
import { UserEntity } from '../entities';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(UserEntity) 
        private usersRepository: Repository<UserEntity>
    ) {}

    /**
     *  Get By Id
     */
    async getById(id: number) {
        const user = await this.usersRepository.findOne({ where: { id: id } });
        if(user) {
            return user;
        }
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }

    /**
     *  Get By Email
     */
    async getByEmail(email: string) {
        const user = await this.usersRepository.findOne({ where: { email: email } });
        if(user) {
            return user;
        }
        throw new HttpException('User with this email does not exist', HttpStatus.NOT_FOUND);
    }

    /**
     *  Create
     */
    async create(userData: CreateUserDTO) {
        const newUser = await this.usersRepository.create(userData);
        await this.usersRepository.save(newUser);
        return newUser;
    }
}
