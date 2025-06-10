'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Trash2, Save, Sparkles, RefreshCw } from 'lucide-react';
import { GoogleGenerativeAI } from '@google/generative-ai';

const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
if (!apiKey) {
  console.warn("Gemini API key is missing. Make sure to set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.");
}

const PromptGenerator = () => {
  const [topic, setTopic] = useState('');
  const [category, setCategory] = useState('');
  const [tone, setTone] = useState('');
  const [complexity, setComplexity] = useState('');
  const [generatedPrompts, setGeneratedPrompts] = useState<string[]>([]);
  type SavedPrompt = {
    id: number;
    prompt: string;
    topic: string;
    category: string;
    timestamp: string;
  };
  const [savedPrompts, setSavedPrompts] = useState<SavedPrompt[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(-1);

  const categories = [
    'Creative Writing', 'Business Strategy', 'Education & Learning', 
    'Problem Solving', 'Content Creation', 'Research & Analysis',
    'Personal Development', 'Technology', 'Marketing', 'Art & Design'
  ];

  const tones = [
    'Professional', 'Casual', 'Creative', 'Analytical', 
    'Persuasive', 'Informative', 'Inspirational', 'Conversational'
  ];

  const complexityLevels = [
    'Beginner', 'Intermediate', 'Advanced', 'Expert'
  ];

  // Load saved prompts from memory on component mount
  useEffect(() => {
    const saved = JSON.parse(sessionStorage.getItem('savedPrompts') || '[]');
    setSavedPrompts(saved);
  }, []);

  const generatePrompts = async () => {
    if (!topic || !category || !tone || !complexity) {
      alert('Please fill in all fields to generate prompts.');
      return;
    }

    if (!apiKey) {
      setGeneratedPrompts(['Error: Gemini API key is missing. Please set NEXT_PUBLIC_GEMINI_API_KEY in your environment variables.']);
      return;
    }

    setIsGenerating(true);
    
    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      // Create three different prompt generation requests
      const promptRequests = [
        {
          type: "Comprehensive Guide",
          instruction: `Generate a detailed, ${tone.toLowerCase()} prompt for creating comprehensive content about "${topic}" in the ${category.toLowerCase()} field. The prompt should be designed for ${complexity.toLowerCase()} level users and should encourage detailed, actionable responses with examples and step-by-step guidance. Make the prompt clear, specific, and engaging.`
        },
        {
          type: "Analytical Approach", 
          instruction: `Create a ${tone.toLowerCase()} analytical prompt about "${topic}" for ${category.toLowerCase()}. This prompt should encourage deep analysis, critical thinking, and multiple perspectives. It should be suitable for ${complexity.toLowerCase()} level understanding and should ask for evidence-based insights, comparisons, and practical applications.`
        },
        {
          type: "Creative Framework",
          instruction: `Design a ${tone.toLowerCase()} creative prompt focusing on "${topic}" within ${category.toLowerCase()}. The prompt should encourage innovative thinking, problem-solving approaches, and creative solutions. Make it appropriate for ${complexity.toLowerCase()} level users and include requests for examples, case studies, and actionable frameworks.`
        }
      ];

      // Generate all three prompts concurrently
      const promptPromises = promptRequests.map(async (request) => {
        const fullPrompt = `${request.instruction}

IMPORTANT GUIDELINES:
- The generated prompt should be 2-3 sentences long and very specific
- It should clearly define what kind of response is expected
- Include specific elements like examples, steps, or frameworks to be included
- Make it engaging and actionable
- The prompt should be ready to use as-is for any AI assistant
- Focus on the topic: "${topic}"
- Category context: ${category.toLowerCase()}
- Tone: ${tone.toLowerCase()}
- Complexity: ${complexity.toLowerCase()}

Generate only the prompt itself, nothing else.`;

        const response = await model.generateContent(fullPrompt);
        return response.response.text().trim();
      });

      const generatedPrompts = await Promise.all(promptPromises);
      setGeneratedPrompts(generatedPrompts);
      
    } catch (error) {
      console.error('Error generating prompts:', error);
      let errorMessage = 'Error generating prompts. ';
      
      if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as { message: string }).message === 'string') {
        let message = '';
        if (typeof error === 'object' && error !== null && 'message' in error && typeof (error as Error).message === 'string') {
          message = (error as Error).message;
        }
        if (message.includes('API_KEY')) {
          errorMessage += 'Please check your Gemini API key.';
        } else if (message.includes('quota') || message.includes('limit')) {
          errorMessage += 'API quota exceeded. Please try again later.';
        } else if (message.includes('network') || message.includes('fetch')) {
          errorMessage += 'Network error. Please check your connection.';
        } else {
          errorMessage += 'Please try again later.';
        }
      } else {
        errorMessage += 'Please try again later.';
      }
      
      setGeneratedPrompts([errorMessage]);
    } finally {
      setIsGenerating(false);
    }
  };

  const copyPrompt = async (prompt: string, index: React.SetStateAction<number>) => {
    try {
      await navigator.clipboard.writeText(prompt);
      setCopiedIndex(index);
      setTimeout(() => setCopiedIndex(-1), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  const savePrompt = (prompt: string) => {
    const newSavedPrompts = [...savedPrompts, { 
      id: Date.now(), 
      prompt, 
      topic,
      category,
      timestamp: new Date().toLocaleString()
    }];
    setSavedPrompts(newSavedPrompts);
    sessionStorage.setItem('savedPrompts', JSON.stringify(newSavedPrompts));
  };

  const deleteSavedPrompt = (id: number) => {
    const filtered = savedPrompts.filter(p => p.id !== id);
    setSavedPrompts(filtered);
    sessionStorage.setItem('savedPrompts', JSON.stringify(filtered));
  };

  const clearAllSaved = () => {
    setSavedPrompts([]);
    sessionStorage.removeItem('savedPrompts');
  };

  const resetForm = () => {
    setTopic('');
    setCategory('');
    setTone('');
    setComplexity('');
    setGeneratedPrompts([]);
  };

  const selectStyles = "w-full p-3 bg-gray-900 text-green-400 border-2 border-green-500 rounded-lg focus:outline-none focus:border-blue-400 transition-all duration-300";
  const inputStyles = "w-full p-3 bg-gray-900 text-white border-2 border-green-500 rounded-lg focus:outline-none focus:border-blue-400 transition-all duration-300 placeholder-gray-400";

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-800 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 bg-clip-text text-transparent mb-4 pb-4">
            Generate Prompt
          </h1>
          <p className="text-gray-300 text-lg">Generate intelligent prompts for any topic or purpose</p>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Input Panel */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-black/50 backdrop-blur-sm border-2 border-gradient-to-r from-green-500 to-blue-500 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center gap-2 mb-6">
                <Sparkles className="text-yellow-400" size={24} />
                <h2 className="text-xl font-bold text-white">Generate Prompts</h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Topic or Subject</label>
                  <input
                    type="text"
                    placeholder="Enter your topic (e.g., Machine Learning, Creative Writing)"
                    value={topic}
                    onChange={(e) => setTopic(e.target.value)}
                    className={inputStyles}
                  />
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className={selectStyles}
                  >
                    <option value="" disabled>Choose Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-gray-900 text-green-400">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Tone</label>
                  <select
                    value={tone}
                    onChange={(e) => setTone(e.target.value)}
                    className={selectStyles}
                  >
                    <option value="" disabled>Choose Tone</option>
                    {tones.map((t) => (
                      <option key={t} value={t} className="bg-gray-900 text-green-400">
                        {t}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2 font-medium">Complexity Level</label>
                  <select
                    value={complexity}
                    onChange={(e) => setComplexity(e.target.value)}
                    className={selectStyles}
                  >
                    <option value="" disabled>Choose Complexity</option>
                    {complexityLevels.map((level) => (
                      <option key={level} value={level} className="bg-gray-900 text-green-400">
                        {level}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="flex gap-2 pt-4">
                  <button
                    onClick={generatePrompts}
                    disabled={isGenerating}
                    className="flex-1 bg-gradient-to-r from-green-500 to-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-green-600 hover:to-blue-700 transition-all duration-300 disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {isGenerating ? (
                      <>
                        <RefreshCw className="animate-spin" size={16} />
                        Generating...
                      </>
                    ) : (
                      <>
                        <Sparkles size={16} />
                        Generate
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

          {/* Process Area - Generated Prompts */}
          <div className="lg:col-span-2">
            <div className="bg-black/50 backdrop-blur-sm border-2 border-blue-500 rounded-xl p-6 shadow-2xl h-full">
              <h2 className="text-2xl font-bold text-white mb-6 text-center">Generated Prompts</h2>
              
              <div className="space-y-4 h-96 overflow-y-auto pr-2">
                {generatedPrompts.length === 0 ? (
                  <div className="flex items-center justify-center h-full text-gray-400">
                    <div className="text-center">
                      <Sparkles size={48} className="mx-auto mb-4 opacity-50" />
                      <p className="text-lg">Your generated prompts will appear here</p>
                      <p className="text-sm">Fill in the form and click Generate to start</p>
                    </div>
                  </div>
                ) : (
                  generatedPrompts.map((prompt, index) => (
                    <div key={index} className="bg-gray-800/80 border border-gray-600 rounded-lg p-4 hover:border-blue-400 transition-all duration-300">
                      <div className="flex justify-between items-start mb-3">
                        <span className="text-blue-400 font-semibold text-sm">Prompt {index + 1}</span>
                        <div className="flex gap-2">
                          <button
                            onClick={() => savePrompt(prompt)}
                            className="text-yellow-400 hover:text-yellow-300 transition-colors duration-200"
                            title="Save prompt"
                          >
                            <Save size={16} />
                          </button>
                          <button
                            onClick={() => copyPrompt(prompt, index)}
                            className="text-green-400 hover:text-green-300 transition-colors duration-200"
                            title="Copy prompt"
                          >
                            <Copy size={16} />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-200 leading-relaxed text-sm">{prompt}</p>
                      {copiedIndex === index && (
                        <div className="text-green-400 text-xs mt-2 font-medium">✓ Copied to clipboard!</div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Saved Prompts Panel */}
          <div className="lg:col-span-1">
            <div className="bg-black/50 backdrop-blur-sm border-2 border-purple-500 rounded-xl p-6 shadow-2xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-white">Saved Prompts</h2>
                {savedPrompts.length > 0 && (
                  <button
                    onClick={clearAllSaved}
                    className="text-red-400 hover:text-red-300 transition-colors duration-200"
                    title="Clear all saved prompts"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>

              <div className="space-y-3 h-96 overflow-y-auto pr-2">
                {savedPrompts.length === 0 ? (
                  <div className="text-center text-gray-400 py-8">
                    <Save size={32} className="mx-auto mb-3 opacity-50" />
                    <p className="text-sm">No saved prompts yet</p>
                  </div>
                ) : (
                  savedPrompts.map((saved) => (
                    <div key={saved.id} className="bg-gray-800/60 border border-gray-600 rounded-lg p-3 group hover:border-purple-400 transition-all duration-300">
                      <div className="flex justify-between items-start mb-2">
                        <div className="text-xs text-purple-400 font-medium">{saved.category}</div>
                        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <button
                            onClick={() => copyPrompt(saved.prompt, -1)}
                            className="text-green-400 hover:text-green-300"
                            title="Copy prompt"
                          >
                            <Copy size={12} />
                          </button>
                          <button
                            onClick={() => deleteSavedPrompt(saved.id)}
                            className="text-red-400 hover:text-red-300"
                            title="Delete prompt"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                      <div className="text-xs text-gray-400 mb-1">{saved.topic}</div>
                      <p className="text-gray-300 text-xs leading-relaxed line-clamp-3">{saved.prompt}</p>
                      <div className="text-xs text-gray-500 mt-2">{saved.timestamp}</div>
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

export default PromptGenerator;