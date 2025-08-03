export default function ServiceCardSkeleton() {
  return (
    <div className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 flex flex-col h-full overflow-hidden animate-pulse">
      <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-4"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full mb-2"></div>
      <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6 mb-6"></div>
      <div className="mt-auto">
        <div className="flex items-center justify-between mb-4">
          <div className="h-6 w-24 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
          <div className="h-6 w-12 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="h-12 bg-gray-300 dark:bg-gray-600 rounded-xl"></div>
      </div>
    </div>
  );
}