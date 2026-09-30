import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { currentUser } from '../data/currentUser';
import { LeaderboardEntry } from '../types';
import { Trophy, Flame, Target, EyeOff, Eye, Award, CheckCircle2 } from 'lucide-react';

export const LeaderboardPage: React.FC = () => {
  const { user, refreshUser, showToast } = useApp();
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [hideProfile, setHideProfile] = useState(user?.hideFromLeaderboard || false);

  useEffect(() => {
    const loadLeaderboard = async () => {
      try {
        const list = await api.getLeaderboard();
        setEntries(list);
      } catch (err) {
        console.error('Failed to load leaderboard:', err);
      } finally {
        setLoading(false);
      }
    };
    loadLeaderboard();
  }, []);

  const handleTogglePrivacy = async () => {
    const nextVal = !hideProfile;
    setHideProfile(nextVal);
    try {
      await api.updateUserProfile({ hideFromLeaderboard: nextVal });
      await refreshUser();
      showToast({
        type: 'info',
        title: 'Privacy Setting Updated',
        message: nextVal ? 'Your rank is now hidden from public view.' : 'Your profile is now visible on the leaderboard.'
      });
    } catch (err) {
      showToast({ type: 'error', message: 'Failed to update privacy setting' });
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8 py-2 max-w-5xl mx-auto">
      
      {/* Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white border border-indigo-800/40 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-indigo-300 text-xs font-bold uppercase tracking-wider">
            <Trophy className="w-4 h-4 text-amber-300" />
            <span>National Aspirant Rankings</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold mt-1">
            All-India Mock Test Leaderboard
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl">
            Live percentile benchmarks computed from full-length SSC CGL Tier-1 test series and sectional accuracy rates.
          </p>
        </div>

        {/* Privacy Toggle */}
        <button
          onClick={handleTogglePrivacy}
          className="py-2.5 px-4 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 transition-colors flex items-center gap-2 cursor-pointer shrink-0"
        >
          {hideProfile ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
          <span>{hideProfile ? 'Show My Profile on Board' : 'Hide My Profile (Private)'}</span>
        </button>
      </div>

      {/* Podium Top 3 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
        {entries.slice(0, 3).map((top, idx) => {
          const podiumColor = idx === 0 
            ? 'from-amber-400 to-yellow-600' 
            : idx === 1 
            ? 'from-slate-300 to-slate-400' 
            : 'from-amber-700 to-amber-900';

          return (
            <div
              key={top.userId}
              className={`p-6 rounded-3xl bg-white dark:bg-slate-900 border text-center space-y-3 relative overflow-hidden ${
                idx === 0 
                  ? 'border-amber-400/60 shadow-lg shadow-amber-500/10 md:-translate-y-2' 
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-tr text-white flex items-center justify-center font-black text-lg shadow-md" style={{ background: idx === 0 ? '#d97706' : idx === 1 ? '#64748b' : '#b45309' }}>
                #{top.rank}
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">{top.name}</h3>
                <div className="flex items-center justify-center gap-1.5 text-xs text-amber-600 dark:text-amber-400 mt-1">
                  <Flame className="w-3.5 h-3.5 fill-amber-500 text-amber-500" />
                  <span>{top.streak}d streak</span>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 block">Avg Score</span>
                  <span className="font-black text-indigo-600 dark:text-indigo-400">{top.score}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 block">Accuracy</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400">{top.accuracy}%</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Leaderboard Table */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 text-[11px]">
                <th className="pb-3 font-semibold">Rank</th>
                <th className="pb-3 font-semibold">Name</th>
                <th className="pb-3 font-semibold">Score</th>
                <th className="pb-3 font-semibold">Accuracy</th>
                <th className="pb-3 font-semibold">Tests Completed</th>
                <th className="pb-3 font-semibold">Streak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {entries.map((entry) => {
                const isCurrentUser = entry.userId === 'user-demo';
                const displayName = isCurrentUser ? `${user?.name || currentUser.name} (You)` : entry.name;

                return (
                  <tr
                    key={entry.userId}
                    className={`transition-colors ${
                      isCurrentUser
                        ? 'bg-indigo-50/70 dark:bg-indigo-950/40 font-bold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/40'
                    }`}
                  >
                    <td className="py-3.5 font-bold">
                      <span className={`w-6 h-6 rounded-full inline-flex items-center justify-center text-xs ${
                        entry.rank <= 3 ? 'bg-amber-100 text-amber-800 font-black' : 'text-slate-500'
                      }`}>
                        {entry.rank}
                      </span>
                    </td>

                    <td className="py-3.5 text-slate-900 dark:text-white">
                      <div className="flex items-center gap-2">
                        <span>{displayName}</span>
                        {isCurrentUser && (
                          <span className="text-[10px] px-2 py-0.2 rounded-full bg-indigo-600 text-white font-semibold">
                            You
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="py-3.5 font-black text-indigo-600 dark:text-indigo-400">
                      {entry.score}
                    </td>

                    <td className="py-3.5 font-semibold text-emerald-600 dark:text-emerald-400">
                      {entry.accuracy}%
                    </td>

                    <td className="py-3.5 text-slate-600 dark:text-slate-400">
                      {entry.testsCompleted} tests
                    </td>

                    <td className="py-3.5 text-amber-600 dark:text-amber-400 font-semibold">
                      {entry.streak} days
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
