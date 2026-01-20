export interface AggregatedLikesResult {
  _id: string; // postId
  newest: {
    userId: string;
    userLogin: string;
    createdAt: Date;
  }[];
}
