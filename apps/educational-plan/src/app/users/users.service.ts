import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { FindOptionsWhere, ILike, Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Paginated } from '../lib/types/Paginated';
import { UserQueryDto } from './dto/user-query.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.findOneByEmail(createUserDto.email);
    if (existingUser) {
      throw new BadRequestException('E-mailul există deja.');
    }
    return this.usersRepository.save(createUserDto);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const user = await this.findOne(id);
    const updatedUser = await this.usersRepository.save({ ...user, ...updateUserDto });
    return updatedUser;
  }

  async findAll(opts?: UserQueryDto): Promise<Paginated<User>> {
    const where: FindOptionsWhere<User>[] = [];
    if(opts?.email) {
      where.push({ email: ILike(`%${opts.email}%`) });
    }
    const [data, count] = await this.usersRepository.findAndCount({
      take: opts?.limit,
      skip: opts?.offset,
      where: where.length ? where : undefined,
    });
    return { data, count };
  }

  async findOne(id: string) {
    const user = await this.usersRepository.findOneBy({ id });
    if (!user) {
      throw new BadRequestException('Utilizatorul nu există.');
    }
    return user;
  }

  async findOneByEmail(email: string) {
    return this.usersRepository.findOne({
      where: { email },
      select: ['id', 'firstName', 'lastName', 'email', 'password', 'role']
    });

  }

  async delete(id: string) {
    const deletedUser = await this.usersRepository.delete({ id });
    return deletedUser;
  }

}
