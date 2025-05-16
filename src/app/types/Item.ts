export type Item = {
  id?: number;
  name: string;
  image?: string;
  releaseDate?: string;
  type?: "game" | "movie" | "tv" | string;
};

export type List = {
  id: string;
  name: string;
  items: Item[];
};
