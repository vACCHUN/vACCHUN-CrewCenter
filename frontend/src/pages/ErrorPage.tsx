import { Link } from "react-router-dom";

export default function error() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4 text-center">
      <h1 className="text-6xl font-extrabold text-gray-800">404</h1>
      <p className="text-xl text-gray-600 mt-4">A keresett oldal nem található.</p>
      <p className="text-sm text-gray-500 mt-2">Szeretnél visszatérni a főoldalra?</p>
      <Link to="/" className="mt-6 inline-block px-6 py-2 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300">
        Vissza a főoldalra
      </Link>
    </div>
  );
}
