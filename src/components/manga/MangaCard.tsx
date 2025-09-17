import React from 'react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, Bookmark, Eye, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface MangaCardProps {
  id: string;
  title: string;
  slug: string;
  coverImage?: string;
  description?: string;
  author?: string;
  status?: string;
  rating?: number;
  viewCount?: number;
  genres?: string[];
  isBookmarked?: boolean;
  isFavorited?: boolean;
  latestChapter?: number;
}

const MangaCard: React.FC<MangaCardProps> = ({
  id,
  title,
  slug,
  coverImage,
  description,
  author,
  status,
  rating,
  viewCount,
  genres,
  isBookmarked,
  isFavorited,
  latestChapter
}) => {
  const { user } = useAuth();

  const statusColors = {
    ongoing: 'bg-green-500',
    completed: 'bg-blue-500',
    hiatus: 'bg-yellow-500',
    cancelled: 'bg-red-500'
  };

  return (
    <div className="manga-card group">
      <div className="relative aspect-[3/4] overflow-hidden">
        <img
          src={coverImage || '/placeholder.svg'}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        
        {/* Overlay with quick actions */}
        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-2">
          {user && (
            <>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <Heart className={`h-4 w-4 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`} />
              </Button>
              <Button size="sm" variant="secondary" className="h-8 w-8 p-0">
                <Bookmark className={`h-4 w-4 ${isBookmarked ? 'fill-blue-500 text-blue-500' : ''}`} />
              </Button>
            </>
          )}
          <Button asChild size="sm" className="manga-gradient">
            <Link to={`/manga/${slug}`}>
              Read Now
            </Link>
          </Button>
        </div>

        {/* Status badge */}
        {status && (
          <div className="absolute top-2 left-2">
            <Badge 
              variant="secondary" 
              className={`${statusColors[status as keyof typeof statusColors]} text-white border-0`}
            >
              {status}
            </Badge>
          </div>
        )}

        {/* Latest chapter badge */}
        {latestChapter && (
          <div className="absolute top-2 right-2">
            <Badge variant="secondary" className="bg-black/80 text-white border-0">
              Ch. {latestChapter}
            </Badge>
          </div>
        )}
      </div>

      <div className="p-4">
        <Link to={`/manga/${slug}`}>
          <h3 className="font-semibold text-lg mb-2 line-clamp-2 hover:text-primary transition-colors">
            {title}
          </h3>
        </Link>
        
        {author && (
          <p className="text-sm text-muted-foreground mb-2">by {author}</p>
        )}

        {description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {description}
          </p>
        )}

        {/* Genres */}
        {genres && genres.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {genres.slice(0, 3).map((genre) => (
              <Badge key={genre} variant="outline" className="text-xs">
                {genre}
              </Badge>
            ))}
            {genres.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{genres.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center gap-4">
            {rating && (
              <div className="flex items-center gap-1">
                <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                <span>{rating.toFixed(1)}</span>
              </div>
            )}
            {viewCount && (
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{viewCount.toLocaleString()}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaCard;