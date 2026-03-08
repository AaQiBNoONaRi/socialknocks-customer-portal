import React, { useState } from 'react';
import { X, Image, MapPin, Smile, Calendar, ChevronDown, Loader2, Globe, Sparkles, Video, Layers, UploadCloud, Instagram, Linkedin, Twitter, Facebook, Youtube } from 'lucide-react';

interface ComposeModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PLATFORMS = [
    { id: 'instagram', label: 'Instagram', icon: Instagram, color: 'text-pink-600', bg: 'bg-pink-50', border: 'border-pink-200', ring: 'ring-pink-500' },
    { id: 'facebook', label: 'Facebook', icon: Facebook, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200', ring: 'ring-blue-500' },
    { id: 'twitter', label: 'X (Twitter)', icon: Twitter, color: 'text-slate-900', bg: 'bg-slate-100', border: 'border-slate-300', ring: 'ring-slate-500' },
    { id: 'linkedin', label: 'LinkedIn', icon: Linkedin, color: 'text-blue-700', bg: 'bg-blue-50', border: 'border-blue-200', ring: 'ring-blue-600' },
    { id: 'youtube', label: 'YouTube', icon: Youtube, color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200', ring: 'ring-red-500' },
    { id: 'tiktok', label: 'TikTok', icon: Video, color: 'text-slate-900', bg: 'bg-teal-50', border: 'border-teal-200', ring: 'ring-teal-500' }, // Using Video as fallback
];

export const ComposeModal: React.FC<ComposeModalProps> = ({ isOpen, onClose }) => {
  const [content, setContent] = useState('');
  const [isPosting, setIsPosting] = useState(false);
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(['instagram']);
  const [postType, setPostType] = useState<'post' | 'reel' | 'story'>('post');
  const [showAIOptions, setShowAIOptions] = useState(false);

  if (!isOpen) return null;

  const togglePlatform = (id: string) => {
    if (selectedPlatforms.includes(id)) {
      setSelectedPlatforms(selectedPlatforms.filter(p => p !== id));
    } else {
      setSelectedPlatforms([...selectedPlatforms, id]);
    }
  };

  const handlePost = async () => {
    setIsPosting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsPosting(false);
    onClose();
    setContent('');
  };

  const handleAIGenerate = () => {
      // Simulate AI generation
      setContent(prev => prev + " 🚀 Just launched our new summer campaign! Check out the vibes. #Summer2024 #BrandNew");
      setShowAIOptions(false);
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white z-10">
          <div className="flex items-center gap-4">
              <h3 className="font-bold text-slate-900 text-xl">New Content</h3>
              <div className="h-6 w-px bg-slate-200"></div>
              <div className="flex bg-slate-100 p-1 rounded-lg">
                  {[
                      { id: 'post', label: 'Post', icon: Image },
                      { id: 'reel', label: 'Reel', icon: Video },
                      { id: 'story', label: 'Story', icon: Layers },
                  ].map(type => (
                      <button 
                        key={type.id}
                        onClick={() => setPostType(type.id as any)}
                        className={`px-3 py-1.5 rounded-md text-xs font-bold flex items-center gap-1.5 transition-all ${
                            postType === type.id 
                            ? 'bg-white text-indigo-600 shadow-sm' 
                            : 'text-slate-500 hover:text-slate-700'
                        }`}
                      >
                          <type.icon size={14} />
                          {type.label}
                      </button>
                  ))}
              </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 p-2 rounded-full hover:bg-slate-100 transition-colors">
            <X size={20} />
          </button>
        </div>

        <div className="p-0 overflow-y-auto flex-1">
          <div className="p-6 space-y-6">
            {/* Platform Selector Section */}
            <div>
                 <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Select Channels</label>
                    <div className="flex items-center gap-2">
                        <img src="https://picsum.photos/40" alt="Profile" className="w-6 h-6 rounded-full object-cover border border-slate-200" />
                        <span className="text-sm font-bold text-slate-700">Nexus Agency</span>
                        <ChevronDown size={14} className="text-slate-400" />
                    </div>
                 </div>
                 <div className="flex flex-wrap gap-3">
                    {PLATFORMS.map(platform => {
                        const isSelected = selectedPlatforms.includes(platform.id);
                        return (
                            <button
                                key={platform.id}
                                onClick={() => togglePlatform(platform.id)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl border-2 transition-all ${
                                    isSelected
                                    ? `${platform.bg} ${platform.border} ${platform.color} ring-1 ${platform.ring}`
                                    : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200 hover:bg-slate-50'
                                }`}
                            >
                                <platform.icon size={18} fill={isSelected ? "currentColor" : "none"} className={isSelected ? "" : "opacity-70"} />
                                <span className={`text-sm font-bold ${isSelected ? 'opacity-100' : 'opacity-70'}`}>{platform.label}</span>
                            </button>
                        )
                    })}
                </div>
            </div>

            {/* Editor Area */}
            <div className="relative group bg-slate-50/50 rounded-2xl border border-slate-200 p-4 focus-within:bg-white focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder={`What's on your mind for your ${postType}? Use @ to mention.`}
                    className="w-full min-h-[150px] text-lg text-slate-700 placeholder:text-slate-400 outline-none resize-none bg-transparent"
                    autoFocus
                />
                
                {/* AI Assistant Floating Button */}
                <div className="absolute bottom-4 right-4">
                    <button 
                        onClick={() => setShowAIOptions(!showAIOptions)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold transition-all shadow-sm border ${
                            showAIOptions ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-indigo-600 border-indigo-100 hover:border-indigo-300'
                        }`}
                    >
                        <Sparkles size={14} />
                        {showAIOptions ? 'AI Active' : 'AI Assist'}
                    </button>
                </div>

                {showAIOptions && (
                    <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-indigo-100 p-2 z-20 animate-in fade-in slide-in-from-top-2">
                        <div className="text-xs font-bold text-slate-400 px-2 py-1 uppercase tracking-wider">AI Tools</div>
                        <button onClick={handleAIGenerate} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2">
                            <Sparkles size={14} className="text-indigo-600" /> Complete my thought
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2">
                            <Smile size={14} className="text-amber-500" /> Make it funnier
                        </button>
                        <button className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2">
                            <Globe size={14} className="text-blue-500" /> Translate to Spanish
                        </button>
                    </div>
                )}
            </div>

            {/* Media Dropzone */}
            <div className="flex gap-4 overflow-x-auto pb-2">
                <div className="flex-shrink-0 w-24 h-24 border-2 border-dashed border-slate-200 rounded-xl bg-slate-50 hover:bg-slate-100 transition-colors flex flex-col items-center justify-center text-slate-400 cursor-pointer hover:border-indigo-300 hover:text-indigo-500">
                    <UploadCloud size={24} />
                    <span className="text-[10px] font-bold mt-1">Add Media</span>
                </div>
                 {/* Mock Uploaded Image */}
                <div className="flex-shrink-0 w-24 h-24 rounded-xl overflow-hidden relative group">
                    <img src="https://picsum.photos/200" alt="Upload" className="w-full h-full object-cover" />
                    <button className="absolute top-1 right-1 bg-black/50 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                        <X size={12} />
                    </button>
                </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-white border-t border-slate-100 flex items-center justify-between z-10">
             <div className="flex items-center gap-2">
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Add Image">
                    <Image size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Add Location">
                    <MapPin size={20} />
                </button>
                <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors" title="Add Emoji">
                    <Smile size={20} />
                </button>
                <div className="h-6 w-px bg-slate-200 mx-1"></div>
                <button className="flex items-center gap-2 text-slate-500 font-bold text-xs hover:text-indigo-600 transition-colors px-2 py-1 rounded-lg hover:bg-slate-50">
                    <Calendar size={16} /> Schedule
                </button>
             </div>
             
             <div className="flex items-center gap-3">
                 <span className={`text-xs font-bold ${content.length > 280 ? 'text-red-500' : 'text-slate-300'}`}>
                    {content.length}/280
                 </span>
                 <button 
                    onClick={handlePost}
                    disabled={!content || isPosting}
                    className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-8 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:cursor-not-allowed transition-all hover:scale-105 active:scale-95"
                 >
                    {isPosting && <Loader2 size={16} className="animate-spin" />}
                    {isPosting ? 'Publishing...' : 'Post Now'}
                 </button>
             </div>
        </div>
      </div>
    </div>
  );
};