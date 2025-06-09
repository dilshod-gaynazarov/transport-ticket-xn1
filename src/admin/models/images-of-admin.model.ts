import {
  BelongsTo,
  Column,
  DataType,
  ForeignKey,
  Model,
  Table,
} from 'sequelize-typescript';
import { Admin } from './admin.model';

@Table({ tableName: 'images_of_admin' })
export class ImagesOfAdmin extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  image_url: string;

  @ForeignKey(() => Admin)
  @Column({
    type: DataType.INTEGER,
  })
  admin_id: number;

  @BelongsTo(() => Admin)
  admin: Admin;
}
