import { Service, Inject } from 'typedi';
import { ApiError } from '@/api/errors/api-error';
import HttpStatus from 'http-status-codes';
import { ICreateCollectionDto } from '@/interfaces/dto/create-collection.dto';

@Service()
export default class CollectionService {
  constructor(
    @Inject('collectionModel') private _collectionModel: Models.CollectionModel,
    @Inject('logger') private _logger,
  ) {}

  async findById(_id: string) {
    return this._collectionModel.findById(_id).populate('cards');
  }

  async findAll(name = '') {
    return this._collectionModel
      .find({ name: { $regex: name, $options: 'i' } })
      .populate('cards')
      .populate('user', 'name');
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
      .populate('user')
      .populate('cards');
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
}
