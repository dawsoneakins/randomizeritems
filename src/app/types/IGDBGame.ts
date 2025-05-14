export type IGDBGame = {
  id: number;
  name: string;
  cover?: {
    image_id: string;
  };
  first_release_date?: number;
};
