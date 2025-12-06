import { HydratedDocument } from 'mongoose';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

enum MyLikeStatusTypes {
  Like = 'Like',
  Dislike = 'Dislike',
}

export type PostLikeDocument = HydratedDocument<PostLike>;

@Schema()
export class PostLike {
  @Prop({ required: true })
  userId: string;

  @Prop({ required: true })
  postId: string;

  @Prop({ required: true, enum: MyLikeStatusTypes })
  status: string;

  @Prop({ required: true, default: Date.now })
  createdAt: Date;
}
export const PostLikeSchema = SchemaFactory.createForClass(PostLike);
