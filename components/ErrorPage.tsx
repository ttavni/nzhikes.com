export default function ErrorPage() {
  return (
    <div className="grid h-screen place-items-center">
      <div className="space-x-5">
        <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-gray-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
          Error: Walk not found
        </kbd>
        <a href="/">
          <kbd className="px-2 py-1.5 text-xs font-semibold text-gray-800 bg-blue-100 border border-gray-200 rounded-lg dark:bg-gray-600 dark:text-gray-100 dark:border-gray-500">
            ← Return
          </kbd>
        </a>
      </div>
    </div>
  );
}
