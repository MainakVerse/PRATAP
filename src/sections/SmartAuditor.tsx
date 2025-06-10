'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Save, Search, RefreshCw, CheckCircle, AlertCircle } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.warn("Gemini API key is missing. Make sure to set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.");
}

const PromptAuditor = () => {
  const [promptText, setPromptText] = useState('');
  const [auditType, setAuditType] = useState('');
  const [focusArea, setFocusArea] = useState('');
  type AuditResult = {
    directness?: { score: number; explanation: string; suggestion: string };
    effectiveness?: { score: number; explanation: string; suggestion: string };
    context?: { score: number; explanation: string; suggestion: string };
    grammar?: { score: number; explanation: string; suggestion: string };
    overall_feedback?: string;
    error?: string;
  } | null;

  const [auditResults, setAuditResults] = useState<AuditResult>(null);

  type SavedAudit = {
    id: number;
    prompt: string;
    auditType: string;
    focusArea: string;
    overallScore: number;
    results: AuditResult;
    timestamp: string;
  };

  const [savedAudits, setSavedAudits] = useState<SavedAudit[]>([]);
  const [isAuditing, setIsAuditing] = useState(false);
  const [overallScore, setOverallScore] = useState(0);

  const auditTypes = [
    'General Purpose', 'Creative Writing', 'Technical Documentation', 
    'Educational Content', 'Business Communication', 'Research & Analysis',
    'Marketing Copy', 'Code Generation', 'Problem Solving', 'Data Analysis'
  ];

  const focusAreas = [
    'Clarity & Directness', 'Context Completeness', 'Grammar & Structure', 
    'Effectiveness & Results', 'Specificity & Detail', 'Actionability'
  ];

  // Load saved audits from session storage
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem('savedAudits') || '[]');
    setSavedAudits(saved);
  }, []);

  const auditPrompt = async () => {
    if (!promptText.trim() || !auditType || !focusArea) {
      alert('Please provide a prompt to audit and select audit parameters.');
      return;
    }

    if (!apiKey) {
      setAuditResults({
        error: 'Error: Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.'
      });
      return;
    }

    setIsAuditing(true);
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const auditPromptText = `Please audit the following prompt and provide scores (0-100) for each parameter. Be objective and constructive in your analysis.

PROMPT TO AUDIT:
"${promptText}"

AUDIT CONTEXT:
- Audit Type: ${auditType}
- Focus Area: ${focusArea}

Please analyze and score the prompt on these 4 parameters:

1. DIRECTNESS (0-100): How clear and direct is the prompt? Does it clearly state what is wanted?
2. EFFECTIVENESS (0-100): How likely is this prompt to produce the desired results?
3. CONTEXT (0-100): Does the prompt provide sufficient context and background information?
4. GRAMMAR (0-100): Is the prompt grammatically correct and well-structured?

For each parameter, provide:
- A score (0-100)
- A brief explanation (1-2 sentences)
- A specific improvement suggestion

IMPORTANT: Respond in this exact JSON format:
{
  "directness": {
    "score": [number 0-100],
    "explanation": "[brief explanation]",
    "suggestion": "[specific improvement suggestion]"
  },
  "effectiveness": {
    "score": [number 0-100],
    "explanation": "[brief explanation]",
    "suggestion": "[specific improvement suggestion]"
  },
  "context": {
    "score": [number 0-100],
    "explanation": "[brief explanation]",
    "suggestion": "[specific improvement suggestion]"
  },
  "grammar": {
    "score": [number 0-100],
    "explanation": "[brief explanation]",
    "suggestion": "[specific improvement suggestion]"
  },
  "overall_feedback": "[2-3 sentences of overall assessment and key recommendations]"
}`;

      const response = await model.generateContent(auditPromptText);
      const responseText = response.response.text().trim();
      
      // Extract JSON from response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Invalid response format from AI');
      }
      
      const auditData = JSON.parse(jsonMatch[0]);
      
      // Calculate overall score
      const overall = Math.round(
        (auditData.directness.score + auditData.effectiveness.score + 
         auditData.context.score + auditData.grammar.score) / 4
      );
      
      setOverallScore(overall);
      setAuditResults(auditData);
      
    } catch (error) {
      console.error('Error auditing prompt:', error);
      let errorMessage = 'Error auditing prompt. ';
      
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as Error).message === 'string') {
        const errMsg = (error as Error).message;
        if (errMsg.includes('API_KEY')) {
          errorMessage += 'Please check your Gemini API key.';
        } else if (errMsg.includes('quota') || errMsg.includes('limit')) {
          errorMessage += 'API quota exceeded. Please try again later.';
        } else if (errMsg.includes('network') || errMsg.includes('fetch')) {
          errorMessage += 'Network error. Please check your connection.';
        } else if (errMsg.includes('JSON') || errMsg.includes('format')) {
          errorMessage += 'Invalid response format. Please try again.';
        } else {
          errorMessage += 'Please try again later.';
        }
      } else {
        errorMessage += 'Please try again later.';
      }
      
      setAuditResults({ error: errorMessage });
    } finally {
      setIsAuditing(false);
    }
  };

  const saveAudit = () => {
    if (!auditResults || auditResults.error) return;
    
    const newSavedAudit = {
      id: Date.now(),
      prompt: promptText.substring(0, 100) + (promptText.length > 100 ? '...' : ''),
      auditType,
      focusArea,
      overallScore,
      results: auditResults,
      timestamp: new Date().toLocaleString()
    };
    
    const newSavedAudits = [...savedAudits, newSavedAudit];
    setSavedAudits(newSavedAudits);
    sessionStorage.setItem('savedAudits', JSON.stringify(newSavedAudits));
  };

  const deleteSavedAudit = (id: number) => {
    const filtered = savedAudits.filter(audit => audit.id !== id);
    setSavedAudits(filtered);
    sessionStorage.setItem('savedAudits', JSON.stringify(filtered));
  };

  const clearAllSaved = () => {
    setSavedAudits([]);
    sessionStorage.removeItem('savedAudits');
  };

  const resetForm = () => {
    setPromptText('');
    setAuditType('');
    setFocusArea('');
    setAuditResults(null);
    setOverallScore(0);
  };

  const copyResult = async (text: string | undefined) => {
    try {
      await navigator.clipboard.writeText(text ?? '');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const getScoreTextColor = (score: number) => {
    if (score >= 80) return 'text-green-400';
    if (score >= 60) return 'text-yellow-400';
    if (score >= 40) return 'text-orange-400';
    return 'text-red-400';
  };

  type ProgressBarProps = {
    label: string;
    score: number;
    explanation: string;
    suggestion: string;
  };

  const ProgressBar: React.FC<ProgressBarProps> = ({ label, score, explanation, suggestion }) => (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <span className="text-gray-300 font-medium">{label}</span>
        <span className={`font-bold ${getScoreTextColor(score)}`}>{score}/100</span>
      </div>
      <div className="w-full bg-gray-700 rounded-full h-3 mb-3">
        <div 
          className={`h-3 rounded-full transition-all duration-1000 ease-out ${getScoreColor(score)}`}
          style={{ width: `${score}%` }}
        ></div>
      </div>
      <div className="text-sm text-gray-400 mb-2">{explanation}</div>
      <div className="text-sm text-blue-300 italic">💡 {suggestion}</div>
    </div>
  );

  const selectStyles = "w-full p-3 bg-gray-900 text-green-400 border-2 border-green-500 rounded-lg focus:outline-none focus:border-blue-400 transition-all duration-300";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-400 via-purple-500 to-pink-600 bg-clip-text text-transparent mb-4">
            Audit Prompts
          </h1>
          <p className="text-gray-300 text-lg">Analyze and optimize your prompts with AI-powered insights</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-black/50 backdrop-blur-sm border-2 border-gradient-to-r from-blue-500 to-purple-500 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Search className="text-blue-400" size={24} />
                <h2 className="text-xl font-bold text-white">Audit Prompt</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Prompt to Audit</label>
                  <textarea
                    placeholder="Paste your prompt here for comprehensive analysis..."
                    value={promptText}
                    onChange={(e) => setPromptText(e.target.value)}
                    rows={6}
                    className="w-full p-3 bg-gray-900 text-white border-2 border-green-500 rounded-lg focus:outline-none focus:border-blue-400 transition-all duration-300 placeholder-gray-400 resize-none"
                  />
                  <div className="text-xs text-gray-400 mt-1">
                    {promptText.length} characters
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Audit Type</label>
                  <select
                    value={auditType}
                    onChange={(e) => setAuditType(e.target.value)}
                    className={selectStyles}
                  >
                    <option value="" disabled>Choose Audit Type</option>
                    {auditTypes.map((type) => (
                      <option key={type} value={type} className="bg-gray-900 text-green-400">
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Focus Area</label>
                  <select
                    value={focusArea}
                    onChange={(e) => setFocusArea(e.target.value)}
                    className={selectStyles}
                  >
                    <option value="" disabled>Choose Focus Area</option>
                    {focusAreas.map((area) => (
                      <option key={area} value={area} className="bg-gray-900 text-green-400">
                        {area}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={auditPrompt}
                    disabled={isAuditing}
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isAuditing ? (
                      <>
                        <RefreshCw className="animate-spin" size={16} />
                        Auditing...
                      </>
                    ) : (
                      <>
                        <Search size={16} />
                        Audit
                      </>
                    )}
                  </button>
                  
                  <button
                    onClick={resetForm}
                    className="bg-gray-700 text-white py-3 px-4 rounded-lg hover:bg-gray-600 transition-all duration-300"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Results Area */}
          <div className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur-sm border-2 border-purple-500 rounded-xl p-6 shadow-2xl h-full">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">Audit Results</h2>
                {auditResults && !auditResults.error && (
                  <div className="flex gap-2">
                    <button
                      onClick={saveAudit}
                      className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                      title="Save audit"
                    >
                      <Save size={20} />
                    </button>
                  </div>
                )}
              </div>
              
              <div className="h-96 overflow-y-auto pr-2">
                {!auditResults ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <Search size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Your audit results will appear here</p>
                      <p className="text-sm">Paste a prompt and click Audit to start</p>
                    </div>
                  </div>
                ) : auditResults.error ? (
                  <div className="flex items-center justify-center h-full text-red-400">
                    <div className="text-center">
                      <AlertCircle size={48} className="mx-auto mb-4" />
                      <p className="text-lg">{auditResults.error}</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="bg-gray-800/80 border border-gray-600 rounded-lg p-6 text-center">
                      <h3 className="text-xl font-bold text-white mb-4">Overall Score</h3>
                      <div className={`text-4xl font-bold mb-2 ${getScoreTextColor(overallScore)}`}>
                        {overallScore}/100
                      </div>
                      <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                        <div 
                          className={`h-4 rounded-full transition-all duration-1000 ease-out ${getScoreColor(overallScore)}`}
                          style={{ width: `${overallScore}%` }}
                        ></div>
                      </div>
                      {overallScore >= 80 && <CheckCircle className="mx-auto text-green-400" size={24} />}
                    </div>

                    {/* Individual Scores */}
                    <div className="bg-gray-800/80 border border-gray-600 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-6">Detailed Analysis</h3>
                      
                      <ProgressBar 
                        label="Directness" 
                        score={auditResults.directness?.score ?? 0}
                        explanation={auditResults.directness?.explanation ?? ''}
                        suggestion={auditResults.directness?.suggestion ?? ''}
                      />
                      
                      <ProgressBar 
                        label="Effectiveness" 
                        score={auditResults.effectiveness?.score ?? 0}
                        explanation={auditResults.effectiveness?.explanation ?? ''}
                        suggestion={auditResults.effectiveness?.suggestion ?? ''}
                      />
                      
                      <ProgressBar 
                        label="Context" 
                        score={auditResults.context?.score ?? 0}
                        explanation={auditResults.context?.explanation ?? ''}
                        suggestion={auditResults.context?.suggestion ?? ''}
                      />
                      
                      <ProgressBar 
                        label="Grammar" 
                        score={auditResults.grammar?.score ?? 0}
                        explanation={auditResults.grammar?.explanation ?? ''}
                        suggestion={auditResults.grammar?.suggestion ?? ''}
                      />
                    </div>

                    {/* Overall Feedback */}
                    <div className="bg-gray-800/80 border border-gray-600 rounded-lg p-6">
                      <h3 className="text-lg font-bold text-white mb-4">Overall Feedback</h3>
                      <p className="text-gray-300 leading-relaxed">{auditResults.overall_feedback}</p>
                      <button
                        onClick={() => copyResult(auditResults.overall_feedback)}
                        className="mt-3 text-green-400 hover:text-green-300 transition-colors duration-200 flex items-center gap-1"
                      >
                        <Copy size={14} /> Copy Feedback
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Saved Audits Panel */}
          <div className="lg:col-span-1">
            <div className="bg-black/50 backdrop-blur-sm border-2 border-pink-500 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Saved Audits</h2>
                {savedAudits.length > 0 && (
                  <button
                    onClick={clearAllSaved}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    title="Clear all saved audits"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-3 h-96 overflow-y-auto pr-2">
                {savedAudits.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Save size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No saved audits yet</p>
                  </div>
                ) : (
                  savedAudits.map((audit) => (
                    <div key={audit.id} className="bg-gray-800/60 border border-gray-600 rounded-lg p-3 group hover:border-pink-400 transition-all duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs text-pink-400 font-medium">{audit.auditType}</div>
                        <div className="flex gap-1">
                          <div className={`text-sm font-bold ${getScoreTextColor(audit.overallScore)}`}>
                            {audit.overallScore}%
                          </div>
                          <button
                            onClick={() => deleteSavedAudit(audit.id)}
                            className="text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                            title="Delete audit"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mb-1">{audit.focusArea}</div>
                      <p className="text-gray-300 text-xs leading-relaxed line-clamp-2 mb-2">{audit.prompt}</p>
                      <div className="text-xs text-gray-500">{audit.timestamp}</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PromptAuditor;