'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Compass, Search, Users, CheckCircle2, Plus, Sparkles, Filter } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card, Badge } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Dialog } from '@/components/ui/Dialog';
import { Textarea } from '@/components/ui/Input';
import { INITIAL_COMMUNITIES, Community } from '@/lib/store';

export default function DiscoverPage() {
  const [communities, setCommunities] = useState<Community[]>(INITIAL_COMMUNITIES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [joinedMap, setJoinedMap] = useState<Record<string, boolean>>({ 'com-1': true });

  const [requestModalOpen, setRequestModalOpen] = useState(false);
  const [reqName, setReqName] = useState('');
  const [reqDesc, setReqDesc] = useState('');
  const [reqCategory, setReqCategory] = useState('Programming');
  const [reqSubmitted, setReqSubmitted] = useState(false);

  const categories = ['All', 'Programming', 'Fitness', 'Forex', 'Business'];

  const filteredCommunities = communities.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) || c.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || c.category.toLowerCase() === selectedCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const toggleJoin = (id: string) => {
    setJoinedMap(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleRequestCommunity = () => {
    setReqSubmitted(true);
    setTimeout(() => {
      setReqSubmitted(false);
      setRequestModalOpen(false);
      setReqName('');
      setReqDesc('');
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100 flex items-center space-x-2">
            <Compass className="w-6 h-6 text-emerald-600" />
            <span>Discover Communities</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Find peers working on the exact skills and goals you care about.
          </p>
        </div>

        <Button variant="outline" size="sm" onClick={() => setRequestModalOpen(true)} leftIcon={<Plus className="w-4 h-4" />}>
          Request New Community
        </Button>
      </div>

      {/* Search & Category Filter Bar */}
      <div className="space-y-3">
        <Input
          placeholder="Search Ethiopian communities by name or topic..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
        />

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Community Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredCommunities.map((com) => {
          const isJoined = joinedMap[com.id];
          return (
            <Card key={com.id} className="space-y-4 hover:border-emerald-500/40 transition-colors flex flex-col justify-between">
              <div className="space-y-3">
                {com.banner_url && (
                  <img src={com.banner_url} alt={com.name} className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-800" />
                )}

                <div className="space-y-1.5">
                  <div className="flex items-center space-x-2">
                    <Badge variant="emerald">{com.category}</Badge>
                    {com.is_verified && <Badge variant="amber">Verified</Badge>}
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
                    onClick={() => toggleJoin(com.id)}
                  >
                    {isJoined ? 'Joined' : 'Join'}
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Community Request Modal */}
      <Dialog isOpen={requestModalOpen} onClose={() => setRequestModalOpen(false)} title="Request Community Creation">
        <div className="space-y-4">
          <p className="text-xs text-slate-500">
            Community creation requests are reviewed by platform admins to maintain community quality and safety.
          </p>

          <Input
            label="Community Name"
            placeholder="e.g. Hawassa Tech Hub"
            value={reqName}
            onChange={(e) => setReqName(e.target.value)}
          />

          <Textarea
            label="Description & Purpose"
            placeholder="Describe who this community is for..."
            value={reqDesc}
            onChange={(e) => setReqDesc(e.target.value)}
          />

          {reqSubmitted ? (
            <div className="p-3 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-xl text-center text-xs font-bold">
              ✅ Request submitted for admin review!
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
