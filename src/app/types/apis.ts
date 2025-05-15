export type IGDBApiResponse = {
  id: number;
  name: string;
  image: string | null;
  release_date: string;
};

export type TMDBApiResponse = {
  id: number;
  name: string;
  image: string | null;
  release_date: string;
};

export type TMDBTVApiResponse = {
  id: number;
  name: string;
  image: string | null;
  release_date: string;
};

export interface TMDBMovie {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string | null;
}

export interface TMDBTV {
  id: number;
  name: string;
  poster_path: string | null;
  first_air_date: string | null;
}
