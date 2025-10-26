
const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-gray-100 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75 flex items-center justify-center z-50">
      <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-primary-red"></div>
    </div>
  );
};

export default LoadingSpinner;
