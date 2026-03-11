import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm/repository/Repository';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
   ){}


  //using findOneOrCreate to create a user if it doesn't exist in our db but does on firebase
  async findOneOrCreate(createUserDto: CreateUserDto): Promise<User> {
    try {
      let user = await this.userRepository.findOne({ where: { email: createUserDto.email } });
      if (!user) {
        user = this.userRepository.create(createUserDto);
        await this.userRepository.save(user);
      }
      return user;
    } catch (error) {
      console.log('Error in findOneOrCreate:', error);
    }
  }
  
}
