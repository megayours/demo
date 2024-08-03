import { Suspense } from 'react';
import GameContent from '../components/GameContent';

export default function Game() {
  return (
    <Suspense fallback={<div className="container mx-auto px-4 py-8 text-white">Loading...</div>}>
      <GameContent />
    </Suspense>
  );
}