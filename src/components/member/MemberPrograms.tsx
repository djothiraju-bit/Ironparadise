import React, { useState, useEffect } from 'react';
import {
  Flame,
  Activity,
  Utensils,
  Dumbbell,
  Clock,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  TrendingDown,
  Award,
  Apple,
  Sparkles,
  Droplets,
  Heart,
  Target,
  Zap,
} from 'lucide-react';
import { Member } from '../../types';

interface MemberProgramsProps {
  member: Member;
  initialTab?: 'cardio' | 'fat_loss' | 'diet_plan' | 'bodybuilding';
  onUpdateGoal?: (goal: 'cardio' | 'fat_loss' | 'diet_plan' | 'bodybuilding') => void;
}

export const MemberPrograms: React.FC<MemberProgramsProps> = ({
  member,
  initialTab = 'cardio',
  onUpdateGoal,
}) => {
  const [activeTab, setActiveTab] = useState<'cardio' | 'fat_loss' | 'diet_plan' | 'bodybuilding'>(initialTab);

  // -------------------------------------------------------------
  // 1. CARDIO TIMER STATE & LOGIC
  // -------------------------------------------------------------
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerPhase, setTimerPhase] = useState<'work' | 'rest'>('work');
  const [timerSecondsLeft, setTimerSecondsLeft] = useState(30);
  const [currentRound, setCurrentRound] = useState(1);
  const [totalRounds, setTotalRounds] = useState(8);
  const [workDuration, setWorkDuration] = useState(30);
  const [restDuration, setRestDuration] = useState(15);

  // Heart rate zone state
  const [age, setAge] = useState(25);

  useEffect(() => {
    let interval: any = null;
    if (timerRunning) {
      interval = setInterval(() => {
        setTimerSecondsLeft((prev) => {
          if (prev <= 1) {
            // Switch phases or increment round
            if (timerPhase === 'work') {
              setTimerPhase('rest');
              return restDuration;
            } else {
              if (currentRound >= totalRounds) {
                setTimerRunning(false);
                return workDuration;
              }
              setCurrentRound((r) => r + 1);
              setTimerPhase('work');
              return workDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, timerPhase, currentRound, totalRounds, workDuration, restDuration]);

  const resetTimer = () => {
    setTimerRunning(false);
    setTimerPhase('work');
    setCurrentRound(1);
    setTimerSecondsLeft(workDuration);
  };

  // Heart rate math
  const maxHeartRate = 220 - age;
  const fatBurnLow = Math.round(maxHeartRate * 0.6);
  const fatBurnHigh = Math.round(maxHeartRate * 0.7);
  const cardioLow = Math.round(maxHeartRate * 0.7);
  const cardioHigh = Math.round(maxHeartRate * 0.85);

  // -------------------------------------------------------------
  // 2. FAT LOSS CALCULATOR STATE
  // -------------------------------------------------------------
  const [currentWeight, setCurrentWeight] = useState(78);
  const [targetWeight, setTargetWeight] = useState(70);
  const [activityLevel, setActivityLevel] = useState<'sedentary' | 'moderate' | 'active'>('moderate');

  // Daily calorie deficit calculation
  const bmrEstimate = Math.round(10 * currentWeight + 6.25 * 175 - 5 * age + 5);
  const activityMultiplier = activityLevel === 'sedentary' ? 1.2 : activityLevel === 'moderate' ? 1.45 : 1.7;
  const maintenanceCalories = Math.round(bmrEstimate * activityMultiplier);
  const fatLossCalories = maintenanceCalories - 500;

  // -------------------------------------------------------------
  // 3. DIET PLAN STATE
  // -------------------------------------------------------------
  const [dietPreference, setDietPreference] = useState<'non_veg' | 'veg' | 'heavy_bulk'>('non_veg');
  const [waterGlasses, setWaterGlasses] = useState(4); // 8 glasses = 4 Liters

  // -------------------------------------------------------------
  // 4. BODYBUILDING 1RM CALCULATOR STATE
  // -------------------------------------------------------------
  const [liftWeight, setLiftWeight] = useState(80);
  const [liftReps, setLiftReps] = useState(8);
  const oneRepMax = Math.round(liftWeight * (1 + liftReps / 30));
  const hypertrophyWeight = Math.round(oneRepMax * 0.75);

  return (
    <div className="flex-1 w-full p-4 space-y-4 pb-24 text-zinc-100">
      {/* Header */}
      <div className="pt-1">
        <div className="flex items-center gap-1.5 text-[10px] uppercase font-bold tracking-widest text-[#B7F34A]">
          IRON PARADISE FITNESS PROTOCOLS
        </div>
        <h2 className="text-xl font-black tracking-tight text-white uppercase">
          Training & Nutrition Hub
        </h2>
        <p className="text-xs text-zinc-400">
          Cardio, Fat Loss, Diet Plans & Bodybuilding splits
        </p>
      </div>

      {/* 4 Feature Selector Pill Tabs */}
      <div className="grid grid-cols-4 gap-1 p-1 bg-zinc-900 border border-zinc-800 rounded-2xl text-xs font-bold">
        <button
          onClick={() => setActiveTab('cardio')}
          className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
            activeTab === 'cardio'
              ? 'bg-[#B7F34A] text-black shadow-md shadow-[#B7F34A]/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Activity className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Cardio</span>
        </button>

        <button
          onClick={() => setActiveTab('fat_loss')}
          className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
            activeTab === 'fat_loss'
              ? 'bg-[#B7F34A] text-black shadow-md shadow-[#B7F34A]/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Flame className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Fat Loss</span>
        </button>

        <button
          onClick={() => setActiveTab('diet_plan')}
          className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
            activeTab === 'diet_plan'
              ? 'bg-[#B7F34A] text-black shadow-md shadow-[#B7F34A]/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Utensils className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Diet Plan</span>
        </button>

        <button
          onClick={() => setActiveTab('bodybuilding')}
          className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
            activeTab === 'bodybuilding'
              ? 'bg-[#B7F34A] text-black shadow-md shadow-[#B7F34A]/20'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          <Dumbbell className="w-4 h-4 mb-0.5" />
          <span className="text-[10px] tracking-tight">Building</span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 1. CARDIO FEATURE VIEW                                   */}
      {/* ========================================================= */}
      {activeTab === 'cardio' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          {/* Cardio HIIT Timer Card */}
          <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#B7F34A]" />
                <span className="text-xs font-bold uppercase tracking-wider text-white">
                  HIIT Interval Timer
                </span>
              </div>
              <span className="text-[10px] font-mono text-[#B7F34A]">
                Round {currentRound} / {totalRounds}
              </span>
            </div>

            {/* Timer Visual Display */}
            <div
              className={`p-6 rounded-2xl border text-center transition-all ${
                timerPhase === 'work'
                  ? 'bg-emerald-950/40 border-[#B7F34A]/60'
                  : 'bg-amber-950/40 border-amber-500/60'
              }`}
            >
              <div
                className={`text-[11px] font-black uppercase tracking-widest ${
                  timerPhase === 'work' ? 'text-[#B7F34A]' : 'text-amber-400'
                }`}
              >
                {timerPhase === 'work' ? '🔥 HIGH INTENSITY SPRINT' : '💨 RECOVERY WALK / BREATHE'}
              </div>
              <div className="text-5xl font-black text-white tabular-nums my-2 font-mono">
                {String(Math.floor(timerSecondsLeft / 60)).padStart(2, '0')}:
                {String(timerSecondsLeft % 60).padStart(2, '0')}
              </div>
              <div className="text-[10px] text-zinc-400">
                {timerPhase === 'work' ? `${workDuration}s All-Out Sprint` : `${restDuration}s Active Rest`}
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex gap-2">
              <button
                onClick={() => setTimerRunning(!timerRunning)}
                className={`flex-1 h-11 rounded-xl font-black text-xs flex items-center justify-center gap-1.5 transition-all ${
                  timerRunning
                    ? 'bg-amber-500 text-black hover:bg-amber-400'
                    : 'bg-[#B7F34A] text-black hover:bg-[#a6e03e] shadow-md shadow-[#B7F34A]/20'
                }`}
              >
                {timerRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                <span>{timerRunning ? 'Pause Interval' : 'Start HIIT Sprint'}</span>
              </button>

              <button
                onClick={resetTimer}
                className="w-11 h-11 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 flex items-center justify-center transition-colors"
                title="Reset Timer"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Heart Rate Zone Calculator */}
          <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                <Heart className="w-4 h-4 text-red-400" />
                <span>Target Heart Rate Zones</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <span className="text-zinc-400 text-[11px]">Age:</span>
                <input
                  type="number"
                  value={age}
                  onChange={(e) => setAge(parseInt(e.target.value, 10) || 20)}
                  className="w-12 h-6 px-1 rounded bg-zinc-950 border border-zinc-800 text-center font-bold text-xs text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Fat Burning Zone (60-70%)</div>
                <div className="text-base font-black text-[#B7F34A] tabular-nums mt-0.5">
                  {fatBurnLow} - {fatBurnHigh} <span className="text-[10px] font-normal text-zinc-400">BPM</span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">Incline treadmill & cycling</div>
              </div>

              <div className="p-2.5 rounded-xl bg-zinc-950 border border-zinc-800/80">
                <div className="text-[10px] text-zinc-400 uppercase font-semibold">Aerobic Endurance (70-85%)</div>
                <div className="text-base font-black text-amber-400 tabular-nums mt-0.5">
                  {cardioLow} - {cardioHigh} <span className="text-[10px] font-normal text-zinc-400">BPM</span>
                </div>
                <div className="text-[10px] text-zinc-400 mt-1">HIIT & rowing sprints</div>
              </div>
            </div>
          </div>

          {/* Cardio Workout Protocols */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1 block">
              Iron Paradise Cardio Protocols
            </span>

            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">1. The 12-3-30 Incline Treadmill</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-[#B7F34A] text-[10px] font-bold">Low Impact</span>
                </div>
                <p className="text-zinc-400 text-[11px] mt-1">
                  Incline: 12% · Speed: 4.8 km/h · Duration: 30 mins. Torches 300+ kcal without joint impact.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">2. Tabata Spin Bike Intervals</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-orange-400 text-[10px] font-bold">HIIT</span>
                </div>
                <p className="text-zinc-400 text-[11px] mt-1">
                  8 rounds of 20 seconds maximum resistance pedal sprint + 10 seconds slow recovery pedal.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white">3. Stairmaster Metabolic Climber</span>
                  <span className="px-2 py-0.5 rounded bg-zinc-800 text-red-400 text-[10px] font-bold">Glutes & Cardio</span>
                </div>
                <p className="text-zinc-400 text-[11px] mt-1">
                  Level 7-9 for 20 minutes continuous. Skip a step every 2 minutes for intense glute contraction.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. FAT LOSS FEATURE VIEW                                 */}
      {/* ========================================================= */}
      {activeTab === 'fat_loss' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          {/* Caloric Deficit Calculator Card */}
          <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                <Target className="w-4 h-4 text-[#B7F34A]" />
                <span>Fat Loss Calorie Deficit</span>
              </div>
              <span className="text-[10px] font-bold text-[#B7F34A]">500 kcal Deficit</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Current Weight (kg)</label>
                <input
                  type="number"
                  value={currentWeight}
                  onChange={(e) => setCurrentWeight(parseFloat(e.target.value) || 70)}
                  className="w-full h-9 px-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Goal Weight (kg)</label>
                <input
                  type="number"
                  value={targetWeight}
                  onChange={(e) => setTargetWeight(parseFloat(e.target.value) || 65)}
                  className="w-full h-9 px-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold"
                />
              </div>
            </div>

            {/* Results Display */}
            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800/90 grid grid-cols-2 gap-3 text-center">
              <div>
                <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Maintenance TDEE</span>
                <span className="text-lg font-black text-white tabular-nums">
                  {maintenanceCalories} <span className="text-[10px] font-normal text-zinc-400">kcal</span>
                </span>
              </div>

              <div>
                <span className="text-[10px] uppercase font-semibold text-zinc-400 block">Daily Target To Shred</span>
                <span className="text-lg font-black text-[#B7F34A] tabular-nums">
                  {fatLossCalories} <span className="text-[10px] font-normal text-zinc-400">kcal</span>
                </span>
              </div>
            </div>

            <p className="text-[11px] text-zinc-400">
              Target deficit will safely burn <strong className="text-white">0.5 kg - 0.75 kg</strong> of pure fat per week without losing muscle.
            </p>
          </div>

          {/* 4-Week Fat Loss Blueprint */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1 block">
              4-Week Fat Loss Roadmap
            </span>

            <div className="space-y-2 text-xs">
              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">Week 1-2: Water Weight & Metabolic Kickstart</span>
                  <span className="text-[10px] text-[#B7F34A] font-bold">Phase 1</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Eliminate added sugars and refined flour. Minimum 10,000 steps daily + 20 mins post-workout incline walk.
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-bold text-white">Week 3-4: Accelerated Thermogenesis</span>
                  <span className="text-[10px] text-orange-400 font-bold">Phase 2</span>
                </div>
                <p className="text-zinc-400 text-[11px] leading-relaxed">
                  Introduce 2 fasting morning cardio sessions (Wednesday & Saturday). Keep protein high at 2g per kg bodyweight.
                </p>
              </div>
            </div>
          </div>

          {/* Golden Rules for Fat Loss */}
          <div className="p-4 rounded-3xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 text-xs">
            <span className="font-bold uppercase tracking-wider text-white block text-[11px]">
              Iron Paradise Fat Loss Commandments
            </span>

            <div className="space-y-1.5 text-zinc-300 text-[11px]">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A] shrink-0 mt-0.5" />
                <span>Eat 25g-30g protein with every single meal to preserve lean muscle.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A] shrink-0 mt-0.5" />
                <span>Never drink your calories — avoid sodas, packed juices, and sweetened teas.</span>
              </div>
              <div className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#B7F34A] shrink-0 mt-0.5" />
                <span>Lift heavy weights — progressive overload is what keeps muscle while burning fat.</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 3. DIET PLAN FEATURE VIEW                                 */}
      {/* ========================================================= */}
      {activeTab === 'diet_plan' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          {/* Diet Preference Selector */}
          <div className="flex gap-1.5 p-1 bg-zinc-900 border border-zinc-800 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setDietPreference('non_veg')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                dietPreference === 'non_veg'
                  ? 'bg-zinc-800 text-[#B7F34A] font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Non-Veg Lean
            </button>
            <button
              onClick={() => setDietPreference('veg')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                dietPreference === 'veg'
                  ? 'bg-zinc-800 text-[#B7F34A] font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Veg High-Protein
            </button>
            <button
              onClick={() => setDietPreference('heavy_bulk')}
              className={`flex-1 py-1.5 rounded-lg transition-colors ${
                dietPreference === 'heavy_bulk'
                  ? 'bg-zinc-800 text-[#B7F34A] font-bold'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Heavy Bulk
            </button>
          </div>

          {/* Interactive Hydration Tracker */}
          <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2 font-bold text-white">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span>Daily Water Intake Tracker</span>
              </div>
              <span className="font-mono text-blue-400 font-bold">
                {waterGlasses * 0.5}L / 4.0L Goal
              </span>
            </div>

            <div className="grid grid-cols-8 gap-1.5">
              {Array.from({ length: 8 }, (_, i) => i + 1).map((glass) => (
                <button
                  key={glass}
                  onClick={() => setWaterGlasses(glass === waterGlasses ? glass - 1 : glass)}
                  className={`h-9 rounded-lg flex items-center justify-center transition-all ${
                    glass <= waterGlasses
                      ? 'bg-blue-600 text-white shadow-sm'
                      : 'bg-zinc-950 text-zinc-600 hover:text-zinc-400'
                  }`}
                  title={`${glass * 500}ml`}
                >
                  <Droplets className="w-3.5 h-3.5" />
                </button>
              ))}
            </div>
            <p className="text-[10px] text-zinc-400">
              Tap glasses as you drink. Staying hydrated speeds up recovery and fat oxidation.
            </p>
          </div>

          {/* Meal-by-Meal Nutrition Sheet */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1 block">
              {dietPreference === 'non_veg'
                ? 'Non-Vegetarian Lean Shred Diet (2,100 kcal)'
                : dietPreference === 'veg'
                ? 'Indian Vegetarian High-Protein Diet (2,000 kcal)'
                : 'Heavy Bodybuilding Mass Diet (3,200 kcal)'}
            </span>

            {dietPreference === 'non_veg' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>🍳 Breakfast (08:00 AM)</span>
                    <span className="text-[#B7F34A]">32g Protein</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    4 Boiled Eggs (3 whites + 1 whole) + 40g Rolled Oats cooked with water/almond milk, topped with 6 almonds.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>🍗 Lunch (01:00 PM)</span>
                    <span className="text-[#B7F34A]">45g Protein</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    180g Grilled/Tandoori Chicken Breast + 1 cup Brown Rice + Yellow Dal + Raw Cucumber & Tomato Salad.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>☕ Pre-Workout (05:00 PM)</span>
                    <span className="text-[#B7F34A]">Energy Boost</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    1 Medium Banana + 1 Shot Black Espresso (zero sugar). Take 30 mins before gym session.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>🐟 Dinner (08:30 PM)</span>
                    <span className="text-[#B7F34A]">38g Protein</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    180g Grilled Fish (or Chicken Breast) + Sautéed Broccoli, Zucchini, and Bell Peppers with 1 tsp olive oil.
                  </p>
                </div>
              </div>
            )}

            {dietPreference === 'veg' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>🧀 Breakfast (08:00 AM)</span>
                    <span className="text-[#B7F34A]">28g Protein</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    100g Low-fat Paneer Bhurji / Tofu + 2 Whole Wheat Rotis + 1 bowl sprouted green moong.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>🌱 Lunch (01:00 PM)</span>
                    <span className="text-[#B7F34A]">38g Protein</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    60g Soya Chunks curry (in home tomato-onion gravy) + 1 cup Rice / Quinoa + 1 cup Curd (Dahi) + Green salad.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>🥜 Evening Snack (05:00 PM)</span>
                    <span className="text-[#B7F34A]">18g Protein</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    1 Scoop Whey / Plant Protein with cold water + 1 slice Brown Bread with Natural Peanut Butter.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>🥣 Dinner (08:30 PM)</span>
                    <span className="text-[#B7F34A]">26g Protein</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    120g Paneer or Tofu stir-fry with mushrooms & bell peppers + 1 bowl dense thick Dal soup.
                  </p>
                </div>
              </div>
            )}

            {dietPreference === 'heavy_bulk' && (
              <div className="space-y-2 text-xs">
                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>🍌 Bulking Mass Shake</span>
                    <span className="text-[#B7F34A]">650 kcal</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    1 Scoop Whey + 2 Bananas + 50g Oats + 2 tbsp Peanut Butter + 300ml Full Cream Milk blended.
                  </p>
                </div>

                <div className="p-3 rounded-2xl bg-zinc-900 border border-zinc-800">
                  <div className="flex justify-between font-bold text-white">
                    <span>🍚 High-Carb Lunch & Dinner</span>
                    <span className="text-[#B7F34A]">160g+ Protein</span>
                  </div>
                  <p className="text-zinc-400 text-[11px] mt-1">
                    250g Chicken/Paneer + 250g Rice or 4 Chapatis with ghee + 2 Boiled Potatoes for continuous glycogen replenishment.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* 4. BODYBUILDING FEATURE VIEW                             */}
      {/* ========================================================= */}
      {activeTab === 'bodybuilding' && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
          {/* 1RM Hypertrophy Calculator Card */}
          <div className="p-4 rounded-3xl bg-zinc-900 border border-zinc-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white">
                <Award className="w-4 h-4 text-[#B7F34A]" />
                <span>1-Rep Max & Hypertrophy Load</span>
              </div>
              <span className="text-[10px] font-mono text-[#B7F34A]">Brzycki Formula</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Lift Weight (kg)</label>
                <input
                  type="number"
                  value={liftWeight}
                  onChange={(e) => setLiftWeight(parseFloat(e.target.value) || 60)}
                  className="w-full h-9 px-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold"
                />
              </div>

              <div>
                <label className="text-[10px] text-zinc-400 block mb-1">Reps Performed</label>
                <input
                  type="number"
                  value={liftReps}
                  onChange={(e) => setLiftReps(parseInt(e.target.value, 10) || 1)}
                  className="w-full h-9 px-2.5 rounded-xl bg-zinc-950 border border-zinc-800 text-white font-bold"
                />
              </div>
            </div>

            <div className="p-3 rounded-2xl bg-zinc-950 border border-zinc-800 grid grid-cols-2 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-semibold">Estimated 1RM</span>
                <span className="text-xl font-black text-white tabular-nums">{oneRepMax} kg</span>
              </div>
              <div>
                <span className="text-[10px] uppercase text-zinc-400 block font-semibold">Hypertrophy (8-12 reps)</span>
                <span className="text-xl font-black text-[#B7F34A] tabular-nums">{hypertrophyWeight} kg</span>
              </div>
            </div>
          </div>

          {/* Push Pull Legs (PPL) Iron Paradise Muscle Split */}
          <div className="space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-zinc-400 px-1 block">
              Iron Paradise Classic PPL Split
            </span>

            {/* Push Day */}
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">DAY 1: PUSH (Chest, Shoulders, Triceps)</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-[#B7F34A] text-[10px] font-bold">Chest Focus</span>
              </div>
              <div className="space-y-1 text-zinc-300 text-[11px] pl-1">
                <div>• Incline Dumbbell Bench Press — 4 sets × 8-10 reps</div>
                <div>• Flat Barbell Bench Press — 4 sets × 6-8 reps</div>
                <div>• Standing Dumbbell Lateral Raises — 4 sets × 15-20 reps</div>
                <div>• Cable Rope Tricep Pushdowns — 4 sets × 12 reps</div>
              </div>
            </div>

            {/* Pull Day */}
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">DAY 2: PULL (Back, Rear Delts, Biceps)</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-blue-400 text-[10px] font-bold">Back Width</span>
              </div>
              <div className="space-y-1 text-zinc-300 text-[11px] pl-1">
                <div>• Conventional Deadlifts — 4 sets × 5-6 reps</div>
                <div>• Wide-Grip Lat Pulldowns — 4 sets × 10-12 reps</div>
                <div>• Seated Cable Rows (V-Bar) — 4 sets × 10 reps</div>
                <div>• Incline Dumbbell Bicep Curls — 4 sets × 10-12 reps</div>
              </div>
            </div>

            {/* Legs Day */}
            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-zinc-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-white">DAY 3: LEGS & CORE (Quads, Hamstrings)</span>
                <span className="px-2 py-0.5 rounded bg-zinc-800 text-orange-400 text-[10px] font-bold">Lower Body</span>
              </div>
              <div className="space-y-1 text-zinc-300 text-[11px] pl-1">
                <div>• Barbell Back Squats — 4 sets × 6-8 reps</div>
                <div>• Romanian Deadlifts (RDLs) — 4 sets × 10-12 reps</div>
                <div>• Leg Press (Heavy) — 4 sets × 12-15 reps</div>
                <div>• Standing Calf Raises — 5 sets × 15 reps</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
