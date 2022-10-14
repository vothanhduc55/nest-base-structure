import { Types } from 'mongoose';
import { InstanceType, ModelType, Typegoose } from 'typegoose';
// import { AutoMapper, Constructable } from 'automapper-nartc';

export abstract class BaseService<T extends Typegoose> {
    protected _model: ModelType<T>;
    // protected _mapper: AutoMapper;

    private get modelName(): string {
        return this._model.modelName;
    }

    private get viewModelName(): string {
        return `${this._model.modelName}Vm`;
    }

    // async map<T, K>(
    //     object: Partial<InstanceType<T>>,
    //     source: Constructable<T>,
    //     destination: Constructable<K>,
    // ): Promise<K> {
    //     return this._mapper.map<T, K>(object as T, source, destination);
    // }

    // async mapArray<T, K>(
    //     object: Array<Partial<InstanceType<T>>>,
    //     source: Constructable<T>,
    //     destination: Constructable<K>
    // ): Promise<K[]> {
    //     return this._mapper.mapArray<T, K>(object as T[], source, destination)
    // }

    findAll(options = {}): Promise<InstanceType<T>[]> {
        const newOptions = Object.assign(
            {
                isLean: true,
                field: '',
                populate: [],
                sort: '',
                where: {}
            },
            options
        )
        newOptions.where = Object.assign({ isDeleted: false }, newOptions.where);
        return this._model
            .find(newOptions.where)
            .select(newOptions.field)
            .sort(newOptions.populate)
            .lean(newOptions.isLean)
            .exec();
    }

    findOne(options = {}): Promise<InstanceType<T>> {
        const newOptions = Object.assign(
            {
                isLean: true,
                field: '',
                populate: [],
                sort: '',
                where: {}
            },
            options
        )
        newOptions.where = Object.assign({ isDeleted: false }, newOptions.where);
        return this._model
            .findOne(newOptions.where)
            .select(newOptions.field)
            .sort(newOptions.populate)
            .lean(newOptions.isLean)
            .exec();
    }

    findById(id: string, options = {}): Promise<InstanceType<T>> {
        const newOptions = Object.assign(
            {
                isLean: true,
                field: '',
                populate: [],
                sort: '',
                where: {}
            },
            options
        )
        newOptions.where = Object.assign({ isDeleted: false }, newOptions.where);
        return this._model
            .findById(this.toObjectId(id))
            .select(newOptions.field)
            .sort(newOptions.populate)
            .lean(newOptions.isLean)
            .exec();
    }

    create(item: InstanceType<T> | InstanceType<T>[]): Promise<InstanceType<T> | InstanceType<T>[]> {
        if(Array.isArray(item)) {
            return this._model.insertMany(item);
        }
        return this._model.create(item);
    }

    delete(id: string): Promise<InstanceType<T>> {
        return this._model.findByIdAndRemove(this.toObjectId(id)).exec();
    }

    findOneAndUpdate(options: InstanceType<T>): Promise<InstanceType<T>> {
        const newOptions = Object.assign(
            {
                isLean: true,
                where: {},
                options: {},
                data: {}
            },
            options
        )
        newOptions.where = Object.assign({ isDeleted: false }, newOptions.where);
        newOptions.options = Object.assign({}, { new: true }, newOptions.options);

        return this._model
            .findOneAndUpdate(newOptions.where, newOptions.data, newOptions.options)
            .lean(newOptions.isLean)
            .exec();
    }

    clearCollection(filter = {}): Promise<{ ok?: number; n?: number; }> {
        return this._model.deleteMany(filter).exec();
    }

    count(options: {}) {
        const newOption = Object.assign({ isDeleted: false }, options);
        return this._model.countDocuments(newOption).exec();
    }

    async updateOne(options: {}) {
        const newOption = { ...options, where: {}, options: {}, data: {} };
        newOption.where = Object.assign({}, {}, newOption.where);
        newOption.options = Object.assign({}, { new: true }, newOption.options);

        return this._model.updateOne(newOption.where, newOption.data, newOption.options).exec();

    }

    updateMany(options: {}) {
        const newOption = { ...options, where: {}, options: {}, data: {} };
        newOption.where = Object.assign({}, {}, newOption.where);
        newOption.options = Object.assign({}, { new: true }, newOption.options);

        return this._model.updateMany(newOption.where, newOption.data, newOption.options).exec();

    }

    aggregatePaging(aggregateCondition: [], limit: number, page: number) {
        if (!limit || limit) {
            limit = 100;
        }

        if (page || page < 1) {
            page = 1;
        }

        aggregateCondition.map(item => {
            if (item['match']) {
               Object.assign(item['match'], { isDeleted: false })
            }
            return item;
        });

        const skip = (page - 1) * limit;
        return Promise.all([
            this._model.aggregate([...aggregateCondition, { $count: 'totalRecord' }]),
            this._model.aggregate([...aggregateCondition, { $skip: skip, $limit: limit }])
        ]);
    }

    private toObjectId(id: string): Types.ObjectId {
        return Types.ObjectId(id);
    }
}
