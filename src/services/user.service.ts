import { Service, Inject } from 'typedi';
import bcrypt from 'bcrypt';
import { ApiError } from '@/api/errors/api-error';
import HttpStatus from 'http-status-codes';
import { ICreateUserDto } from '@/interfaces/dto/create-user.dto';

@Service()
export default class UserService {
  constructor(
    @Inject('userModel') private _userModel: Models.UserModel,
    @Inject('logger') private _logger,
  ) {}

  async findAll() {
    return this._userModel.find({}, '-password');
  }

  async findById(id: string) {
    const user = await this._userModel.findById(id, '-password');

    if (!user) {
      throw new ApiError('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async findByUsername(username: string) {
    const user = await this._userModel.findOne({ username }, '-password');

    if (!user) {
      throw new ApiError('User not found', HttpStatus.NOT_FOUND);
    }

    return user;
  }

  async create(input: ICreateUserDto) {
    const userRecord = await this.findByUsername(input.username);

    if (userRecord) {
      throw new ApiError(
        'There is already an account with this username',
        HttpStatus.CONFLICT,
      );
    }

    const userCreated = await this._userModel.create({
      ...input,
      password: bcrypt.hashSync(input.password, 12),
    });

    if (!userCreated) {
      throw new ApiError(
        'User cannot be created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return userCreated;
  }
}
