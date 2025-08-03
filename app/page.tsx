'use client';

import { useState, useEffect } from 'react';
import { services, Service } from '../data/services';
import ServiceCard from '../components/ServiceCard';
import ServiceCardSkeleton from '../components/ServiceCardSkeleton';
import { FiArrowUp } from 'react-icons/fi';

const CLICK_STORAGE_KEY = 'service_clicks';
const CLICK_EXPIRATION_MS = 72 * 60 * 60 * 1000; // 72 hours

interface ClickData {
  [url: string]: number[]; // Array of timestamps
}

export default function Home() {
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [clicks, setClicks] = useState<ClickData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const storedClicks = localStorage.getItem(CLICK_STORAGE_KEY);
    if (storedClicks) {
      const parsedClicks: ClickData = JSON.parse(storedClicks);
      const now = Date.now();
      // Filter out expired clicks
      Object.keys(parsedClicks).forEach(url => {
        parsedClicks[url] = parsedClicks[url].filter(timestamp => now - timestamp < CLICK_EXPIRATION_MS);
      });
      setClicks(parsedClicks);
      localStorage.setItem(CLICK_STORAGE_KEY, JSON.stringify(parsedClicks));
    }
    setIsLoading(false);

    const handleScroll = () => {
      if (window.scrollY > 300) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCardClick = (url: string) => {
    const now = Date.now();
    const updatedClicks = { ...clicks };
    if (!updatedClicks[url]) {
      updatedClicks[url] = [];
    }
    updatedClicks[url].push(now);
    setClicks(updatedClicks);
    localStorage.setItem(CLICK_STORAGE_KEY, JSON.stringify(updatedClicks));
    window.open(url, '_blank');
  };

  const getClickCount = (url: string) => {
    return clicks[url]?.length || 0;
  };

  const categories = ['All', ...Array.from(new Set(services.map((s) => s.category)))];

  const filteredServices = services
    .filter((service) => {
      const searchTerm = filter.toLowerCase();
      const nameMatch = service.name.toLowerCase().includes(searchTerm);
      const descriptionMatch = service.description.toLowerCase().includes(searchTerm);
      const tagsMatch = service.tags?.some(tag => tag.toLowerCase().includes(searchTerm));
      const categoryMatch = selectedCategory === 'All' || service.category === selectedCategory;
      return (nameMatch || descriptionMatch || tagsMatch) && categoryMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'category') {
        return a.category.localeCompare(b.category);
      } else if (sortBy === 'clicks') {
        return getClickCount(b.url) - getClickCount(a.url);
      }
      return 0;
    });

  const clearFilters = () => {
    setFilter('');
    setSelectedCategory('All');
    setSortBy('name');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="bg-gray-50 dark:bg-gray-900 min-h-screen font-sans">
      <main className="container mx-auto px-4 py-12">
        <header className="text-center mb-16">
          <h1 className="text-7xl font-extrabold text-gray-900 dark:text-white leading-tight">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-teal-500">
              AI Service Directory
            </span>
          </h1>
          <p className="text-2xl text-gray-600 dark:text-gray-400 mt-6 max-w-3xl mx-auto">
            Your ultimate guide to the world of AI. Discover, filter, and sort through the best AI-powered tools and services.
          </p>
        </header>

        <div className="sticky top-4 z-20 bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-full shadow-lg p-4 mb-12 max-w-4xl mx-auto">
          <div className="flex flex-col md:flex-row justify-center items-center gap-4">
            <div className="relative w-full md:w-1/2">
              <input
                type="text"
                placeholder="Search by name, description, or tag..."
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-full px-6 py-4 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/50 transition-all duration-300 shadow-inner"
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-6 py-4 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/50 appearance-none cursor-pointer transition-all duration-300"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-4 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-transparent text-gray-900 dark:text-white focus:outline-none focus:ring-4 focus:ring-blue-500/50 appearance-none cursor-pointer transition-all duration-300"
              >
                <option value="name">Sort by Name</option>
                <option value="category">Sort by Category</option>
                <option value="clicks">Sort by Clicks (72h)</option>
              </select>
              <button 
                onClick={clearFilters}
                className="px-6 py-4 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-500 transition-all duration-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {Array.from({ length: 8 }).map((_, i) => <ServiceCardSkeleton key={i} />)}
          </div>
        ) : filteredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
            {filteredServices.map((service) => (
              <ServiceCard 
                key={service.name} 
                service={service} 
                clickCount={getClickCount(service.url)}
                onCardClick={handleCardClick}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-3xl font-bold text-gray-700 dark:text-gray-300">No services found for "{filter}".</p>
            <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">Try a different search or filter, or click the "Clear" button.</p>
          </div>
        )}
      </main>
      {showBackToTop && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 z-30"
        >
          <FiArrowUp size={24} />
        </button>
      )}
    </div>
  );
}