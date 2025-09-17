'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import { useAuth } from '@/contexts/AuthContext';
import { teamsAPI } from '@/lib/api';
import { Match, TeamDetails } from '@/models/api.models';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

export default function TeamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { logout } = useAuth();
  const [team, setTeam] = useState<TeamDetails | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [matchesLoading, setMatchesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'info' | 'squad' | 'matches'>('info');

  const teamId = parseInt(params.id as string);

  useEffect(() => {
    if (teamId) {
      fetchTeamDetails();
    }
  }, [teamId]);

  const fetchTeamDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await teamsAPI.getTeamDetails(teamId);
      setTeam(response.data);
    } catch (err: any) {
      const errorMessage = err.response?.data?.detail || 'Erro ao carregar detalhes do time.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const fetchMatches = async () => {
    if (matchesLoading) return;
    
    try {
      setMatchesLoading(true);
      const response = await teamsAPI.getTeamMatches(teamId);
      setMatches(response.data.matches);
      const matchCount = response.data.matches.length;
      if (matchCount > 0) {
        toast.success(`${matchCount} partidas carregadas`);
      } else {
        toast.info('Nenhuma partida encontrada para este time');
      }
    } catch (err: any) {
      console.error('Erro ao buscar partidas:', err);
      setMatches([]);
      toast.error('Erro ao carregar partidas do time');
    } finally {
      setMatchesLoading(false);
    }
  };

  const handleTabChange = (tab: 'info' | 'squad' | 'matches') => {
    setActiveTab(tab);
    if (tab === 'matches' && matches.length === 0) {
      fetchMatches();
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleBackToTeams = () => {
    router.push('/dashboard/teams');
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando detalhes do time...</p>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error || !team) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
              <div className="flex items-center justify-center mb-4">
                <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-red-800 mb-2">Time não encontrado</h3>
              <p className="text-sm text-red-700 mb-4">{error}</p>
              <button
                onClick={handleBackToTeams}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Voltar aos Times
              </button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center space-x-4">
                <button
                  onClick={handleBackToTeams}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar aos Times
                </button>
                <div className="flex items-center space-x-4">
                  <div className="relative w-12 h-12">
                    {team.crest ? (
                      <>
                        <Image
                          src={team.crest}
                          alt={`${team.name} logo`}
                          fill
                          className="object-contain"
                          sizes="48px"
                          loading="lazy"
                          placeholder="blur"
                          blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAQABADASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q=="
                          onError={(e) => {
                            // Fallback em caso de erro na imagem
                            const target = e.target as HTMLImageElement;
                            const fallback = target.parentElement?.querySelector('.fallback-icon') as HTMLElement;
                            target.style.display = 'none';
                            if (fallback) {
                              fallback.style.display = 'flex';
                            }
                          }}
                        />
                        {/* Fallback icon */}
                        <div className="fallback-icon w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full items-center justify-center shadow-lg" style={{display: 'none'}}>
                          <span className="text-white font-bold text-sm">
                            ⚽
                          </span>
                        </div>
                      </>
                    ) : (
                      /* Fallback quando não há logo */
                      <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white font-bold text-sm">
                          ⚽
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">{team.name}</h1>
                    <p className="text-gray-600">{team.short_name || team.tla}</p>
                  </div>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          </div>
        </header>

        {/* Conteúdo principal */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Tabs */}
            <div className="mb-6">
              <div className="border-b border-gray-200">
                <nav className="-mb-px flex space-x-8">
                  {[
                    { id: 'info', label: 'Informações', icon: '📋' },
                    { id: 'squad', label: 'Elenco', icon: '👥' },
                    { id: 'matches', label: 'Partidas', icon: '⚽' }
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => handleTabChange(tab.id as any)}
                      className={`py-2 px-1 border-b-2 font-medium text-sm ${
                        activeTab === tab.id
                          ? 'border-blue-500 text-blue-600'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                      }`}
                    >
                      <span className="mr-2">{tab.icon}</span>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Conteúdo das tabs */}
            {activeTab === 'info' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Informações básicas */}
                <div className="bg-white shadow rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Informações do Clube</h3>
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm font-medium text-gray-500">Nome Completo</dt>
                      <dd className="text-sm text-gray-900">{team.name}</dd>
                    </div>
                    {team.short_name && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Nome Curto</dt>
                        <dd className="text-sm text-gray-900">{team.short_name}</dd>
                      </div>
                    )}
                    {team.tla && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Sigla</dt>
                        <dd className="text-sm text-gray-900">{team.tla}</dd>
                      </div>
                    )}
                    {team.area && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">País</dt>
                        <dd className="text-sm text-gray-900">{team.area.name}</dd>
                      </div>
                    )}
                    {team.founded && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Fundado em</dt>
                        <dd className="text-sm text-gray-900">{team.founded}</dd>
                      </div>
                    )}
                    {team.venue && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Estádio</dt>
                        <dd className="text-sm text-gray-900">{team.venue}</dd>
                      </div>
                    )}
                    {team.club_colors && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Cores do Clube</dt>
                        <dd className="text-sm text-gray-900">{team.club_colors}</dd>
                      </div>
                    )}
                    {team.website && (
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Website</dt>
                        <dd className="text-sm text-gray-900">
                          <a 
                            href={team.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            {team.website}
                          </a>
                        </dd>
                      </div>
                    )}
                  </dl>
                </div>

                {/* Técnico */}
                {team.coach && (
                  <div className="bg-white shadow rounded-lg p-6">
                    <h3 className="text-lg font-medium text-gray-900 mb-4">Técnico</h3>
                    <dl className="space-y-3">
                      <div>
                        <dt className="text-sm font-medium text-gray-500">Nome</dt>
                        <dd className="text-sm text-gray-900">{team.coach.name}</dd>
                      </div>
                      {team.coach.nationality && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Nacionalidade</dt>
                          <dd className="text-sm text-gray-900">{team.coach.nationality}</dd>
                        </div>
                      )}
                      {team.coach.dateOfBirth && (
                        <div>
                          <dt className="text-sm font-medium text-gray-500">Data de Nascimento</dt>
                          <dd className="text-sm text-gray-900">
                            {new Date(team.coach.dateOfBirth).toLocaleDateString('pt-BR')}
                          </dd>
                        </div>
                      )}
                    </dl>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'squad' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Elenco</h3>
                </div>
                {team.squad && team.squad.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nome
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Posição
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Nacionalidade
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Idade
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {team.squad.map((player) => (
                          <tr key={player.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {player.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {player.position}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {player.nationality || '-'}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {player.dateOfBirth ? 
                                Math.floor((Date.now() - new Date(player.dateOfBirth).getTime()) / (365.25 * 24 * 60 * 60 * 1000)) 
                                : '-'
                              }
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center">
                    <p className="text-gray-500">Informações do elenco não disponíveis</p>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'matches' && (
              <div className="bg-white shadow rounded-lg">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Partidas</h3>
                </div>
                {matchesLoading ? (
                  <div className="px-6 py-8 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Carregando partidas...</p>
                  </div>
                ) : matches.length > 0 ? (
                  <div className="divide-y divide-gray-200">
                     {matches.slice(0, 99).map((match) => {
                       const getStatusBadge = (status: string) => {
                         switch (status) {
                           case 'FINISHED':
                             return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Finalizada</span>;
                           case 'TIMED':
                             return <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Agendada</span>;
                           case 'SCHEDULED':
                             return <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Programada</span>;
                           case 'POSTPONED':
                             return <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Adiada</span>;
                           default:
                             return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded">{status}</span>;
                         }
                       };

                       const getCompetitionBadge = (competition: any) => {
                         if (competition?.code === 'BSA') {
                           return <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mr-2">🇧🇷 Brasileirão</span>;
                         }
                         if (competition?.code === 'CLI') {
                           return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded mr-2">🏆 Libertadores</span>;
                         }
                         return <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded mr-2">{competition?.name}</span>;
                       };

                       return (
                         <div key={match.id} className="px-6 py-4 hover:bg-gray-50">
                           <div className="flex items-center justify-between">
                             <div className="flex items-center space-x-6">
                               <div className="text-center min-w-[100px]">
                                 <div className="text-sm font-medium text-gray-900 truncate">
                                   {match.homeTeam?.short_name || match.homeTeam?.name}
                                 </div>
                                 <div className="text-xs text-gray-500">Casa</div>
                               </div>
                               <div className="text-center">
                                 <div className="text-lg font-bold text-gray-900">
                                   {match.score?.fullTime?.home ?? '-'} x {match.score?.fullTime?.away ?? '-'}
                                 </div>
                                 <div className="mt-1">
                                   {getStatusBadge(match.status)}
                                 </div>
                               </div>
                               <div className="text-center min-w-[100px]">
                                 <div className="text-sm font-medium text-gray-900 truncate">
                                   {match.awayTeam?.short_name || match.awayTeam?.name}
                                 </div>
                                 <div className="text-xs text-gray-500">Visitante</div>
                               </div>
                             </div>
                             <div className="text-right">
                               <div className="text-sm text-gray-900 mb-1">
                                 {formatDate(match.utcDate)}
                               </div>
                               <div className="text-xs">
                                 {getCompetitionBadge(match.competition)}
                                 {match.matchday && <span className="text-gray-500">Rodada {match.matchday}</span>}
                               </div>
                             </div>
                           </div>
                         </div>
                       );
                     })}
                  </div>
                ) : (
                  <div className="px-6 py-8 text-center">
                    <p className="text-gray-500">Nenhuma partida encontrada</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
