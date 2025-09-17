'use client';

import ProtectedRoute from '@/components/ProtectedRoute';
import TeamCard from '@/components/TeamCard';
import { useAuth } from '@/contexts/AuthContext';
import { sistemaAPI, teamsAPI } from '@/lib/api';
import { IndicadoresResponse, Team } from '@/models/api.models';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'react-toastify';

export default function TeamsPage() {
  const [teams, setTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [competition, setCompetition] = useState<any>(null);
  
  // Estados para filtros
  const [searchTerm, setSearchTerm] = useState('');
  
  // Estados para tabs e indicadores
  const [activeTab, setActiveTab] = useState<'teams' | 'stats'>('teams');
  const [indicadores, setIndicadores] = useState<IndicadoresResponse | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  
  const { logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    fetchTeams();
  }, []);

  // Função para buscar indicadores
  const fetchIndicadores = async () => {
    if (indicadores) return; // Só busca uma vez
    
    try {
      setStatsLoading(true);
      const response = await sistemaAPI.getIndicadores();
      setIndicadores(response.data);
    } catch (err: any) {
      console.error('Erro ao buscar indicadores:', err);
      toast.error('Erro ao carregar estatísticas');
    } finally {
      setStatsLoading(false);
    }
  };

  // Filtros aplicados aos times
  const filteredTeams = useMemo(() => {
    return teams.filter(team => {
      // Filtro por nome, sigla ou abreviação
      const matchesSearch = team.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           (team.short_name?.toLowerCase().includes(searchTerm.toLowerCase())) ||
                           (team.tla?.toLowerCase().includes(searchTerm.toLowerCase()));
      
      return matchesSearch;
    }).sort((a, b) => a.name.localeCompare(b.name)); // Ordenação alfabética simples
  }, [teams, searchTerm]);

  const fetchTeams = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Busca diretamente da API externa (sem cache)
      const response = await teamsAPI.getBrasileirao();
      setTeams(response.data.teams);
      setCompetition(response.data.competition);
    } catch (err: any) {
      console.error('Erro ao buscar times:', err);
      setError(
        err.response?.data?.detail || 
        'Erro ao carregar times. Verifique sua conexão.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  const handleBackToDashboard = () => {
    router.push('/dashboard');
  };

  const handleTabChange = (tab: 'teams' | 'stats') => {
    setActiveTab(tab);
    if (tab === 'stats') {
      fetchIndicadores();
    }
  };

  if (loading) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Carregando times...</p>
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
                  onClick={handleBackToDashboard}
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Voltar ao Dashboard
                </button>
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">Times do Brasileirão</h1>
                  <p className="text-gray-600">
                    {competition?.name || 'Campeonato Brasileiro Série A'}
                  </p>
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

        {/* Tabs */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'teams', label: 'Times', icon: '⚽', count: teams.length },
                { id: 'stats', label: 'Estatísticas', icon: '📊' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => handleTabChange(tab.id as any)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-primary-500 text-primary-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <span className="mr-2">{tab.icon}</span>
                  {tab.label}
                  {tab.count !== undefined && (
                    <span className={`ml-2 px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id 
                        ? 'bg-primary-100 text-primary-600' 
                        : 'bg-gray-100 text-gray-500'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Conteúdo principal */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {activeTab === 'teams' && (
              <>
                {/* Filtro de busca para times */}
                <div className="mb-6 bg-white rounded-lg shadow p-6">
                  <div className="max-w-md">
                    <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
                      Buscar time
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="search"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Nome, sigla ou abreviação..."
                        className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                      />
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      {searchTerm && (
                        <button
                          onClick={() => setSearchTerm('')}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </>
            )}

            {error ? (
              /* Estado de erro */
              <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-red-800">Erro ao carregar times</h3>
                    <p className="mt-1 text-sm text-red-700">{error}</p>
                    <button
                      onClick={fetchTeams}
                      className="mt-3 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
                    >
                      Tentar novamente
                    </button>
                  </div>
                </div>
              </div>
            ) : activeTab === 'teams' ? (
              teams.length === 0 ? (
              /* Estado vazio */
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum time encontrado</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Não foi possível encontrar times no momento.
                </p>
                <button
                  onClick={fetchTeams}
                  className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                >
                  Recarregar
                </button>
              </div>
              ) : filteredTeams.length === 0 ? (
                /* Nenhum resultado nos filtros */
                <div className="text-center py-12">
                  <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="mt-2 text-sm font-medium text-gray-900">Nenhum time encontrado</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    Tente uma busca diferente para encontrar o que você procura.
                  </p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Limpar Busca
                  </button>
                </div>
              ) : (
              /* Lista de times */
              <>
                {/* Info sobre total de times */}
                <div className="mb-6">
                  <div className="bg-primary-50 border border-primary-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <svg className="h-5 w-5 text-primary-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <p className="text-primary-800">
                        <span className="font-semibold">{teams.length} times</span> encontrados no Brasileirão Série A
                      </p>
                    </div>
                  </div>
                </div>

                {/* Grid de times filtrados */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {filteredTeams.map((team) => (
                    <TeamCard key={team.id} team={team} />
                  ))}
                </div>
              </>
              )
            ) : (
              /* Aba de estatísticas */
              <div>
                {statsLoading ? (
                  <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Carregando estatísticas...</p>
                  </div>
                ) : indicadores ? (
                  /* Componente de estatísticas */
                  <div className="space-y-6">
                    {/* Cards de estatísticas principais */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Time Mais Antigo</h3>
                        <p className="text-2xl font-bold text-primary-600">
                          {indicadores.estatisticas_historicas.time_mais_antigo.nome}
                        </p>
                        <p className="text-sm text-gray-500">
                          {indicadores.estatisticas_historicas.time_mais_antigo.tla} • {indicadores.estatisticas_historicas.time_mais_antigo.fundacao}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Time Mais Recente</h3>
                        <p className="text-2xl font-bold text-green-600">
                          {indicadores.estatisticas_historicas.time_mais_recente.nome}
                        </p>
                        <p className="text-sm text-gray-500">
                          {indicadores.estatisticas_historicas.time_mais_recente.tla} • {indicadores.estatisticas_historicas.time_mais_recente.fundacao}
                        </p>
                      </div>

                      <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-2">Média de Fundação</h3>
                        <p className="text-2xl font-bold text-purple-600">
                          {indicadores.estatisticas_historicas.media_ano_fundacao}
                        </p>
                        <p className="text-sm text-gray-500">
                          Período: {indicadores.estatisticas_historicas.periodo_fundacao}
                        </p>
                      </div>
                    </div>

                    {/* Distribuição por década */}
                    <div className="bg-white rounded-lg shadow p-6">
                      <h3 className="text-lg font-medium text-gray-900 mb-4">Distribuição por Década</h3>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                        {indicadores.distribuicao_temporal.por_decada.map((decade) => (
                          <div key={decade.decada} className="text-center p-4 bg-gray-50 rounded-lg">
                            <p className="text-lg font-bold text-gray-900">{decade.quantidade}</p>
                            <p className="text-sm text-gray-600">{decade.decada}</p>
                            <p className="text-xs text-gray-500">{decade.percentual}%</p>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 bg-amber-50 rounded-lg">
                          <p className="text-lg font-bold text-amber-700">{indicadores.distribuicao_temporal.times_centenarios}</p>
                          <p className="text-sm text-amber-600">Times Centenários</p>
                        </div>
                        <div className="p-3 bg-emerald-50 rounded-lg">
                          <p className="text-lg font-bold text-emerald-700">{indicadores.distribuicao_temporal.times_modernos}</p>
                          <p className="text-sm text-emerald-600">Times Modernos</p>
                        </div>
                      </div>
                    </div>

                    {/* Rankings */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Times Mais Antigos</h3>
                        <div className="space-y-3">
                          {indicadores.rankings.times_mais_antigos.map((team, index) => (
                            <div key={team.tla} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="bg-primary-100 text-primary-800 text-sm font-medium px-2 py-1 rounded-full mr-3">
                                  #{index + 1}
                                </span>
                                <div>
                                  <p className="font-medium text-gray-900">{team.nome}</p>
                                  <p className="text-sm text-gray-500">{team.tla}</p>
                                </div>
                              </div>
                              <span className="text-lg font-bold text-primary-600">{team.fundacao}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="bg-white rounded-lg shadow p-6">
                        <h3 className="text-lg font-medium text-gray-900 mb-4">Times Mais Novos</h3>
                        <div className="space-y-3">
                          {indicadores.rankings.times_mais_novos.map((team, index) => (
                            <div key={team.tla} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                              <div className="flex items-center">
                                <span className="bg-green-100 text-green-800 text-sm font-medium px-2 py-1 rounded-full mr-3">
                                  #{index + 1}
                                </span>
                                <div>
                                  <p className="font-medium text-gray-900">{team.nome}</p>
                                  <p className="text-sm text-gray-500">{team.tla}</p>
                                </div>
                              </div>
                              <span className="text-lg font-bold text-green-600">{team.fundacao}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <h3 className="mt-2 text-sm font-medium text-gray-900">Erro ao carregar estatísticas</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Tente novamente para ver os indicadores dos times.
                    </p>
                    <button
                      onClick={fetchIndicadores}
                      className="mt-4 bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
                    >
                      Tentar Novamente
                    </button>
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
