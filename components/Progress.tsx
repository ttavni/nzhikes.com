export const ProgressBar = ({ progress }: { progress: number }) => {
  return (
    <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2 flex justify-center items-center h-8 z-50 w-40">
      <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
        <div
          className="bg-blue-600 h-2.5 rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};
