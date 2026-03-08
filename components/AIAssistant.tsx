import React, { useState } from 'react';
import { Sparkles, Loader2, Lightbulb, PenTool, MessageSquare, Zap, Target } from 'lucide-react';
import { generatePostContent, generateContentIdeas } from '../services/geminiService';
import { createPredisDesign } from '../services/predisService';
import PredisModal from './PredisModal';

type AITool = 'knockout' | 'generator' | 'strategy';

export const AIAssistant: React.FC = () => {
    const [activeTool, setActiveTool] = useState<AITool>('knockout');

    // State for generators
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('Instagram');
    const [tone, setTone] = useState('Professional');
    const [result, setResult] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [niche, setNiche] = useState('');
    const [ideas, setIdeas] = useState<string[]>([]);
    const [knockoutResults, setKnockoutResults] = useState<string[]>([]);
    const [predisResult, setPredisResult] = useState<any | null>(null);
    const [predisOpen, setPredisOpen] = useState(false);

    const handleGeneratePost = async () => {
        if (!topic) return;
        setIsLoading(true);
        const content = await generatePostContent(topic, platform, tone);
        setResult(content);
        setIsLoading(false);
    };

    const handleGenerateIdeas = async () => {
        if (!niche) return;
        setIsLoading(true);
        const generatedIdeas = await generateContentIdeas(niche);
        setIdeas(generatedIdeas);
        setIsLoading(false);
    }

    const renderSidebarItem = (id: AITool, label: string, icon: any, desc: string) => {
        const Icon = icon;
        return (
            <button
                onClick={() => setActiveTool(id)}
                className={`w-full text-left p-4 rounded-xl border transition-all mb-3 flex items-start gap-3 group ${activeTool === id
                        ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-200'
                        : 'bg-white border-slate-200 text-slate-600 hover:border-indigo-300 hover:bg-slate-50'
                    }`}
            >
                <div className={`p-2 rounded-lg ${activeTool === id ? 'bg-indigo-500/50' : 'bg-slate-100 group-hover:bg-white'} transition-colors`}>
                    <Icon size={20} />
                </div>
                <div>
                    <h3 className={`font-bold text-sm ${activeTool === id ? 'text-white' : 'text-slate-900'}`}>{label}</h3>
                    <p className={`text-xs mt-0.5 ${activeTool === id ? 'text-indigo-100' : 'text-slate-500'}`}>{desc}</p>
                </div>
            </button>
        );
    }

    const handleKnockout = async () => {
        if (!niche) return;
        setIsLoading(true);
        // Generate ideas then full posts
        const generatedIdeas = await generateContentIdeas(niche);
        const posts: string[] = [];
        for (const idea of generatedIdeas) {
            const content = await generatePostContent(idea, 'Instagram', 'Witty');
            posts.push(content);
        }
        setKnockoutResults(posts);
        setIsLoading(false);
    };

    const handleExportToPredis = async (postText: string) => {
        try {
            const payload = { title: postText.slice(0, 80), body: postText };
            const res = await createPredisDesign(payload);
            setPredisResult(res);
            setPredisOpen(true);
        } catch (err: any) {
            setPredisResult({ error: err?.message || String(err) });
            setPredisOpen(true);
        }
    };
    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-purple-50 text-purple-700 text-xs font-bold rounded uppercase tracking-wider">Gemini 2.5 Powered</span>
                    </div>
                    <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                        <Sparkles className="text-indigo-600 fill-indigo-600" />
                        AI Studio
                    </h1>
                    <p className="text-slate-500 mt-1">Your dedicated intelligent creative suite.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                {/* AI Tools Sidebar */}
                <div className="lg:col-span-1">
                    <div className="space-y-2">
                        {renderSidebarItem('knockout', 'KnockOUT AI', Zap, 'One-click viral content')}
                        {renderSidebarItem('generator', 'Post Generator', PenTool, 'Multi-platform composer')}
                        {renderSidebarItem('strategy', 'Strategy Assistant', Target, 'Plan your growth')}
                    </div>

                    <div className="mt-8 bg-gradient-to-br from-indigo-900 to-purple-900 rounded-xl p-6 text-white relative overflow-hidden">
                        <div className="relative z-10">
                            <h4 className="font-bold text-lg mb-2">Upgrade to Pro</h4>
                            <p className="text-indigo-200 text-xs mb-4">Get unlimited credits and faster generation speeds.</p>
                            <button className="w-full py-2 bg-white text-indigo-900 font-bold rounded-lg text-sm hover:bg-indigo-50 transition-colors">View Plans</button>
                        </div>
                        <Sparkles className="absolute -bottom-4 -right-4 text-white opacity-10" size={100} />
                    </div>
                </div>

                {/* Tool Workspace */}
                <div className="lg:col-span-3">
                    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden min-h-[600px] flex flex-col">
                        {/* Tool Header */}
                        <div className="p-6 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                {activeTool === 'knockout' && <><Zap className="text-amber-500" /> KnockOUT AI</>}
                                {activeTool === 'generator' && <><PenTool className="text-indigo-500" /> Post Generator</>}
                                {activeTool === 'strategy' && <><Target className="text-pink-500" /> Strategy Assistant</>}
                            </h2>
                            {activeTool === 'knockout' && <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded">BETA</span>}
                        </div>

                        {/* Tool Content */}
                        <div className="p-6 flex-1 flex flex-col">
                            {activeTool === 'generator' && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 h-full">
                                    <div className="space-y-6">
                                        <div>
                                            <label className="block text-sm font-bold text-slate-700 mb-2">What's the post about?</label>
                                            <textarea
                                                value={topic}
                                                onChange={(e) => setTopic(e.target.value)}
                                                className="w-full p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none min-h-[150px] bg-slate-50 focus:bg-white transition-colors"
                                                placeholder="e.g., Announcing our new summer collection with 20% off for early birds..."
                                            />
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Platform</label>
                                                <select
                                                    value={platform}
                                                    onChange={(e) => setPlatform(e.target.value)}
                                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                                >
                                                    <option>Instagram</option>
                                                    <option>LinkedIn</option>
                                                    <option>Twitter / X</option>
                                                    <option>Facebook</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-2">Tone</label>
                                                <select
                                                    value={tone}
                                                    onChange={(e) => setTone(e.target.value)}
                                                    className="w-full p-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                                                >
                                                    <option>Professional</option>
                                                    <option>Witty</option>
                                                    <option>Casual</option>
                                                    <option>Urgent</option>
                                                </select>
                                            </div>
                                        </div>
                                        <button
                                            onClick={handleGeneratePost}
                                            disabled={isLoading || !topic}
                                            className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-200"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" size={24} /> : <Sparkles size={24} />}
                                            Generate
                                        </button>
                                    </div>

                                    <div className="bg-slate-50 rounded-2xl border border-slate-200 p-6 relative">
                                        {result ? (
                                            <div className="prose prose-slate max-w-none">
                                                <p className="whitespace-pre-wrap text-slate-800 leading-relaxed">{result}</p>
                                            </div>
                                        ) : (
                                            <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                                                <PenTool size={48} className="mb-4 opacity-20" />
                                                <p>Your content will appear here</p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTool === 'strategy' && (
                                <div className="space-y-6 max-w-2xl mx-auto w-full">
                                    <div className="flex gap-4">
                                        <input
                                            type="text"
                                            placeholder="Enter your niche (e.g., 'Coffee Shop')"
                                            className="flex-1 p-4 rounded-xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
                                            value={niche}
                                            onChange={(e) => setNiche(e.target.value)}
                                        />
                                        <button
                                            onClick={handleGenerateIdeas}
                                            disabled={isLoading || !niche}
                                            className="px-8 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold flex items-center gap-2 disabled:opacity-50 shadow-lg shadow-indigo-200"
                                        >
                                            {isLoading ? <Loader2 className="animate-spin" /> : <Lightbulb />}
                                            Ideate
                                        </button>
                                    </div>

                                    {ideas.length > 0 ? (
                                        <div className="grid grid-cols-1 gap-4">
                                            {ideas.map((idea, idx) => (
                                                <div key={idx} className="p-5 bg-white border border-slate-200 rounded-xl hover:border-indigo-400 transition-all shadow-sm hover:shadow-md cursor-pointer group">
                                                    <div className="flex items-start gap-4">
                                                        <div className="bg-indigo-50 text-indigo-600 w-8 h-8 rounded-full flex items-center justify-center font-bold flex-shrink-0 group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                                                            {idx + 1}
                                                        </div>
                                                        <p className="text-slate-800 font-medium text-lg">{idea}</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 text-slate-400">
                                            <Lightbulb size={64} className="mx-auto mb-4 opacity-10" />
                                            <p>Enter a niche to unlock strategic insights.</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTool === 'knockout' && (
                                <div className="flex-1 flex flex-col gap-6">
                                    <div className="p-6 bg-slate-50 rounded-xl">
                                        <h3 className="text-xl font-bold">KnockOUT AI â€” Auto Generate</h3>
                                        <p className="text-slate-500">Enter a niche and KnockOUT will produce multiple viral post drafts for you.</p>
                                        <div className="mt-4 flex gap-2">
                                            <input value={niche} onChange={(e) => setNiche(e.target.value)} placeholder="e.g., indie coffee shop" className="flex-1 p-3 rounded border" />
                                            <button onClick={handleKnockout} disabled={isLoading || !niche} className="px-4 py-2 bg-indigo-600 text-white rounded">Run</button>
                                        </div>
                                    </div>

                                    <div>
                                        {isLoading && <div className="text-sm text-slate-500">Generatingâ€¦</div>}
                                        {!isLoading && knockoutResults.length === 0 && (
                                            <div className="text-center py-16 text-slate-400">
                                                <Zap size={64} className="mx-auto mb-4 opacity-10" />
                                                <p>Use KnockOUT to auto-create multiple post drafts.</p>
                                            </div>
                                        )}

                                        {knockoutResults.map((p, i) => (
                                            <div key={i} className="p-4 bg-white border rounded-xl mb-3 flex justify-between items-start">
                                                <div className="prose max-w-none"><p className="whitespace-pre-wrap">{p}</p></div>
                                                <div className="flex flex-col gap-2 ml-4">
                                                    <button onClick={() => navigator.clipboard.writeText(p)} className="px-3 py-1 border rounded text-sm">Copy</button>
                                                    <button onClick={() => handleExportToPredis(p)} className="px-3 py-1 bg-indigo-600 text-white rounded text-sm">Export to Predis</button>
                                                </div>
                                            </div>
                                        ))}
                                        <PredisModal open={predisOpen} onClose={() => setPredisOpen(false)} result={predisResult} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
