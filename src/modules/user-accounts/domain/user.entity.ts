import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  login: string;

  @Prop({ required: true })
  email: string;

  @Prop({ required: true })
  passwordHash: string;

  createdAt: Date;
  updatedAt: Date;

  @Prop({ type: Boolean, required: true, default: false })
  isEmailConfirmed: boolean;

  @Prop({ type: Date, nullable: true })
  deletedAt: Date | null;

  /**
   * Factory method to create a User instance
   */
  static createInstance(
    login: string,
    email: string,
    passwordHash: string,
  ): UserDocument {
    const user = new this();
    user.login = login;
    user.email = email;
    user.passwordHash = passwordHash;
    user.isEmailConfirmed = false; // бизнес‑правило: всегда требует подтверждения
    return user as UserDocument;
  }

  /**
   * Updates user email and resets confirmation
   */
  updateEmail(newEmail: string) {
    if (newEmail !== this.email) {
      this.email = newEmail;
      this.isEmailConfirmed = false;
    }
  }

  /**
   * Marks user as deleted (soft delete)
   */
  makeDeleted() {
    if (this.deletedAt !== null) {
      throw new Error('User already deleted');
    }
    this.deletedAt = new Date();
  }
}

export const UserEntity = SchemaFactory.createForClass(User);
UserEntity.loadClass(User);

export type UserDocument = HydratedDocument<User>;
export type UserModelType = Model<UserDocument> & typeof User;
