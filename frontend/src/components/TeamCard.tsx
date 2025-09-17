'use client';

import { Team } from '@/models/api.models';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface TeamCardProps {
  team: Team;
}

export default function TeamCard({ team }: TeamCardProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/dashboard/teams/${team.id}`);
  };

  return (
    <div
      onClick={handleClick}
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer transform hover:scale-105 border border-gray-200"
    >
      <div className="p-6">
        {/* Logo do time */}
        <div className="flex justify-center mb-4">
          <div className="relative w-16 h-16">
            {team.crest ? (
              <>
                <Image
                  src={team.crest}
                  alt={`${team.name} logo`}
                  fill
                  className="object-contain"
                  sizes="64px"
                  loading="lazy"
                />
              </>
            ) : (
              /* Fallback quando não há logo */
              <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">
                  Logo não
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Nome do time */}
        <div className="text-center">
          <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-2">
            {team.name}
          </h3>
          {team.short_name && team.short_name !== team.name && (
            <p className="text-sm text-gray-600 mb-2">
              {team.short_name}
            </p>
          )}
          {team.tla && (
            <span className="inline-block bg-secondary-100 text-secondary-800 text-xs font-semibold px-2 py-1 rounded-full">
              {team.tla}
            </span>
          )}
        </div>

        {/* Indicador de click */}
        <div className="mt-4 flex justify-center">
          <div className="flex items-center text-secondary-600 text-sm font-medium">
            <span>Ver detalhes</span>
            <svg
              className="ml-1 w-4 h-4 transform group-hover:translate-x-1 transition-transform"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}
