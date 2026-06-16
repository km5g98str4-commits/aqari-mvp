export default function Loading() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 text-center">
      <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-indigo-600" />
      <p className="mt-4 text-sm text-gray-500">جاري التحميل...</p>
    </div>
  );
}
