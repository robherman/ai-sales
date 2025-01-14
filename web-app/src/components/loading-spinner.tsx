export default function LoadingSpinner() {
  return (
    <div className="flex h-full items-center justify-center">
      <div className="h-32 w-32 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
    </div>
  );
}
