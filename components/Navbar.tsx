import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-base-200 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          FocusPomo
        </Link>
      </div>
    </nav>
  );
}