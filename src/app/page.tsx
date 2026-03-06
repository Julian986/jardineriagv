export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <main className="flex flex-col items-center gap-6 text-center px-4">
        <h1 className="text-4xl font-bold text-green-900">Jardineriagv</h1>

        <div className="flex items-center gap-2 text-lg text-green-800">
          <span>Creamos espacios verdes</span>
          <span aria-hidden="true">🏠</span>
        </div>

        <button className="mt-4 rounded-full bg-green-600 px-8 py-3 text-base font-semibold text-white shadow-sm transition hover:bg-green-700">
          Ver productos
        </button>
      </main>
    </div>
  );
}
