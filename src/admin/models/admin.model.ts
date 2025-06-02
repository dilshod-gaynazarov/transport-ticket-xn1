import { Column, DataType, Model, Table } from 'sequelize-typescript';
import { AdminRoles } from 'src/enums';

@Table({ tableName: 'admins' })
export class Admin extends Model {
  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  hashed_password: string;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: false,
    defaultValue: true,
  })
  is_active: boolean;

  @Column({
    type: DataType.ENUM(AdminRoles.SUPERADMIN, AdminRoles.ADMIN),
    allowNull: false,
    defaultValue: AdminRoles.ADMIN,
  })
  role: string;

  @Column({
    type: DataType.STRING,
  })
  image: string;
}
