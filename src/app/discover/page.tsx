'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Compass,
  Search,
  Users,
  CheckCircle2,
  Plus,
  Sparkles,
  Filter,
  Flame,
  Clock,
  MapPin,
  GraduationCap,
  ShieldCheck,
  UserPlus
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { Input, Textarea } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import {
  INITIAL_COMMUNITIES,
  INITIAL_SQUADS,
  Community,
  Squad,
  SubCity,
  UniversityCampus,
  ActiveWindow
} from '@/lib/store';
import { inspectAndSanitizeContent } from '@/lib/link-guard';
import { DICTIONARY, AppLanguage, getStoredLanguage } from '@/lib/i18n';

const SUB_CITIES: SubCity[] = [
  'Bole',
  'Kirkos',
  'Yeka',
  'Arada',
  'Gullele',
  'Lideta',
  'Nifas Silk-Lafto',
  'Kolfe Keranio',
  'Akaky Kaliti',
  'Lemi Kura',
];

const CAMPUSES: UniversityCampus[] = [
  'AAU (Addis Ababa University)',
  'ASTU (Adama Science & Tech)',
  'Jimma University',
  'Hawassa University',
  'Bahir Dar University',
  'Dire Dawa University',
];

const ACTIVE_WINDOWS: ActiveWindow[] = [
  'Early Bird (5 AM – 8 AM)',
  'Morning Focus (8 AM – 12 PM)',
  'Afternoon Sprint (1 PM – 5 PM)',
  'Evening Wind-down (6 PM – 9 PM)',
  'Night Owl (10 PM – 1 AM)',
];

export default function DiscoverPage() {
  const [currentLang, setCurrentLang] = useState<AppLanguage>('en');
  const t = DICTIONARY[currentLang] || DICTIONARY.en;

  useEffect(() => {
    setCurrentLang(getStoredLanguage());
  }, []);

  const [activeTab, setActiveTab] = useState<'communities' | 'squads'>('squads');
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [squads, setSquads] = useState<Squad[]>(INITIAL_SQUADS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedSubCity, setSelectedSubCity] = useState<string>('All');
  const [selectedCampus, setSelectedCampus] = useState<string>('All');
  const [selectedSchedule, setSelectedSchedule] = useState<string>('All');

  const [joinedCommunitiesMap, setJoinedCommunitiesMap] = useState<Record<string, boolean>>({ 'com-1': true });
  const [joinedSquadsMap, setJoinedSquadsMap] = useState<Record<string, boolean>>({ 'sqd-1': true });

  // Community Request Modal State
  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reqName, setReqName] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqSubCity, setReqSubCity] = useState<SubCity>('Bole');
  const [reqSubmitted, setReqSubmitted] = useState(false);
  const [linkWarning, setLinkWarning] = useState<string | null>(null);

  const categories = ['All', 'Programming', 'Fitness', 'Forex', 'Business', 'Education'];

  // Filtered Communities
  const filteredCommunities = communities.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSubCity = selectedSubCity === 'All' || c.sub_city === selectedSubCity;
    const matchesCampus = selectedCampus === 'All' || c.university_campus === selectedCampus;
    return matchesSearch && matchesCat && matchesSubCity && matchesCampus;
  });

  // Filtered Micro-Squads
  const filteredSquads = squads.filter((s) => {
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.focus.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || s.category.toLowerCase() === selectedCategory.toLowerCase();
    const matchesSubCity = selectedSubCity === 'All' || s.sub_city === selectedSubCity;
    const matchesCampus = selectedCampus === 'All' || s.university_campus === selectedCampus;
    const matchesSchedule = selectedSchedule === 'All' || s.active_window === selectedSchedule;
    return matchesSearch && matchesCat && matchesSubCity && matchesCampus && matchesSchedule;
  });

  const toggleJoinCommunity = (id: string) => {
    setJoinedCommunitiesMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleJoinSquad = (id: string) => {
    setJoinedSquadsMap((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRequestCommunity = () => {
    // Run link guard anti-scam inspection
    const guard = inspectAndSanitizeContent(reqDesc, 420, 30);
    if (!guard.isClean) {
      setLinkWarning(guard.detectedThreats.join(', '));
      return;
    }

    setReqSubmitted(true);
    setTimeout(() => {
      setReqSubmitted(false);
      setRequestModalOpen(false);
      setReqName('');
      setReqDesc('');
      setLinkWarning(null);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Compass className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            <span>{t.discover.title}</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            {t.discover.subtitle}
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setRequestModalOpen(true)}
            leftIcon={<Plus className="w-4 h-4" />}
          >
            Create / Request Group
          </Button>
        </div>
      </div>

      {/* Main Tabs: 5-8 Person Micro-Squads vs Public Communities */}
      <div className="flex items-center space-x-3 border-b border-slate-200 dark:border-slate-800 pb-2">
        <button
          onClick={() => setActiveTab('squads')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'squads'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>{t.discover.microSquadsTab}</span>
          <span className="bg-emerald-950 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full">
            Recommended
          </span>
        </button>

        <button
          onClick={() => setActiveTab('communities')}
          className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeTab === 'communities'
              ? 'bg-emerald-600 text-white shadow-sm'
              : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Compass className="w-4 h-4" />
          <span>{t.discover.communitiesTab}</span>
        </button>
      </div>

      {/* Search & Multi-level Filter Controls */}
      <div className="space-y-3 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <Input
          placeholder={t.discover.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1">Category:</span>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sub-City & University Campus Clustering Selectors */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1">
              <MapPin className="w-3 h-3 text-emerald-500" />
              <span>{t.discover.subCitiesTitle}</span>
            </label>
            <select
              value={selectedSubCity}
              onChange={(e) => setSelectedSubCity(e.target.value)}
              className="w-full rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2 text-xs border-slate-300 dark:border-slate-700"
            >
              <option value="All">All Sub-Cities</option>
              {SUB_CITIES.map((sub) => (
                <option key={sub} value={sub}>
                  {sub}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1">
              <GraduationCap className="w-3 h-3 text-blue-500" />
              <span>{t.discover.campusesTitle}</span>
            </label>
            <select
              value={selectedCampus}
              onChange={(e) => setSelectedCampus(e.target.value)}
              className="w-full rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2 text-xs border-slate-300 dark:border-slate-700"
            >
              <option value="All">All Campuses</option>
              {CAMPUSES.map((cam) => (
                <option key={cam} value={cam}>
                  {cam}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1 flex items-center space-x-1">
              <Clock className="w-3 h-3 text-amber-500" />
              <span>{t.discover.scheduleMatching}</span>
            </label>
            <select
              value={selectedSchedule}
              onChange={(e) => setSelectedSchedule(e.target.value)}
              className="w-full rounded-lg border bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 p-2 text-xs border-slate-300 dark:border-slate-700"
            >
              <option value="All">Any Active Window</option>
              {ACTIVE_WINDOWS.map((win) => (
                <option key={win} value={win}>
                  {win}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* TAB 1: 5-8 PERSON MICRO-SQUADS */}
      {activeTab === 'squads' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredSquads.map((squad) => {
              const isJoined = joinedSquadsMap[squad.id];
              return (
                <Card
                  key={squad.id}
                  className="space-y-4 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-emerald-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-1.5">
                          <Badge variant="emerald">{squad.category}</Badge>
                          {squad.sub_city && (
                            <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full font-semibold text-slate-600 dark:text-slate-300 flex items-center space-x-1">
                              <MapPin className="w-2.5 h-2.5" />
                              <span>{squad.sub_city}</span>
                            </span>
                          )}
                          {squad.university_campus && (
                            <span className="text-[10px] bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full font-semibold">
                              {squad.university_campus.split(' ')[0]}
                            </span>
                          )}
                        </div>
                        <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">
                          {squad.name}
                        </h3>
                      </div>

                      <span className="text-xs font-bold text-amber-500 flex items-center space-x-1 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded-full">
                        <Flame className="w-3.5 h-3.5 fill-amber-500" />
                        <span>{squad.total_squad_streak}d Streak</span>
                      </span>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                      {squad.focus}
                    </p>

                    <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-xl space-y-1 text-xs">
                      <div className="flex items-center justify-between text-slate-500">
                        <span className="flex items-center space-x-1">
                          <Clock className="w-3 h-3 text-amber-500" />
                          <span>{squad.active_window}</span>
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {squad.current_members_count + (isJoined ? 1 : 0)} / {squad.max_members} spots filled
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center space-x-2">
                      <Avatar name={squad.leader_name} src={squad.leader_avatar} size="sm" />
                      <div>
                        <span className="text-[11px] font-bold block leading-tight">{squad.leader_name}</span>
                        <span className="text-[10px] text-slate-400">Squad Leader</span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant={isJoined ? 'outline' : 'primary'}
                      onClick={() => toggleJoinSquad(squad.id)}
                      leftIcon={isJoined ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" /> : <UserPlus className="w-3.5 h-3.5" />}
                    >
                      {isJoined ? t.discover.joined : t.discover.join}
                    </Button>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PUBLIC COMMUNITIES */}
      {activeTab === 'communities' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredCommunities.map((com) => {
            const isJoined = joinedCommunitiesMap[com.id];
            return (
              <Card key={com.id} className="space-y-4 hover:border-emerald-500/40 transition-colors flex flex-col justify-between">
                <div className="space-y-3">
                  {com.banner_url && (
                    <img
                      src={com.banner_url}
                      alt={com.name}
                      className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-800"
                    />
                  )}

                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge variant="emerald">{com.category}</Badge>
                      {com.is_verified && <Badge variant="amber">Verified</Badge>}
                      {com.sub_city && (
                        <span className="text-[10px] bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full text-slate-600 dark:text-slate-300">
                          {com.sub_city}
                        </span>
                      )}
                    </div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-slate-100">{com.name}</h3>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{com.description}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800">
                  <span className="text-xs text-slate-500 font-medium flex items-center space-x-1">
                    <Users className="w-3.5 h-3.5 text-slate-400" />
                    <span>{com.member_count} members</span>
                  </span>

                  <div className="flex items-center space-x-2">
                    <Link href={`/communities/${com.slug}`}>
                      <Button variant="ghost" size="sm">
                        View Page
                      </Button>
                    </Link>
                    <Button
                      size="sm"
                      variant={isJoined ? 'outline' : 'primary'}
                      onClick={() => toggleJoinCommunity(com.id)}
                    >
                      {isJoined ? t.discover.joined : t.discover.join}
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Community Request Modal with Link Guard */}
      <Dialog isOpen={requestModalOpen} onClose={() => setRequestModalOpen(false)} title="Create New Micro-Squad or Community">
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Micro-squads (5-8 members) and community requests are screened by platform link guards to prevent financial scams.
          </p>

          <Input
            label="Name"
            placeholder="e.g. Bole 6 AM Morning Coders"
            value={reqName}
            onChange={(e) => setReqName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Sub-City
              </label>
              <select
                value={reqSubCity}
                onChange={(e) => setReqSubCity(e.target.value as SubCity)}
                className="w-full rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 text-xs border-slate-300 dark:border-slate-800"
              >
                {SUB_CITIES.map((sc) => (
                  <option key={sc} value={sc}>
                    {sc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-600 dark:text-slate-400 mb-1">
                Target Capacity
              </label>
              <select className="w-full rounded-lg border bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 p-2.5 text-xs border-slate-300 dark:border-slate-800">
                <option value="6">6 Members (Tight Squad)</option>
                <option value="8">8 Members (Accountability Circle)</option>
                <option value="open">Unlimited (Public Community)</option>
              </select>
            </div>
          </div>

          <Textarea
            label="Description & Routine Commitment"
            placeholder="Describe your daily routine commitment..."
            value={reqDesc}
            onChange={(e) => {
              setReqDesc(e.target.value);
              setLinkWarning(null);
            }}
          />

          {linkWarning && (
            <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-500/40 rounded-xl text-red-800 dark:text-red-200 text-xs font-medium">
              ⚠️ Link Guard Warning: {linkWarning}
            </div>
          )}

          {reqSubmitted ? (
            <div className="p-3 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-center text-xs font-bold">
              ✅ Squad request verified and created!
            </div>
          ) : (
            <div className="flex justify-end space-x-3 pt-3 border-t border-slate-200 dark:border-slate-800">
              <Button variant="outline" onClick={() => setRequestModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleRequestCommunity} disabled={!reqName}>
                Submit Request
              </Button>
            </div>
          )}
        </div>
      </Dialog>
    </div>
  );
}
