import Link from "next/link";
import AuthButton from "../../AuthButton";

const Navbar = ({ toggle }: { toggle: () => void }) => {
  return (
    <nav className="w-full h-20 bg-[var(--color-surface)] sticky top-0 z-50 shadow-lg">
      <div className="container mx-auto px-4 h-full">
        <div className="flex justify-between items-center h-full">
          <Link href="/" className="flex items-center">
            <span className="text-2xl font-bold rainbow-text">Mega Yours</span>
          </Link>
          <button
            type="button"
            className="inline-flex items-center md:hidden text-white"
            onClick={toggle}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <ul className="hidden md:flex gap-x-6 text-white">
            <li>
              <Link href="/" className="nav-link">
                Home
              </Link>
            </li>
            <li>
              <Link href="/inventory" className="nav-link">
                Inventory
              </Link>
            </li>
            <li>
              <Link href="/create-nft" className="nav-link">
                Create
              </Link>
            </li>
          </ul>
          <div className="hidden md:block">
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;