export const ScrollDown = () => {
  return (
    <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center gap-2 p-5 bg-black bg-opacity-70 rounded-lg shadow-lg">
        <svg
          className="animate-bounce w-10 h-10 text-neutral-50"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
        </svg>
      </div>
    </div>
  );
};
