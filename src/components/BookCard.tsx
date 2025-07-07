import { Card, CardContent, CardDescription, CardTitle } from '@/components/ui/card';
import type { BookInfo } from '@/src/types/book-types';
import { Star } from 'lucide-react';

export function BookCard(bookInfo: BookInfo) {
  return (
    <a
      href={bookInfo.link}
      target="_blank"
      rel="noreferrer noopener"
      className="block w-full group"
    >
      <Card className="overflow-hidden transition-all duration-200 hover:shadow-lg hover:scale-[1.02] border border-gray-200">
        <CardContent className="p-0">
          <div className="flex flex-col sm:flex-row">
            <div className="shrink-0 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4 sm:p-6">
              <img
                src={bookInfo.imageURL}
                alt={`Cover of ${bookInfo.title}`}
                width={120}
                height={180}
                className="object-contain shadow-md rounded-sm max-w-[120px] max-h-[180px]"
              />
            </div>
            
            <div className="flex-1 p-4 sm:p-6">
              <CardTitle className="text-xl md:text-2xl font-bold mb-2 break-words group-hover:text-blue-600 transition-colors">
                {bookInfo.title}
              </CardTitle>
              <CardDescription className="text-base md:text-lg font-medium text-gray-600 mb-4">
                by {bookInfo.author}
              </CardDescription>
              
              {bookInfo.rating && bookInfo.rating != 0 && (
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-sm font-medium text-gray-700">My rating:</span>
                  <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star 
                        key={i} 
                        className={`h-4 w-4 ${
                          i < bookInfo.rating! 
                            ? 'text-yellow-400 fill-yellow-400' 
                            : 'text-gray-300'
                        }`} 
                      />
                    ))}
                  </div>
                </div>
              )}
              
              {bookInfo.review && bookInfo.review.length > 0 && bookInfo.review.trim() !== '' && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">My review:</p>
                  <p className="text-sm text-gray-600 leading-relaxed line-clamp-3">
                    {bookInfo.review}
                  </p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}