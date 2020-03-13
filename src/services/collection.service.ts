import { Service, Inject } from 'typedi';
import { ApiError } from '@/api/errors/api-error';
import HttpStatus from 'http-status-codes';
import { ICreateCollectionDto } from '@/interfaces/dto/create-collection.dto';
import CardService from './card.service';

@Service()
export default class CollectionService {
  constructor(
    private _cardService: CardService,
    @Inject('collectionModel') private _collectionModel: Models.CollectionModel,
    @Inject('logger') private _logger,
  ) {}

  async findById(_id: string) {
    return this._collectionModel
      .findById(_id)
      .populate({
        path: 'cards',
        model: 'Card',
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .populate('user', 'username');
  }

  async findAll(name = '') {
    return this._collectionModel
      .find({ name: { $regex: name, $options: 'i' } })
      .populate({
        path: 'cards',
        model: 'Card',
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .populate('user', 'username');
  }

  async findAllByUserId(userId: string, name = '') {
    return this._collectionModel
      .find({
        name: { $regex: name, $options: 'i' },
        user: userId,
      })
      .populate({
        path: 'cards',
        model: 'Card',
        populate: {
          path: 'user',
          model: 'User',
        },
      })
      .populate('user', 'username');
  }

  async create(input: ICreateCollectionDto, userId: string) {
    const collectionCreated = await this._collectionModel.create({
      ...input,
      user: userId,
    });

    if (!collectionCreated) {
      throw new ApiError(
        'Collection could not be created',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }

    return this._collectionModel
      .findById(collectionCreated._id)
      .populate('user', 'username');
  }

  async update(collectionId: string, input: ICreateCollectionDto) {
    const collection = await this._collectionModel.findByIdAndUpdate(
      collectionId,
      input,
    );

    if (!collection) {
      throw new ApiError('Collection not found', HttpStatus.NOT_FOUND);
    }
  }

  async delete(collectionId: string) {
    const collection = await this._collectionModel.findByIdAndDelete(
      collectionId,
    );

    if (!collection) {
      throw new ApiError('Collection not found', HttpStatus.NOT_FOUND);
    }
  }

  async addCard(collectionId: string, input: any) {
    const [card, collection] = await Promise.all([
      this._cardService.findById(input._id),
      this.findById(collectionId),
    ]);

    if (!card) {
      throw new ApiError('Card not found', HttpStatus.NOT_FOUND);
    }

    if (!collection) {
      throw new ApiError('Collection not found', HttpStatus.NOT_FOUND);
    }

    if (collection.cards.some(c => c.id === card.id)) {
      throw new ApiError(
        'This card is already in this collection',
        HttpStatus.CONFLICT,
      );
    }

    collection.cards.push(card);
    return collection.save();
  }

  async removeCard(collectionId: string, cardId: string) {
    await this._collectionModel.updateOne(
      { _id: collectionId },
      {
        $pull: { cards: cardId },
      },
    );
  }
}
