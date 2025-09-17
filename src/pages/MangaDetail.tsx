import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Navbar from '@/components/layout/Navbar';
import { 
  Heart, 
  Bookmark, 
  Eye, 
  Star, 
  Share, 
  Calendar,
  ChevronRight,
  MessageCircle,
  ThumbsUp,
  Play
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data - in real app this would come from API/database
const mockManga = {
  id: '1',
  title: 'Solo Leveling',
  slug: 'solo-leveling',
  coverImage: '/placeholder.svg',
  description: 'In a world where hunters battle deadly monsters that emerge from gates connecting our world to other dimensions, Sung Jin-Woo is known as the weakest E-rank hunter. Despite his low rank, he continues to hunt monsters to pay for his mother\'s medical bills. During a seemingly routine dungeon raid, Jin-Woo and his party discover a hidden dungeon. When they enter, they find themselves trapped in a deadly situation. Most of the party is killed, but Jin-Woo awakens to find that he has been chosen by a mysterious system that grants him the power to level up his abilities, strength, and skills.',
  author: 'Chugong',
  artist: 'DUBU (REDICE STUDIO)',
  status: 'completed' as const,
  rating: 4.9,
  viewCount: 5200000,
  genres: ['Action', 'Adventure', 'Fantasy', 'Supernatural', 'Webtoon'],
  tags: ['Leveling', 'Monsters', 'Powers', 'Strong MC'],
  publishedAt: '2018-07-25',
  updatedAt: '2021-12-29',
  totalChapters: 179,
  isBookmarked: false,
  isFavorited: true
};

const mockChapters = Array.from({ length: 179 }, (_, i) => ({
  id: `ch-${i + 1}`,
  number: i + 1,
  title: i === 0 ? 'The World\'s Weakest Hunter' : 
         i === 1 ? 'The Double Dungeon' :
         i === 178 ? 'The End of a Long Journey' : 
         `Chapter ${i + 1}`,
  publishedAt: new Date(Date.now() - (178 - i) * 24 * 60 * 60 * 1000).toISOString(),
  readProgress: Math.random() > 0.7 ? Math.floor(Math.random() * 100) : 0
})).reverse();

const mockComments = [
  {
    id: '1',
    user: { name: 'MangaLover123', avatar: '' },
    content: 'This is absolutely one of the best manhwa ever created! The art style is incredible and the story keeps getting better.',
    createdAt: '2024-01-15T10:30:00Z',
    likes: 142,
    isLiked: false,
    replies: [
      {
        id: '1-1',
        user: { name: 'WebtoonFan', avatar: '' },
        content: 'Totally agree! The character development is amazing.',
        createdAt: '2024-01-15T11:15:00Z',
        likes: 23,
        isLiked: true
      }
    ]
  },
  {
    id: '2',
    user: { name: 'ArtCritic', avatar: '' },
    content: 'The art quality in the later chapters is just phenomenal. DUBU really outdid themselves.',
    createdAt: '2024-01-14T15:45:00Z',
    likes: 87,
    isLiked: false,
    replies: []
  }
];

const MangaDetail = () => {
  const { slug } = useParams();
  const { user } = useAuth();
  const [isBookmarked, setIsBookmarked] = useState(mockManga.isBookmarked);
  const [isFavorited, setIsFavorited] = useState(mockManga.isFavorited);
  const [newComment, setNewComment] = useState('');

  const handleBookmark = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to bookmark manga",
        variant: "destructive"
      });
      return;
    }
    setIsBookmarked(!isBookmarked);
    toast({
      title: isBookmarked ? "Removed from bookmarks" : "Added to bookmarks",
      description: `${mockManga.title} ${isBookmarked ? 'removed from' : 'added to'} your bookmarks`
    });
  };

  const handleFavorite = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to favorite manga",
        variant: "destructive"
      });
      return;
    }
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from favorites" : "Added to favorites",
      description: `${mockManga.title} ${isFavorited ? 'removed from' : 'added to'} your favorites`
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied!",
      description: "Manga link has been copied to clipboard"
    });
  };

  const handleCommentSubmit = () => {
    if (!user) {
      toast({
        title: "Please sign in",
        description: "You need to be signed in to comment",
        variant: "destructive"
      });
      return;
    }
    if (newComment.trim()) {
      toast({
        title: "Comment posted!",
        description: "Your comment has been added"
      });
      setNewComment('');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link to="/" className="hover:text-primary">Home</Link>
          <ChevronRight className="h-4 w-4" />
          <Link to="/library" className="hover:text-primary">Library</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-foreground">{mockManga.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cover and Actions */}
          <div className="lg:col-span-1">
            <div className="manga-card">
              <div className="aspect-[3/4] overflow-hidden">
                <img
                  src={mockManga.coverImage}
                  alt={mockManga.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex gap-2">
                  <Button
                    onClick={handleFavorite}
                    variant={isFavorited ? "default" : "outline"}
                    className={isFavorited ? "manga-gradient" : ""}
                    size="sm"
                  >
                    <Heart className={`h-4 w-4 mr-2 ${isFavorited ? 'fill-current' : ''}`} />
                    {isFavorited ? 'Favorited' : 'Favorite'}
                  </Button>
                  <Button
                    onClick={handleBookmark}
                    variant={isBookmarked ? "default" : "outline"}
                    size="sm"
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${isBookmarked ? 'fill-current' : ''}`} />
                    {isBookmarked ? 'Saved' : 'Save'}
                  </Button>
                </div>
                <Button onClick={handleShare} variant="outline" className="w-full">
                  <Share className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button asChild className="w-full manga-gradient">
                  <Link to={`/manga/${slug}/chapter/1`}>
                    <Play className="h-4 w-4 mr-2" />
                    Start Reading
                  </Link>
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title and Meta */}
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">{mockManga.title}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-4">
                <span>by {mockManga.author}</span>
                {mockManga.artist && <span>Art by {mockManga.artist}</span>}
                <div className="flex items-center gap-1">
                  <Eye className="h-4 w-4" />
                  <span>{mockManga.viewCount.toLocaleString()} views</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                  <span>{mockManga.rating}/5</span>
                </div>
              </div>

              {/* Status and Info */}
              <div className="flex flex-wrap items-center gap-2 mb-4">
                <Badge 
                  variant="secondary"
                  className={mockManga.status === 'ongoing' ? 'bg-green-500' : 'bg-blue-500'}
                >
                  {mockManga.status}
                </Badge>
                <Badge variant="outline">{mockManga.totalChapters} chapters</Badge>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Updated {new Date(mockManga.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>

              {/* Genres */}
              <div className="flex flex-wrap gap-2 mb-6">
                {mockManga.genres.map((genre) => (
                  <Badge key={genre} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                    {genre}
                  </Badge>
                ))}
              </div>

              {/* Description */}
              <div className="prose prose-sm max-w-none text-muted-foreground">
                <p>{mockManga.description}</p>
              </div>
            </div>

            {/* Tabs */}
            <Tabs defaultValue="chapters" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="chapters">Chapters</TabsTrigger>
                <TabsTrigger value="comments">Comments ({mockComments.length + mockComments.reduce((acc, c) => acc + c.replies.length, 0)})</TabsTrigger>
              </TabsList>
              
              <TabsContent value="chapters" className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">All Chapters</h3>
                  <span className="text-sm text-muted-foreground">{mockChapters.length} chapters</span>
                </div>
                
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {mockChapters.map((chapter) => (
                    <Link
                      key={chapter.id}
                      to={`/manga/${slug}/chapter/${chapter.number}`}
                      className="chapter-item flex items-center justify-between group"
                    >
                      <div className="flex-1">
                        <div className="font-medium group-hover:text-primary">
                          Chapter {chapter.number}
                          {chapter.title && ` - ${chapter.title}`}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {new Date(chapter.publishedAt).toLocaleDateString()}
                        </div>
                      </div>
                      {chapter.readProgress > 0 && (
                        <div className="text-sm text-primary">
                          {chapter.readProgress}% read
                        </div>
                      )}
                      <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />
                    </Link>
                  ))}
                </div>
              </TabsContent>
              
              <TabsContent value="comments" className="space-y-6">
                {/* Comment Form */}
                {user && (
                  <Card>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex items-start gap-3">
                        <Avatar className="h-8 w-8">
                          <AvatarImage src="" alt={user.email} />
                          <AvatarFallback>{user.email?.charAt(0).toUpperCase()}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 space-y-3">
                          <Textarea
                            placeholder="Share your thoughts about this manga..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-20"
                          />
                          <div className="flex justify-end">
                            <Button onClick={handleCommentSubmit} className="manga-gradient">
                              <MessageCircle className="h-4 w-4 mr-2" />
                              Post Comment
                            </Button>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Comments List */}
                <div className="space-y-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="space-y-3">
                      <div className="comment-item">
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={comment.user.avatar} alt={comment.user.name} />
                            <AvatarFallback>{comment.user.name.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="font-medium">{comment.user.name}</span>
                              <span className="text-sm text-muted-foreground">
                                {new Date(comment.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <p className="text-sm mb-3">{comment.content}</p>
                            <div className="flex items-center gap-4">
                              <Button variant="ghost" size="sm" className="h-auto p-0">
                                <ThumbsUp className={`h-4 w-4 mr-1 ${comment.isLiked ? 'fill-current text-primary' : ''}`} />
                                {comment.likes}
                              </Button>
                              <Button variant="ghost" size="sm" className="h-auto p-0">
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Replies */}
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="ml-12 comment-item">
                          <div className="flex items-start gap-3">
                            <Avatar className="h-6 w-6">
                              <AvatarImage src={reply.user.avatar} alt={reply.user.name} />
                              <AvatarFallback className="text-xs">{reply.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="font-medium text-sm">{reply.user.name}</span>
                                <span className="text-xs text-muted-foreground">
                                  {new Date(reply.createdAt).toLocaleDateString()}
                                </span>
                              </div>
                              <p className="text-sm mb-2">{reply.content}</p>
                              <Button variant="ghost" size="sm" className="h-auto p-0">
                                <ThumbsUp className={`h-3 w-3 mr-1 ${reply.isLiked ? 'fill-current text-primary' : ''}`} />
                                {reply.likes}
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MangaDetail;