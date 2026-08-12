'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight, ArrowLeft, Sparkles, Compass, User, BookOpen, Dumbbell, Code, ShieldCheck, DollarSign } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Card, Badge, Avatar } from '@/components/ui/Card';
import { INITIAL_COMMUNITIES } from '@/lib/store';

const INTEREST_OPTIONS = [
  { id: 'prog', name: 'Programming', icon: Code, category: 'Tech' },
  { id: 'fit', name: 'Fitness & Calisthenics', icon: Dumbbell, category: 'Health' },
  { id: 'sec', name: 'Cybersecurity', icon: ShieldCheck, category: 'Tech' },
  { id: 'forex', name: 'Forex & Trading', icon: DollarSign, category: 'Finance' },
  { id: 'bible', name: 'Bible Study', icon: BookOpen, category: 'Personal' },
  { id: 'biz', name: 'Business & Startups', icon: Compass, category: 'Business' },
  { id: 'read', name: 'Reading & Growth', icon: BookOpen, category: 'Personal' },
  { id: 'lang', name: 'Language Learning', icon: BookOpen, category: 'Education' },
];

const INTENT_OPTIONS = [
  'Accountability & Habits',
  'Learning & Skill Building',
  'Finding Like-minded People',
  'Helping & Mentoring Others',
  'Participating in Challenges',
  'All of these'
];

export default function OnboardingPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);

  // Form State
  const [displayName, setDisplayName] = useState('Abebe Kebede');
  const [username, setUsername] = useState('abebe_k');
  const [usernameError, setUsernameError] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>(['Programming', 'Fitness & Calisthenics']);
  const [experienceLevels, setExperienceLevels] = useState<Record<string, string>>({
    'Programming': 'Intermediate',
    'Fitness & Calisthenics': 'Learning'
  });
  const [selectedIntents, setSelectedIntents] = useState<string[]>(['Accountability & Habits']);
  const [joinedCommunities, setJoinedCommunities] = useState<string[]>(['com-1']);

  const validateUsername = (val: string) => {
    setUsername(val);
    const regex = /^[a-z0-9_]{3,20}$/i;
    if (val.length < 3) {
      setUsernameError('Username must be at least 3 characters.');
    } else if (val.toLowerCase() === 'admin' || val.toLowerCase() === 'mod') {
      setUsernameError('This username is reserved.');
    } else {
      setUsernameError('');
    }
  };

  const toggleInterest = (name: string) => {
    if (selectedInterests.includes(name)) {
      setSelectedInterests(selectedInterests.filter(i => i !== name));
    } else {
      setSelectedInterests([...selectedInterests, name]);
      if (!experienceLevels[name]) {
        setExperienceLevels({ ...experienceLevels, [name]: 'Learning' });
      }
    }
  };

  const toggleIntent = (intent: string) => {
    if (selectedIntents.includes(intent)) {
      setSelectedIntents(selectedIntents.filter(i => i !== intent));
    } else {
      setSelectedIntents([...selectedIntents, intent]);
    }
  };

  const handleFinish = () => {
    router.push('/home');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center p-4 sm:p-6">
      {/* Header */}
      <div className="w-full max-w-xl mb-6 text-center space-y-2">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-black text-xl mx-auto shadow-md">
          🇪🇹
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white">Welcome to Tewedada</h1>
        <p className="text-xs sm:text-sm text-slate-400">Step {step} of 5 — Setting up your profile</p>

        {/* Progress Bar */}
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mt-3">
          <div
            className="bg-emerald-500 h-full transition-all duration-300"
            style={{ width: `${(step / 5) * 100}%` }}
          />
        </div>
      </div>

      {/* Wizard Card Container */}
      <Card className="w-full max-w-xl bg-slate-900 border-slate-800 p-6 sm:p-8 space-y-6 shadow-2xl">
        {/* Step 1: Profile */}
        {step === 1 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100">What should we call you?</h2>
              <p className="text-xs text-slate-400">Choose your public display name and unique username.</p>
            </div>

            <Input
              label="Display Name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="e.g. Abebe Kebede"
            />

            <Input
              label="Username"
              value={username}
              onChange={(e) => validateUsername(e.target.value)}
              error={usernameError}
              placeholder="e.g. abebe_k"
            />
          </div>
        )}

        {/* Step 2: Interests */}
        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100">Choose your interests</h2>
              <p className="text-xs text-slate-400">Select what you are actively practicing or learning.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-72 overflow-y-auto pr-1">
              {INTEREST_OPTIONS.map((item) => {
                const selected = selectedInterests.includes(item.name);
                const Icon = item.icon;
                return (
                  <button
                    key={item.id}
                    onClick={() => toggleInterest(item.name)}
                    className={`flex items-center justify-between p-3.5 rounded-xl border text-left text-xs font-semibold transition-all cursor-pointer ${
                      selected
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                        : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center space-x-2.5">
                      <Icon className="w-4 h-4 text-emerald-400" />
                      <span>{item.name}</span>
                    </div>
                    {selected && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 3: Experience Levels */}
        {step === 3 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100">Experience Levels</h2>
              <p className="text-xs text-slate-400">Help us match you with peers at your skill level.</p>
            </div>

            <div className="space-y-4 max-h-72 overflow-y-auto pr-1">
              {selectedInterests.map((interest) => (
                <div key={interest} className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                  <span className="text-xs font-bold text-emerald-400">{interest}</span>
                  <div className="flex flex-wrap gap-2">
                    {['Beginner', 'Learning', 'Intermediate', 'Advanced', 'Experienced'].map((lvl) => {
                      const active = experienceLevels[interest] === lvl;
                      return (
                        <button
                          key={lvl}
                          onClick={() => setExperienceLevels({ ...experienceLevels, [interest]: lvl })}
                          className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                            active
                              ? 'bg-emerald-600 text-white border-emerald-500'
                              : 'bg-slate-900 text-slate-400 border-slate-800 hover:border-slate-700'
                          }`}
                        >
                          {lvl}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Intent */}
        {step === 4 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100">What are you here for?</h2>
              <p className="text-xs text-slate-400">Select your primary objectives on the platform.</p>
            </div>

            <div className="space-y-2">
              {INTENT_OPTIONS.map((intent) => {
                const active = selectedIntents.includes(intent);
                return (
                  <button
                    key={intent}
                    onClick={() => toggleIntent(intent)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-xs font-medium transition-colors cursor-pointer ${
                      active
                        ? 'border-emerald-500 bg-emerald-950/60 text-emerald-300'
                        : 'border-slate-800 bg-slate-950 text-slate-300 hover:border-slate-700'
                    }`}
                  >
                    <span>{intent}</span>
                    {active && <Check className="w-4 h-4 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* Step 5: Recommended Communities */}
        {step === 5 && (
          <div className="space-y-4 animate-fade-in">
            <div className="space-y-1">
              <h2 className="text-lg font-bold text-slate-100">Recommended Communities</h2>
              <p className="text-xs text-slate-400">We matched these active Ethiopian communities for you.</p>
            </div>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {INITIAL_COMMUNITIES.map((com) => {
                const joined = joinedCommunities.includes(com.id);
                return (
                  <div key={com.id} className="flex items-center justify-between p-3 rounded-xl bg-slate-950 border border-slate-800">
                    <div className="space-y-1 min-w-0 pr-3">
                      <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-slate-100 truncate">{com.name}</span>
                        {com.is_verified && <Badge variant="emerald">Verified</Badge>}
                      </div>
                      <p className="text-[11px] text-slate-400 line-clamp-1">{com.description}</p>
                    </div>
                    <Button
                      size="sm"
                      variant={joined ? 'outline' : 'primary'}
                      onClick={() => {
                        if (joined) setJoinedCommunities(joinedCommunities.filter(c => c !== com.id));
                        else setJoinedCommunities([...joinedCommunities, com.id]);
                      }}
                    >
                      {joined ? 'Joined' : 'Join'}
                    </Button>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-800">
          {step > 1 ? (
            <Button variant="ghost" onClick={() => setStep(step - 1)} leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Back
            </Button>
          ) : <div />}

          {step < 5 ? (
            <Button
              variant="primary"
              disabled={step === 1 && (!!usernameError || !displayName || !username)}
              onClick={() => setStep(step + 1)}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Continue
            </Button>
          ) : (
            <Button variant="primary" onClick={handleFinish} rightIcon={<Sparkles className="w-4 h-4" />}>
              Finish & Go to Home
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
