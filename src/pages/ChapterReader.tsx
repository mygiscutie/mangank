import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  Menu,
  Settings,
  BookOpen,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

// Mock data - replace with actual API calls
const mockChapter = {
  id: 'ch-1',
  number: 1,
  title: 'The World\'s Weakest Hunter',
  manga: {
    id: '1',
    title: 'Solo Leveling',
    slug: 'solo-leveling'
  },
  pages: [
    '/placeholder.svg?height=800&width=600&text=Page+1',
    '/placeholder.svg?height=800&width=600&text=Page+2',
    '/placeholder.svg?height=800&width=600&text=Page+3',
    '/placeholder.svg?height=800&width=600&text=Page+4',
    '/placeholder.svg?height=800&width=600&text=Page+5',
    '/placeholder.svg?height=800&width=600&text=Page+6',
    '/placeholder.svg?height=800&width=600&text=Page+7',
    '/placeholder.svg?height=800&width=600&text=Page+8',
  ]
};

const ChapterReader = () => {
  const { slug, chapterNumber } = useParams();
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [readingMode, setReadingMode] = useState<'vertical' | 'horizontal'>('vertical');

  const totalPages = mockChapter.pages.length;
  const progress = (currentPage / totalPages) * 100;

  useEffect(() => {
    const timer = setTimeout(() => setShowControls(false), 3000);
    return () => clearTimeout(timer);
  }, [currentPage]);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    } else {
      // Go to next chapter
      const nextChapter = parseInt(chapterNumber!) + 1;
      navigate(`/manga/${slug}/chapter/${nextChapter}`);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    } else {
      // Go to previous chapter
      const prevChapter = parseInt(chapterNumber!) - 1;
      if (prevChapter > 0) {
        navigate(`/manga/${slug}/chapter/${prevChapter}`);
      }
    }
  };

  const goToPage = (pageNumber: number) => {
    setCurrentPage(Math.max(1, Math.min(totalPages, pageNumber)));
  };

  const handleKeyPress = (e: KeyboardEvent) => {
    if (e.key === 'ArrowRight' || e.key === ' ') {
      e.preventDefault();
      nextPage();
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      prevPage();
    } else if (e.key === 'Escape') {
      navigate(`/manga/${slug}`);
    }
  };

  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [currentPage, slug, chapterNumber]);

  const handleImageClick = (e: React.MouseEvent) => {
    const rect = (e.target as HTMLElement).getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const centerX = rect.width / 2;
    
    if (clickX > centerX) {
      nextPage();
    } else {
      prevPage();
    }
  };

  return (
    <div className="min-h-screen bg-black text-white relative">
      {/* Header Controls */}
      <div 
        className={`fixed top-0 left-0 right-0 z-50 bg-gradient-to-b from-black/80 to-transparent p-4 transition-opacity duration-300 ${
          showControls ? 'opacity-100' : 'opacity-0'
        }`}
        onMouseEnter={() => setShowControls(true)}
      >
        <div className="flex items-center justify-between max-w-6xl mx-auto">
          <div className="flex items-center gap-4">
            <Button 
              variant="ghost" 
              size="sm"
              asChild
              className="text-white hover:bg-white/20"
            >
              <Link to={`/manga/${slug}`}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Manga
              </Link>
            </Button>
            <div className="text-sm">
              <div className="font-semibold">{mockChapter.manga.title}</div>
              <div className="text-white/70">
                Chapter {mockChapter.number}
                {mockChapter.title && ` - ${mockChapter.title}`}
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setReadingMode(readingMode === 'vertical' ? 'horizontal' : 'vertical')}
              className="text-white hover:bg-white/20"
            >
              <BookOpen className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="fixed top-16 left-0 right-0 z-40 px-4">
        <Progress value={progress} className="h-1 bg-white/20" />
      </div>

      {/* Main Reading Area */}
      <div className="pt-20">
        {readingMode === 'vertical' ? (
          // Vertical scrolling mode
          <div className="max-w-4xl mx-auto">
            {mockChapter.pages.map((page, index) => (
              <div key={index} className="mb-2">
                <img
                  src={page}
                  alt={`Page ${index + 1}`}
                  className="w-full h-auto"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        ) : (
          // Horizontal page-by-page mode
          <div className="flex items-center justify-center min-h-screen">
            <img
              src={mockChapter.pages[currentPage - 1]}
              alt={`Page ${currentPage}`}
              className="max-h-[90vh] max-w-full object-contain cursor-pointer"
              onClick={handleImageClick}
            />
          </div>
        )}
      </div>

      {/* Bottom Controls */}
      {readingMode === 'horizontal' && (
        <div 
          className={`fixed bottom-0 left-0 right-0 z-50 bg-gradient-to-t from-black/80 to-transparent p-4 transition-opacity duration-300 ${
            showControls ? 'opacity-100' : 'opacity-0'
          }`}
          onMouseEnter={() => setShowControls(true)}
        >
          <div className="flex items-center justify-between max-w-6xl mx-auto">
            <Button 
              variant="ghost" 
              onClick={prevPage}
              disabled={currentPage === 1}
              className="text-white hover:bg-white/20"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>

            <div className="flex items-center gap-4">
              <span className="text-sm text-white/70">
                Page {currentPage} of {totalPages}
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToPage(currentPage - 5)}
                  disabled={currentPage <= 5}
                  className="text-white hover:bg-white/20"
                >
                  -5
                </Button>
                <input
                  type="number"
                  min="1"
                  max={totalPages}
                  value={currentPage}
                  onChange={(e) => goToPage(parseInt(e.target.value) || 1)}
                  className="w-16 px-2 py-1 text-center bg-white/20 border border-white/30 rounded text-white text-sm"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => goToPage(currentPage + 5)}
                  disabled={currentPage > totalPages - 5}
                  className="text-white hover:bg-white/20"
                >
                  +5
                </Button>
              </div>
            </div>

            <Button 
              variant="ghost" 
              onClick={nextPage}
              className="text-white hover:bg-white/20"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      {/* Navigation Areas for Touch/Click */}
      {readingMode === 'horizontal' && (
        <>
          {/* Left navigation area */}
          <div 
            className="fixed left-0 top-0 bottom-0 w-1/3 z-30 cursor-pointer"
            onClick={prevPage}
          />
          {/* Right navigation area */}
          <div 
            className="fixed right-0 top-0 bottom-0 w-1/3 z-30 cursor-pointer"
            onClick={nextPage}
          />
        </>
      )}
    </div>
  );
};

export default ChapterReader;