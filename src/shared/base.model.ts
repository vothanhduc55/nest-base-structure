import { ApiPropertyOptional } from '@nestjs/swagger';
import { SchemaOptions } from 'mongoose';
import { Typegoose, prop } from 'typegoose';
import { Expose } from 'class-transformer';

export class BaseModelVm {
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    @Expose()
    createdAt?: Date;

    @ApiPropertyOptional({ type: String, format: 'date-time' })
    @Expose()
    updatedAt?: Date;

    @ApiPropertyOptional()
    @Expose()
    id?: string;
}

export abstract class BaseModel<T> extends Typegoose {
    @prop()
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    @Expose()
    createdAt: Date;

    @prop()
    @ApiPropertyOptional({ type: String, format: 'date-time' })
    @Expose()
    updatedAt: Date;

    @ApiPropertyOptional()
    @Expose()
    id: string;
}

export const schemaOptions: SchemaOptions = {
    timestamps: true,
    toJSON: {
        virtuals: true,
        getters: true,
    },
};