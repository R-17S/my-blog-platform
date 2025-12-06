import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

export enum MyLikeStatusTypes {
  Like = 'Like',
  Dislike = 'Dislike',
}

export type CommentLikeDocument = HydratedDocument<CommentLike>;

@Schema()
export class CommentLike {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  commentId: string;

  @Prop({ required: true, enum: MyLikeStatusTypes })
  status: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}
export const CommentLikeSchema = SchemaFactory.createForClass(CommentLike);
