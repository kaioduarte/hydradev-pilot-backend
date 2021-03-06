import { Service, Inject } from 'typedi';
import bcrypt from 'bcrypt';
import { ApiError } from '@/api/errors/api-error';
import HttpStatus from 'http-status-codes';
import { ICreateUserDto } from '@/interfaces/dto/create-user.dto';

@Service()
export default class UserService {
  constructor(
    @Inject('cardModel') private _cardModel: Models.CardModel,
    @Inject('collectionModel') private _collectionModel: Models.CollectionModel,
    @Inject('userModel') private _userModel: Models.UserModel,
    @Inject('logger') private _logger,
  ) {}

  async findAll(name = '') {
    return this._userModel.find({ name: { $regex: name, $options: 'i' } });
  }

  findById(id: string) {
    return this._userModel.findById(id);
  }

  findByUsername(username: string) {
    return this._userModel.findOne({ username });
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
        'User could not be created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this.findByUsername(input.username);
  }

  async patch(_id: string, input: Partial<ICreateUserDto>) {
    const user = await this.findById(_id);

    if (!user) {
      throw new ApiError('User not found', HttpStatus.NOT_FOUND);
    }

    if (input.password) {
      input.password = bcrypt.hashSync(input.password, 12);
    }

    Object.entries(input).forEach(([key, val]) => (user[key] = val));

    return user.save({ validateBeforeSave: true });
  }

  async update(_id: string, input: Partial<ICreateUserDto>) {
    const user = await this.findById(_id);

    if (!user) {
      throw new ApiError('User not found', HttpStatus.NOT_FOUND);
    }

    return await this._userModel.updateOne({ _id }, { $set: input });
  }

  async delete(_id: string) {
    const user = await this.findById(_id);

    if (!user) {
      throw new ApiError('User not found', HttpStatus.NOT_FOUND);
    }

    return Promise.all([
      this._collectionModel.deleteMany({ user: _id }),
      this._cardModel.deleteMany({ user: _id }),
      user.remove(),
    ]);
  }
}
