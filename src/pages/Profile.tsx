import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Navigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/layout/Navbar';
import MangaCard from '@/components/manga/MangaCard';
import { 
  User, 
  Camera, 
  Heart, 
  Bookmark, 
  Clock, 
  TrendingUp,
  Book,
  MessageCircle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data
const mockProfile = {
  username: 'mangareader123',
  displayName: 'Manga Reader',
  bio: 'Passionate about manhwa and webtoons. Always looking for the next great story to read!',
  avatarUrl: '',
  joinDate: '2023-06-15',
  totalRead: 156,
  totalComments: 89,
  favoriteGenres: ['Action', 'Fantasy', 'Romance', 'Adventure']
};

const mockStats = {
  chaptersRead: 2847,
  favoriteManga: 45,
  bookmarkedManga: 23,
  commentsPosted: 89
};

const mockFavorites = [
  {
    id: '1',
    title: 'Solo Leveling',
    slug: 'solo-leveling',
    coverImage: '/placeholder.svg',
    rating: 4.9,
    status: 'completed' as const,
    latestChapter: 179
  },
  {
    id: '2',
    title: 'Tower of God',
    slug: 'tower-of-god',
    coverImage: '/placeholder.svg',
    rating: 4.8,
    status: 'ongoing' as const,
    latestChapter: 591
  }
];

const mockBookmarks = [...mockFavorites];
const mockReadingHistory = [
  {
    id: '1',
    manga: mockFavorites[0],
    lastReadChapter: 179,
    lastReadDate: '2024-01-15T10:30:00Z',
    progress: 100
  },
  {
    id: '2',
    manga: mockFavorites[1],
    lastReadChapter: 590,
    lastReadDate: '2024-01-14T15:45:00Z',
    progress: 85
  }
];

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(mockProfile);

  if (!user) {
    return <Navigate to="/auth" replace />;
  }

  const handleSave = () => {
    // In real app, save to database
    toast({
      title: "Profile updated!",
      description: "Your profile has been successfully updated."
    });
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Profile Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <Card className="manga-card">
              <CardContent className="p-6 text-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24 mx-auto">
                    <AvatarImage src={formData.avatarUrl} alt={formData.displayName} />
                    <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                      {formData.displayName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    size="sm"
                    variant="secondary"
                    className="absolute bottom-0 right-1/2 translate-x-1/2 translate-y-1/2 h-8 w-8 rounded-full p-0"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                </div>
                
                {isEditing ? (
                  <div className="space-y-3">
                    <div>
                      <Label htmlFor="displayName">Display Name</Label>
                      <Input
                        id="displayName"
                        value={formData.displayName}
                        onChange={(e) => handleInputChange('displayName', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="username">Username</Label>
                      <Input
                        id="username"
                        value={formData.username}
                        onChange={(e) => handleInputChange('username', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea
                        id="bio"
                        value={formData.bio}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        className="min-h-20"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleSave} className="manga-gradient flex-1">
                        Save
                      </Button>
                      <Button 
                        onClick={() => {
                          setIsEditing(false);
                          setFormData(mockProfile);
                        }} 
                        variant="outline"
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div>
                      <h2 className="text-xl font-bold">{formData.displayName}</h2>
                      <p className="text-muted-foreground">@{formData.username}</p>
                    </div>
                    <p className="text-sm text-muted-foreground">{formData.bio}</p>
                    <div className="text-sm text-muted-foreground">
                      Joined {new Date(mockProfile.joinDate).toLocaleDateString()}
                    </div>
                    <Button onClick={() => setIsEditing(true)} variant="outline" className="w-full">
                      <User className="h-4 w-4 mr-2" />
                      Edit Profile
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Stats Card */}
            <Card className="manga-card">
              <CardHeader>
                <CardTitle className="text-lg">Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Book className="h-4 w-4 text-primary" />
                    <span className="text-sm">Chapters Read</span>
                  </div>
                  <span className="font-semibold">{mockStats.chaptersRead}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Heart className="h-4 w-4 text-red-500" />
                    <span className="text-sm">Favorites</span>
                  </div>
                  <span className="font-semibold">{mockStats.favoriteManga}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Bookmark className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Bookmarks</span>
                  </div>
                  <span className="font-semibold">{mockStats.bookmarkedManga}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageCircle className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Comments</span>
                  </div>
                  <span className="font-semibold">{mockStats.commentsPosted}</span>
                </div>
              </CardContent>
            </Card>

            {/* Favorite Genres */}
            <Card className="manga-card">
              <CardHeader>
                <CardTitle className="text-lg">Favorite Genres</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {mockProfile.favoriteGenres.map((genre) => (
                    <Badge key={genre} variant="secondary">
                      {genre}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <Tabs defaultValue="favorites" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="favorites" className="flex items-center gap-2">
                  <Heart className="h-4 w-4" />
                  Favorites
                </TabsTrigger>
                <TabsTrigger value="bookmarks" className="flex items-center gap-2">
                  <Bookmark className="h-4 w-4" />
                  Bookmarks
                </TabsTrigger>
                <TabsTrigger value="history" className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Reading History
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="favorites" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Your Favorite Manga</h3>
                    <span className="text-sm text-muted-foreground">{mockFavorites.length} manga</span>
                  </div>
                  
                  {mockFavorites.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockFavorites.map((manga) => (
                        <MangaCard key={manga.id} {...manga} isFavorited={true} />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No favorites yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Start exploring and add manga to your favorites!
                      </p>
                      <Button className="manga-gradient">Browse Manga</Button>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="bookmarks" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Your Bookmarked Manga</h3>
                    <span className="text-sm text-muted-foreground">{mockBookmarks.length} manga</span>
                  </div>
                  
                  {mockBookmarks.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {mockBookmarks.map((manga) => (
                        <MangaCard key={manga.id} {...manga} isBookmarked={true} />
                      ))}
                    </div>
                  ) : (
                    <Card className="p-12 text-center">
                      <Bookmark className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-semibold mb-2">No bookmarks yet</h3>
                      <p className="text-muted-foreground mb-4">
                        Bookmark manga to read them later!
                      </p>
                      <Button className="manga-gradient">Browse Manga</Button>
                    </Card>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="history" className="mt-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-xl font-semibold">Reading History</h3>
                    <span className="text-sm text-muted-foreground">{mockReadingHistory.length} manga</span>
                  </div>
                  
                  <div className="space-y-4">
                    {mockReadingHistory.map((item) => (
                      <Card key={item.id} className="manga-card">
                        <CardContent className="p-4">
                          <div className="flex items-center gap-4">
                            <img
                              src={item.manga.coverImage}
                              alt={item.manga.title}
                              className="w-16 h-20 object-cover rounded"
                            />
                            <div className="flex-1 space-y-2">
                              <h4 className="font-semibold">{item.manga.title}</h4>
                              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <span>Chapter {item.lastReadChapter}</span>
                                <span>{item.progress}% complete</span>
                                <span>{new Date(item.lastReadDate).toLocaleDateString()}</span>
                              </div>
                              <div className="w-full bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${item.progress}%` }}
                                />
                              </div>
                            </div>
                            <Button variant="outline" size="sm">
                              Continue Reading
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;