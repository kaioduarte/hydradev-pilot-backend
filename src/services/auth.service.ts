import { Service, Inject } from 'typedi';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import config from '@/config';
import { IUser } from '@/interfaces/models/user.interface';
import { ISignUpDto } from '@/interfaces/dto/sign-up.dto';
import { ApiError } from '@/api/errors/api-error';
import HttpStatus from 'http-status-codes';
import { ISignInDto } from '@/interfaces/dto/sign-in.dto';
import UserService from './user.service';

@Service()
export default class AuthService {
  constructor(
    private _userService: UserService,
    @Inject('logger') private _logger,
  ) {}

  async signUp(input: ISignUpDto): Promise<{ user: IUser; token: string }> {
    const userCreated = await this._userService.create(input);
    const token = this._generateToken(userCreated);

    return { user: userCreated, token };
  }

  async signIn(input: ISignInDto): Promise<{ user: IUser; token: string }> {
    const userRecord = await this._userService.findByUsername(input.username);

    if (!userRecord) {
      throw new ApiError('User not registered', HttpStatus.NOT_FOUND);
    }

    if (!(await bcrypt.compareSync(input.password, userRecord.password))) {
      throw new ApiError('Credentials are wrong', HttpStatus.BAD_REQUEST);
    }

    const { password, ...user } = userRecord.toJSON();
    const token = this._generateToken(user);

    return { user, token };
  }

  private _generateToken(user: IUser): string {
    return jwt.sign(
      {
        _id: user._id,
        role: user.role,
        name: user.name,
      },
      config.jwtSecret,
      {
        expiresIn: '8h',
      },
    );
  }
}
