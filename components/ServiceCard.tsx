import { Service } from '../data/services';
import { FiEye } from 'react-icons/fi';

interface ServiceCardProps {
  service: Service;
  clickCount: number;
  onCardClick: (url: string) => void;
}

export default function ServiceCard({ service, clickCount, onCardClick }: ServiceCardProps) {
  return (
    <div 
      onClick={() => onCardClick(service.url)}
      className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out p-6 flex flex-col h-full overflow-hidden cursor-pointer group"
    >
      <div className="absolute inset-0 flex items-center justify-center text-8xl opacity-5 group-hover:opacity-10 transition-opacity duration-300">
        {service.emoji}
      </div>
      <div className="flex-grow z-10">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{service.name}</h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4 text-base leading-relaxed">{service.description}</p>
      </div>
      <div className="mt-auto z-10">
        <div className="flex flex-wrap gap-2 mb-4">
          {service.tags?.map((tag) => (
            <span key={tag} className="inline-block bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-semibold px-2 py-1 rounded-full">
              #{tag}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-between mb-4">
          <span className="inline-block bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300 text-xs font-semibold mr-2 px-3 py-1 rounded-full">
            {service.category}
          </span>
          <div className="flex items-center text-gray-500 dark:text-gray-400">
            <FiEye className="mr-1.5" />
            <span className="text-xs font-medium">{clickCount}</span>
          </div>
        </div>
        <div
          className="w-full text-center inline-block bg-gradient-to-r from-blue-500 to-teal-400 hover:from-blue-600 hover:to-teal-500 text-white font-bold py-3 px-6 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
        >
          Visit Site
        </div>
      </div>
    </div>
  );
}