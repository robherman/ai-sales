export default function Loading() {
  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-base-100 bg-opacity-50">
      <div className="text-center">
        <span className="loading loading-spinner loading-lg text-primary"></span>
        <p className="mt-4 text-lg font-semibold text-base-content">
          Loading...
        </p>
      </div>
    </div>
  );
}
