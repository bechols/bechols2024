import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "@/components/ui/card";
import axios from "axios";
import { Star } from "lucide-react";
import Image from "next/image";
import { parseString } from "xml2js";

async function getCurrentBooks() {
  const currentOptions = {
    method: `get`,
    url: `https://www.goodreads.com/review/list`,
    params: {
      id: process.env.GOODREADS_USER_ID,
      shelf: `currently-reading`,
      v: 2,
      key: process.env.GOODREADS_API_KEY,
      per_page: 5,
      page: 1,
      sort: `date_read`,
    },
  };
  const currentShelfListXml = await axios(currentOptions);
  let currentlyReading;

  parseString(currentShelfListXml.data, function (err, result) {
    if (err) {
      return;
    } else {
      if (
        Object.keys(result["GoodreadsResponse"]["reviews"][0]["review"] || {})
          .length === 0
      ) {
        return; // TODO: handle empty response
      }
      currentlyReading = result["GoodreadsResponse"]["reviews"][0][
        "review"
      ].map((element) => {
        var bookElement = element["book"][0];

        var isbnValue = bookElement["isbn"][0];
        var isbn13Value = bookElement["isbn13"][0];
        if (isNaN(isbnValue)) {
          isbnValue = null;
        }
        if (isNaN(isbn13Value)) {
          isbn13Value = null;
        }
        return {
          reviewID: element["id"][0],
          rating: element["rating"][0],
          dateStarted: element["started_at"][0],
          dateAdded: element["date_added"][0],
          dateUpdated: element["date_updated"][0],
          body: element["body"][0],
          book: {
            bookID: bookElement["id"][0]._,
            isbn: isbnValue,
            isbn13: isbn13Value,
            author: bookElement["authors"][0]["author"][0]["name"],
            textReviewsCount: bookElement["text_reviews_count"][0]._,
            uri: bookElement["uri"][0],
            link: bookElement["link"][0],
            title: bookElement["title"][0],
            titleWithoutSeries: bookElement["title_without_series"][0],
            imageUrl: bookElement["image_url"][0],
            smallImageUrl: bookElement["small_image_url"][0],
            largeImageUrl: bookElement["large_image_url"][0],
            description: bookElement["description"][0],
          },
        };
      });
    }
  });
  return currentlyReading;
}

async function getRecentBooks() {
  const recentOptions = {
    method: "GET",
    url: "https://www.goodreads.com/review/list",
    params: {
      v: "2",
      sort: "date_read",
      shelf: "read",
      per_page: "5",
      page: "1",
      id: process.env.GOODREADS_USER_ID,
      key: process.env.GOODREADS_API_KEY,
    },
  };
  const recentShelfListXml = await axios(recentOptions);
  let recentlyRead;

  parseString(recentShelfListXml.data, function (err, result) {
    if (err) {
      return;
    } else {
      if (
        Object.keys(result["GoodreadsResponse"]["reviews"][0]["review"] || {})
          .length === 0
      ) {
        return; // TODO: handle empty response
      }
      recentlyRead = result["GoodreadsResponse"]["reviews"][0]["review"].map(
        (element) => {
          var bookElement = element["book"][0];

          var isbnValue = bookElement["isbn"][0];
          var isbn13Value = bookElement["isbn13"][0];
          if (isNaN(isbnValue)) {
            isbnValue = null;
          }
          if (isNaN(isbn13Value)) {
            isbn13Value = null;
          }

          return {
            reviewID: element["id"][0],
            rating: element["rating"][0],
            dateStarted: element["started_at"][0],
            dateAdded: element["date_added"][0],
            dateUpdated: element["date_updated"][0],
            body: element["body"][0],
            book: {
              bookID: bookElement["id"][0]._,
              isbn: isbnValue,
              isbn13: isbn13Value,
              author: bookElement["authors"][0]["author"][0]["name"],
              textReviewsCount: bookElement["text_reviews_count"][0]._,
              uri: bookElement["uri"][0],
              link: bookElement["link"][0],
              title: bookElement["title"][0],
              titleWithoutSeries: bookElement["title_without_series"][0],
              imageUrl: bookElement["image_url"][0],
              smallImageUrl: bookElement["small_image_url"][0],
              largeImageUrl: bookElement["large_image_url"][0],
              description: bookElement["description"][0],
            },
          };
        }
      );
    }
  });
  return recentlyRead;
}

function BookCard({
  title,
  author,
  link,
  image,
  rating,
  review,
}: {
  title: string;
  author: string;
  link: string;
  image: string;
  rating: number;
  review: string;
}) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noreferrer noopener"
      className="max-w-[50%]"
    >
      <Card className="p-4 hover:bg-slate-200 mb-6 max-w-2xl">
        <CardTitle className="p-2">{title}</CardTitle>
        <CardDescription className="p-2">{author}</CardDescription>
        <CardContent>
          <div className="flex justify-between">
            <div className="flex flex-col w-xl">
              {rating && (
                <div className="flex">
                  My rating:{" "}
                  {Array.from({ length: rating }, (_, i) => (
                    <Star key={i} />
                  ))}
                </div>
              )}
              {review && <div className="pt-4 max-w-[80%]">{review}</div>}
              {!rating && !review && <div>Currently reading</div>}
            </div>
            <div className="shrink-0">
              <Image src={image} alt="Book cover" width={50} height={200} />
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

export default async function Books() {
  const currentBooks: Promise<string> = await getCurrentBooks();
  const recentBooks = await getRecentBooks();
  return (
    <div>
      <h1 className="text-2xl font-bold pb-4">Currently reading</h1>
      {currentBooks.map((review) => (
        <BookCard
          title={review.book.title}
          author={review.book.author}
          key={review.book.title}
          link={review.book.link}
          image={review.book.imageUrl}
        />
      ))}
      <h1 className="text-2xl font-bold py-4">Recently read</h1>
      {recentBooks.map((review) => (
        <BookCard
          title={review.book.title}
          author={review.book.author}
          key={review.book.title}
          link={review.book.link}
          image={review.book.imageUrl}
          rating={review.rating}
          review={review.body}
        />
      ))}
    </div>
  );
}
