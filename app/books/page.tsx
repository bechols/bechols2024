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

async function getCurrentBooks(): Promise<BookInfo[]> {
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
  let currentlyReading: BookInfo[] = [];

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
        // @ts-expect-error
      ].map((element) => {
        return {
          author: element["book"][0]["authors"][0]["author"][0]["name"],
          link: element["book"][0]["link"][0],
          title: element["book"][0]["title"][0],
          imageUrl: element["book"][0]["image_url"][0],
        };
      });
    }
  });
  return currentlyReading;
}

async function getRecentBooks(): Promise<BookInfo[]> {
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
  let recentlyRead: BookInfo[] = [];

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
        // @ts-expect-error
        (element) => {
          return {
            rating: element["rating"][0],
            review: element["body"][0],
            author: element["book"][0]["authors"][0]["author"][0]["name"],
            link: element["book"][0]["link"][0],
            title: element["book"][0]["title"][0],
            imageUrl: element["book"][0]["image_url"][0],
          };
        }
      );
    }
  });
  return recentlyRead;
}

type BookInfo = {
  title: string;
  author: string;
  link: string;
  imageURL: string;
  rating?: number | undefined;
  review?: string | undefined;
};

function BookCard(bookInfo: BookInfo) {
  return (
    <a
      href={bookInfo.link}
      target="_blank"
      rel="noreferrer noopener"
      className="max-w-[50%]"
    >
      <Card className="p-4 hover:bg-slate-200 mb-6 max-w-2xl">
        <CardTitle className="p-2">{bookInfo.title}</CardTitle>
        <CardDescription className="p-2">{bookInfo.author}</CardDescription>
        <CardContent>
          <div className="flex justify-between">
            <div className="flex flex-col w-xl">
              {bookInfo.rating && (
                <div className="flex">
                  My rating:{" "}
                  {Array.from({ length: bookInfo.rating }, (_, i) => (
                    <Star key={i} />
                  ))}
                </div>
              )}
              {bookInfo.review && (
                <div className="pt-4 max-w-[80%]">{bookInfo.review}</div>
              )}
              {!bookInfo.rating && !bookInfo.review && (
                <div>Currently reading</div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

export default async function Books() {
  const currentBooks = await getCurrentBooks();
  const recentBooks = await getRecentBooks();
  return (
    <div>
      <h1 className="text-2xl font-bold pb-4">Currently reading</h1>
      {currentBooks.map((bookInfo) => (
        <BookCard
          title={bookInfo.title}
          author={bookInfo.author}
          key={bookInfo.title}
          link={bookInfo.link}
          imageURL={bookInfo.imageURL}
        />
      ))}
      {currentBooks.length === 0 && (
        <div>{`Either the Goodreads API finally quit working, or I'm not reading anything right now.`}</div>
      )}

      {recentBooks.length > 0 && (
        <h1 className="text-2xl font-bold py-4">Recently read</h1>
      )}

      {recentBooks.map((bookInfo) => (
        <BookCard
          title={bookInfo.title}
          author={bookInfo.author}
          key={bookInfo.title}
          link={bookInfo.link}
          imageURL={bookInfo.imageURL}
          rating={bookInfo.rating}
          review={bookInfo.review}
        />
      ))}
    </div>
  );
}
