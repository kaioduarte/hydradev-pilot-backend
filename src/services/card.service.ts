import { Service, Inject } from 'typedi';
import { ApiError } from '@/api/errors/api-error';
import HttpStatus from 'http-status-codes';
import { ICreateCardDto } from '@/interfaces/dto/create-card.dto';

@Service()
export default class CardService {
  constructor(
    @Inject('cardModel') private _cardModel: Models.CardModel,
    @Inject('logger') private _logger,
  ) {}

  async findById(_id: string) {
    return this._cardModel.findById(_id).populate('user', 'name');
  }

  async findAll(name = '') {
    return this._cardModel
      .find({ name: { $regex: name, $options: 'i' } })
      .populate('user', 'name');
  }

  async create(input: ICreateCardDto, userId: string) {
    const cardCreated = await this._cardModel.create({
      ...input,
      user: userId,
    });

    if (!cardCreated) {
      throw new ApiError(
        'Card cannot be created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this._cardModel.findById(cardCreated._id).populate('user');
  }

  async update(cardId: string, input: ICreateCardDto) {
    const card = await this._cardModel.findByIdAndUpdate(cardId, input);

    if (!card) {
      throw new ApiError('Card not found', HttpStatus.NOT_FOUND);
    }
  }

  async delete(cardId: string) {
    const card = await this._cardModel.findByIdAndDelete(cardId);

    if (!card) {
      throw new ApiError('Card not found', HttpStatus.NOT_FOUND);
    }
  }
}
