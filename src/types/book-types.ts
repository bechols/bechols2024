export interface GoodreadsReviewElement {
  book: [
    {
      title: [string];
      link: [string];
      image_url: [string];
      authors: [
        {
          author: [
            {
              name: [string];
            }
          ];
        }
      ];
    }
  ];
  rating: [string];
  body: [string];
}

export interface GoodreadsResult {
  GoodreadsResponse: {
    reviews: [
      {
        review?: GoodreadsReviewElement[];
      }
    ];
  };
}

export interface BookInfo {
  title: string;
  author: string;
  link: string;
  imageURL: string;
  rating?: number;
  review?: string;
}

export interface ShelfConfig {
  shelf: string;
  includeRating?: boolean;
  includeReview?: boolean;
}