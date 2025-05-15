export type Item = {
  id?: number;
  name: string;
  image?: string;
  releaseDate?: string;
  type?: "game" | "movie" | string;
};
