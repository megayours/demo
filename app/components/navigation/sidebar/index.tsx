import Image from 'next/image';
import React from 'react';
import Link from "next/link";
import AuthButton from '../../AuthButton';

const Sidebar = ({
  isOpen,
  toggle,
}: {
  isOpen: boolean;
  toggle: () => void;
}): JSX.Element => {
  return (
    <div
      className={`fixed w-full h-full overflow-hidden justify-center bg-[var(--color-surface)] grid pt-[120px] left-0 z-50 transition-all duration-300 ${isOpen ? "top-0 opacity-100" : "-top-full opacity-0"
        }`}
    >
      <button className="absolute right-0 p-5 text-white" onClick={toggle}>
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
          <line x1="18" y1="6" x2="6" y2="18"></line>
          <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
      </button>

      <ul className="text-center leading-relaxed text-xl">
        <li className="py-2">
          <Link href="/" onClick={toggle} className="nav-link">
            Home
          </Link>
        </li>
        <li className="py-2">
          <Link href="/inventory" onClick={toggle} className="nav-link">
            Inventory
          </Link>
        </li>
        <li className="py-2">
          <Link href="/create-nft" onClick={toggle} className="nav-link">
            Create NFT
          </Link>
        </li>
        <li className="py-2">
          <AuthButton />
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;