export interface AggregatedLikesResult {
  _id: string; // postId
  newest: {
    userId: string;
    login: string;
    createdAt: Date;
  }[];
}
