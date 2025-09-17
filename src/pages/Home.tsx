import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MangaCard from '@/components/manga/MangaCard';
import Navbar from '@/components/layout/Navbar';
import { 
  BookOpen, 
  TrendingUp, 
  Clock, 
  Star,
  Users,
  Library
} from 'lucide-react';

// Mock data for demonstration
const featuredManga = [
  {
    id: '1',
    title: 'Tower of God',
    slug: 'tower-of-god',
    coverImage: '/placeholder.svg',
    description: 'Reach the top, and everything will be yours. At the top of the tower exists everything in this world, and all of it can be yours.',
    author: 'SIU',
    status: 'ongoing' as const,
    rating: 4.8,
    viewCount: 2500000,
    genres: ['Action', 'Adventure', 'Drama', 'Fantasy'],
    latestChapter: 591
  },
  {
    id: '2',
    title: 'Solo Leveling',
    slug: 'solo-leveling',
    coverImage: '/placeholder.svg',
    description: 'In a world where hunters battle monsters, Sung Jin-Woo is the weakest of the weak, but a mysterious system will change everything.',
    author: 'Chugong',
    status: 'completed' as const,
    rating: 4.9,
    viewCount: 5200000,
    genres: ['Action', 'Adventure', 'Fantasy'],
    latestChapter: 179
  },
  {
    id: '3',
    title: 'The Beginning After The End',
    slug: 'the-beginning-after-the-end',
    coverImage: '/placeholder.svg',
    description: 'King Grey has unrivaled strength, wealth, and prestige in a world governed by martial ability, but solitude lingers closely behind those with great power.',
    author: 'TurtleMe',
    status: 'ongoing' as const,
    rating: 4.7,
    viewCount: 1800000,
    genres: ['Action', 'Adventure', 'Fantasy', 'Magic'],
    latestChapter: 165
  }
];

const trendingManga = featuredManga.slice(0, 6);
const latestManga = [...featuredManga].reverse();

const Home = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Welcome to{' '}
              <span className="text-gradient">MangaNK</span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover and read thousands of manhwa, manga, and webtoons from your favorite sources. 
              Join our community of readers and never miss an update!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="manga-gradient">
                <Link to="/library">
                  <Library className="mr-2 h-5 w-5" />
                  Browse Library
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/trending">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  View Trending
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 px-4 bg-card/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="text-center glass-effect">
              <CardContent className="p-6">
                <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">10,000+</h3>
                <p className="text-muted-foreground">Manga & Manhwa</p>
              </CardContent>
            </Card>
            <Card className="text-center glass-effect">
              <CardContent className="p-6">
                <Users className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">500K+</h3>
                <p className="text-muted-foreground">Active Readers</p>
              </CardContent>
            </Card>
            <Card className="text-center glass-effect">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">Daily</h3>
                <p className="text-muted-foreground">New Updates</p>
              </CardContent>
            </Card>
            <Card className="text-center glass-effect">
              <CardContent className="p-6">
                <Star className="h-12 w-12 mx-auto mb-4 text-primary" />
                <h3 className="text-2xl font-bold mb-2">4.8/5</h3>
                <p className="text-muted-foreground">User Rating</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Featured Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Featured Manga</h2>
            <Button asChild variant="outline">
              <Link to="/library">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredManga.map((manga) => (
              <MangaCard key={manga.id} {...manga} />
            ))}
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-16 px-4 bg-card/20">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <TrendingUp className="h-8 w-8 text-primary" />
              Trending Now
            </h2>
            <Button asChild variant="outline">
              <Link to="/trending">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {trendingManga.map((manga) => (
              <MangaCard key={manga.id} {...manga} />
            ))}
          </div>
        </div>
      </section>

      {/* Latest Updates Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold flex items-center gap-2">
              <Clock className="h-8 w-8 text-primary" />
              Latest Updates
            </h2>
            <Button asChild variant="outline">
              <Link to="/latest">View All</Link>
            </Button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestManga.map((manga) => (
              <MangaCard key={manga.id} {...manga} />
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border/40 py-12 px-4">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gradient mb-4">
                <BookOpen className="h-6 w-6 text-primary" />
                MangaNK
              </Link>
              <p className="text-muted-foreground">
                Your ultimate destination for manhwa, manga, and webtoons.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Browse</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/library" className="hover:text-primary">All Manga</Link></li>
                <li><Link to="/trending" className="hover:text-primary">Trending</Link></li>
                <li><Link to="/latest" className="hover:text-primary">Latest</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Genres</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/genre/action" className="hover:text-primary">Action</Link></li>
                <li><Link to="/genre/romance" className="hover:text-primary">Romance</Link></li>
                <li><Link to="/genre/fantasy" className="hover:text-primary">Fantasy</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Community</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link to="/auth" className="hover:text-primary">Sign Up</Link></li>
                <li><Link to="/profile" className="hover:text-primary">Profile</Link></li>
                <li><Link to="/favorites" className="hover:text-primary">Favorites</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border/40 mt-8 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 MangaNK. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;