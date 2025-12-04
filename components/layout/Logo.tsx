import Link from 'next/link';

export default function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 px-4 py-6 hover:opacity-80 transition-opacity">
      <div className="relative">
        {/* Swimming wave icon */}
        <svg
          width="40"
          height="40"
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="text-pink-500"
        >
          {/* Swimmer silhouette */}
          <path
            d="M20 8C21.66 8 23 6.66 23 5C23 3.34 21.66 2 20 2C18.34 2 17 3.34 17 5C17 6.66 18.34 8 20 8Z"
            fill="currentColor"
          />
          <path
            d="M28 18C28 18 26 16 24 16C22 16 20 18 20 18C20 18 18 16 16 16C14 16 12 18 12 18L10 20C10 20 12 22 14 22C16 22 18 20 18 20C18 20 20 22 22 22C24 22 26 20 26 20L28 18Z"
            fill="currentColor"
          />
          {/* Water waves */}
          <path
            d="M4 28C4 28 6 26 8 26C10 26 12 28 12 28C12 28 14 26 16 26C18 26 20 28 20 28C20 28 22 26 24 26C26 26 28 28 28 28C28 28 30 26 32 26C34 26 36 28 36 28"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M4 34C4 34 6 32 8 32C10 32 12 34 12 34C12 34 14 32 16 32C18 32 20 34 20 34C20 34 22 32 24 32C26 32 28 34 28 34C28 34 30 32 32 32C34 32 36 34 36 34"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div>
        <h1 className="text-xl font-bold text-pink-700">SwimTrack</h1>
        <p className="text-xs text-pink-500">Performans Takip</p>
      </div>
    </Link>
  );
}
