import React, { useState, useMemo } from 'react';
import { ClipboardCheck, ChevronRight, ChevronLeft, Download, RefreshCw, CheckCircle2, AlertCircle } from 'lucide-react';
import { PageHero } from '@/components/shared/PageHero';
import { GlassCard } from '@/components/ui/glass-card';
import { ModernButton } from '@/components/ui/modern-button';
import { Progress } from '@/components/ui/progress';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import {
  assessmentQuestions,
  assessmentCategories,
  getMaxScore,
  getCategoryScore,
  getMaturityLevel,
  type AssessmentQuestion,
} from '@/data/fsu-assessment-questions';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Cell } from 'recharts';

const FSUSelfAssessment: React.FC = () => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const currentQuestion = assessmentQuestions[currentQuestionIndex];
  const totalQuestions = assessmentQuestions.length;
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / totalQuestions) * 100;

  // Calcul du score total
  const totalResult = useMemo(() => {
    const maxScore = getMaxScore();
    const score = assessmentQuestions.reduce((sum, q) => sum + (answers[q.id] || 0) * q.weight, 0);
    const percentage = maxScore > 0 ? (score / maxScore) * 100 : 0;
    return { score, maxScore, percentage };
  }, [answers]);

  // Scores par catégorie
  const categoryResults = useMemo(() => {
    return assessmentCategories.map((cat) => {
      const result = getCategoryScore(answers, cat.key);
      return { ...cat, ...result };
    });
  }, [answers]);

  // Données pour le graphique radar
  const radarData = useMemo(() => {
    return categoryResults.map((cat) => ({
      category: cat.name,
      score: cat.percentage,
      fullMark: 100,
    }));
  }, [categoryResults]);

  // Niveau de maturité
  const maturityLevel = useMemo(() => {
    return getMaturityLevel(totalResult.percentage);
  }, [totalResult.percentage]);

  // Recommandations prioritaires
  const priorityRecommendations = useMemo(() => {
    const lowScoreQuestions = assessmentQuestions
      .map((q) => ({
        ...q,
        score: answers[q.id] || 0,
        maxScore: 4,
      }))
      .filter((q) => q.score < 2)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 5);

    return lowScoreQuestions;
  }, [answers]);

  const handleAnswer = (value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: parseInt(value),
    }));
  };

  const goToNext = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowResults(true);
    }
  };

  const goToPrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const resetAssessment = () => {
    setAnswers({});
    setCurrentQuestionIndex(0);
    setShowResults(false);
  };

  const exportResults = () => {
    const report = {
      date: new Date().toISOString(),
      overallScore: totalResult,
      maturityLevel: maturityLevel,
      categoryScores: categoryResults.map((cat) => ({
        category: cat.name,
        score: cat.score.toFixed(1),
        maxScore: cat.max.toFixed(1),
        percentage: cat.percentage.toFixed(1),
      })),
      answers: assessmentQuestions.map((q) => ({
        question: q.question,
        category: q.category,
        answer: answers[q.id] ?? 'Non répondu',
        maxScore: 4,
      })),
      priorityRecommendations: priorityRecommendations.map((q) => ({
        area: q.category,
        recommendation: q.recommendation,
        bestPractices: q.bestPractices,
      })),
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fsu-self-assessment-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Affichage des résultats
  if (showResults) {
    return (
      <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
        <div className="container mx-auto px-4 py-8 space-y-8">
          <PageHero
            badge="Résultats"
            badgeIcon={ClipboardCheck}
            title="Résultats de l'Auto-évaluation FSU"
            subtitle="Votre niveau de maturité et recommandations personnalisées"
          />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Score global */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Score Global</h2>
              <div className="text-center py-6">
                <div
                  className="inline-flex items-center justify-center w-32 h-32 rounded-full border-4"
                  style={{ borderColor: maturityLevel.color }}
                >
                  <span className="text-4xl font-bold text-white">
                    {totalResult.percentage.toFixed(0)}%
                  </span>
                </div>
                <p
                  className="mt-4 text-xl font-semibold"
                  style={{ color: maturityLevel.color }}
                >
                  {maturityLevel.level}
                </p>
                <p className="text-white/60 text-sm mt-2">{maturityLevel.description}</p>
              </div>
              <div className="flex gap-2 mt-4">
                <ModernButton variant="outline" size="sm" onClick={resetAssessment} className="flex-1">
                  <RefreshCw className="w-4 h-4 mr-1" /> Recommencer
                </ModernButton>
                <ModernButton size="sm" onClick={exportResults} className="flex-1">
                  <Download className="w-4 h-4 mr-1" /> Exporter
                </ModernButton>
              </div>
            </GlassCard>

            {/* Graphique radar */}
            <GlassCard className="p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-4">Profil de Maturité</h2>
              <ResponsiveContainer width="100%" height={300}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis
                    dataKey="category"
                    tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 12 }}
                  />
                  <PolarRadiusAxis
                    angle={30}
                    domain={[0, 100]}
                    tick={{ fill: 'rgba(255,255,255,0.5)' }}
                  />
                  <Radar
                    name="Score"
                    dataKey="score"
                    stroke="hsl(var(--nx-gold))"
                    fill="hsl(var(--nx-gold))"
                    fillOpacity={0.3}
                    strokeWidth={2}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Scores par catégorie */}
            <GlassCard className="p-6 lg:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-4">Scores par Dimension</h2>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={categoryResults} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                  <XAxis type="number" domain={[0, 100]} stroke="rgba(255,255,255,0.5)" />
                  <YAxis
                    type="category"
                    dataKey="name"
                    stroke="rgba(255,255,255,0.5)"
                    width={120}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--nx-night))',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                    formatter={(value: number) => `${value.toFixed(1)}%`}
                  />
                  <Bar dataKey="percentage" name="Score">
                    {categoryResults.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.percentage >= 60 ? 'hsl(var(--success))' : entry.percentage >= 40 ? 'hsl(var(--warning))' : 'hsl(var(--destructive))'}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </GlassCard>

            {/* Recommandations prioritaires */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-[hsl(var(--warning))]" />
                Actions Prioritaires
              </h2>
              <div className="space-y-4">
                {priorityRecommendations.length === 0 ? (
                  <div className="flex items-center gap-2 text-[hsl(var(--success))]">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Excellent! Aucune action urgente identifiée.</span>
                  </div>
                ) : (
                  priorityRecommendations.map((rec, index) => (
                    <div
                      key={rec.id}
                      className="p-3 bg-white/5 rounded-lg border border-white/10"
                    >
                      <div className="flex items-start gap-2">
                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[hsl(var(--warning)/0.2)] text-[hsl(var(--warning))] flex items-center justify-center text-sm font-medium">
                          {index + 1}
                        </span>
                        <div>
                          <p className="text-[hsl(var(--nx-gold))] text-sm">{rec.category}</p>
                          <p className="text-white/80 text-sm mt-1">{rec.recommendation}</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </GlassCard>

            {/* Bonnes pratiques */}
            <GlassCard className="p-6 lg:col-span-3">
              <h2 className="text-lg font-semibold text-white mb-4">📚 Bonnes Pratiques à Explorer</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {priorityRecommendations.slice(0, 3).map((rec) => (
                  <div key={rec.id} className="p-4 bg-white/5 rounded-lg">
                    <h3 className="text-[hsl(var(--nx-cyan))] font-medium mb-2">{rec.category}</h3>
                    <ul className="space-y-1">
                      {rec.bestPractices.map((practice, i) => (
                        <li key={i} className="text-white/70 text-sm flex items-start gap-2">
                          <span className="text-[hsl(var(--nx-gold))]">•</span>
                          {practice}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    );
  }

  // Questionnaire
  return (
    <div className="min-h-screen bg-[hsl(var(--nx-bg))]">
      <div className="container mx-auto px-4 py-8 space-y-8">
        <PageHero
          badge="Auto-évaluation FSU"
          badgeIcon={ClipboardCheck}
          title="Évaluez la Maturité de votre FSU"
          subtitle="Basé sur les 11 recommandations GSMA/UAT pour les Fonds du Service Universel"
        />

        <div className="max-w-3xl mx-auto">
          {/* Barre de progression */}
          <GlassCard className="p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/60 text-sm">
                Question {currentQuestionIndex + 1} sur {totalQuestions}
              </span>
              <span className="text-white/60 text-sm">
                {answeredCount} répondu{answeredCount > 1 ? 's' : ''}
              </span>
            </div>
            <Progress value={progressPercent} className="h-2" />
            <div className="flex gap-1 mt-3 overflow-x-auto">
              {assessmentCategories.map((cat) => {
                const catQuestions = assessmentQuestions.filter((q) => q.categoryKey === cat.key);
                const catAnswered = catQuestions.filter((q) => answers[q.id] !== undefined).length;
                const isCurrent = currentQuestion.categoryKey === cat.key;
                return (
                  <div
                    key={cat.key}
                    className={`px-2 py-1 rounded text-xs whitespace-nowrap ${
                      isCurrent
                        ? 'bg-[hsl(var(--nx-gold))] text-black'
                        : catAnswered === catQuestions.length
                        ? 'bg-[hsl(var(--success)/0.2)] text-[hsl(var(--success))]'
                        : 'bg-white/10 text-white/60'
                    }`}
                  >
                    {cat.name} ({catAnswered}/{catQuestions.length})
                  </div>
                );
              })}
            </div>
          </GlassCard>

          {/* Question actuelle */}
          <GlassCard className="p-6">
            <div className="mb-6">
              <span className="inline-block px-3 py-1 rounded-full bg-[hsl(var(--nx-gold)/0.2)] text-[hsl(var(--nx-gold))] text-sm mb-3">
                {currentQuestion.category}
              </span>
              <h2 className="text-xl font-semibold text-white mb-2">{currentQuestion.question}</h2>
              <p className="text-white/50 text-sm italic">
                💡 {currentQuestion.recommendation}
              </p>
            </div>

            <RadioGroup
              value={answers[currentQuestion.id]?.toString() || ''}
              onValueChange={handleAnswer}
              className="space-y-3"
            >
              {currentQuestion.options.map((option) => (
                <div
                  key={option.value}
                  className={`flex items-start space-x-3 p-4 rounded-lg border transition-all cursor-pointer ${
                    answers[currentQuestion.id] === option.value
                      ? 'bg-[hsl(var(--nx-gold)/0.1)] border-[hsl(var(--nx-gold)/0.3)]'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  onClick={() => handleAnswer(option.value.toString())}
                >
                  <RadioGroupItem
                    value={option.value.toString()}
                    id={`option-${option.value}`}
                    className="mt-1"
                  />
                  <div className="flex-1">
                    <Label
                      htmlFor={`option-${option.value}`}
                      className="text-white font-medium cursor-pointer"
                    >
                      {option.label}
                    </Label>
                    <p className="text-white/50 text-sm mt-1">{option.description}</p>
                  </div>
                  <span className="text-white/30 text-sm">{option.value}/4</span>
                </div>
              ))}
            </RadioGroup>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-white/10">
              <ModernButton
                variant="ghost"
                onClick={goToPrevious}
                disabled={currentQuestionIndex === 0}
              >
                <ChevronLeft className="w-4 h-4 mr-1" /> Précédent
              </ModernButton>

              <ModernButton onClick={goToNext}>
                {currentQuestionIndex === totalQuestions - 1 ? (
                  <>
                    Voir les résultats <CheckCircle2 className="w-4 h-4 ml-1" />
                  </>
                ) : (
                  <>
                    Suivant <ChevronRight className="w-4 h-4 ml-1" />
                  </>
                )}
              </ModernButton>
            </div>
          </GlassCard>

          {/* Bonnes pratiques pour la question actuelle */}
          <GlassCard className="p-4 mt-4">
            <h3 className="text-[hsl(var(--nx-cyan))] font-medium mb-2 text-sm">
              💡 Bonnes pratiques pour cette dimension
            </h3>
            <ul className="space-y-1">
              {currentQuestion.bestPractices.map((practice, i) => (
                <li key={i} className="text-white/60 text-sm flex items-start gap-2">
                  <span className="text-[hsl(var(--nx-gold))]">•</span>
                  {practice}
                </li>
              ))}
            </ul>
          </GlassCard>
        </div>
      </div>
    </div>
  );
};

export default FSUSelfAssessment;
