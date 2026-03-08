import React, { useState } from 'react';
import { 
    Plus, 
    MoreHorizontal, 
    Image as ImageIcon, 
    Calendar, 
    CheckCircle, 
    Clock, 
    FileText, 
    Filter, 
    Send,
    Edit2,
    Eye,
    MessageSquare,
    ThumbsUp,
    Share2,
    AlertCircle
} from 'lucide-react';

interface Post {
    id: string;
    content: string;
    media?: string;
    platform: 'Instagram' | 'LinkedIn' | 'Twitter' | 'Facebook';
    status: 'Draft' | 'Pending' | 'Scheduled' | 'Published';
    date: string;
    author: {
        name: string;
        avatar: string;
    };
    stats?: {
        likes: number;
        comments: number;
        shares: number;
    };
}

const MOCK_POSTS: Post[] = [
    { 
        id: '1', 
        content: 'Excited to announce our new summer collection! 🌞 #SummerVibes', 
        media: 'https://picsum.photos/400/300?random=101', 
        platform: 'Instagram', 
        status: 'Draft', 
        date: 'Oct 26, 2024',
        author: { name: 'Jane Cooper', avatar: 'https://picsum.photos/40?1' }
    },
    { 
        id: '2', 
        content: 'Check out our latest case study on sustainable packaging.', 
        platform: 'LinkedIn', 
        status: 'Pending', 
        date: 'Oct 27, 2024',
        author: { name: 'Wade Warren', avatar: 'https://picsum.photos/40?2' }
    },
    { 
        id: '3', 
        content: 'Flash Sale starts now! 50% off everything.', 
        media: 'https://picsum.photos/400/300?random=102', 
        platform: 'Facebook', 
        status: 'Scheduled', 
        date: 'Oct 30, 2024 • 10:00 AM',
        author: { name: 'Esther Howard', avatar: 'https://picsum.photos/40?3' }
    },
    { 
        id: '4', 
        content: 'Thanks to everyone who joined our webinar yesterday!', 
        platform: 'Twitter', 
        status: 'Published', 
        date: 'Oct 24, 2024 • 2:00 PM',
        author: { name: 'Jane Cooper', avatar: 'https://picsum.photos/40?1' },
        stats: { likes: 124, comments: 12, shares: 45 }
    },
    { 
        id: '5', 
        content: 'Behind the scenes at our HQ. 🎥', 
        media: 'https://picsum.photos/400/300?random=103', 
        platform: 'Instagram', 
        status: 'Published', 
        date: 'Oct 23, 2024 • 9:00 AM',
        author: { name: 'Cameron W.', avatar: 'https://picsum.photos/40?4' },
        stats: { likes: 1205, comments: 89, shares: 12 }
    },
    { 
        id: '6', 
        content: 'New blog post is live! Link in bio.', 
        platform: 'Instagram', 
        status: 'Draft', 
        date: 'Oct 28, 2024',
        author: { name: 'Jane Cooper', avatar: 'https://picsum.photos/40?1' }
    }
];

interface PostsProps {
    onCompose: () => void;
}

export const Posts: React.FC<PostsProps> = ({ onCompose }) => {
    const [platformFilter, setPlatformFilter] = useState<string>('All');

    const getPlatformIcon = (platform: string) => {
        // Simple mapping for demo
        return <span className="text-[10px] font-bold uppercase tracking-wider">{platform}</span>;
    };

    const getPlatformColor = (platform: string) => {
        switch (platform) {
            case 'Instagram': return 'bg-gradient-to-tr from-yellow-400 via-red-500 to-purple-500 text-white border-transparent';
            case 'LinkedIn': return 'bg-[#0077b5] text-white border-transparent';
            case 'Twitter': return 'bg-black text-white border-transparent';
            case 'Facebook': return 'bg-[#1877f2] text-white border-transparent';
            default: return 'bg-slate-100 text-slate-600 border-slate-200';
        }
    };

    const columns = [
        { id: 'Draft', label: 'Drafts', icon: FileText, color: 'bg-slate-100 text-slate-600' },
        { id: 'Pending', label: 'Pending Approval', icon: AlertCircle, color: 'bg-amber-50 text-amber-600' },
        { id: 'Scheduled', label: 'Scheduled', icon: Calendar, color: 'bg-blue-50 text-blue-600' },
        { id: 'Published', label: 'Uploaded / Published', icon: CheckCircle, color: 'bg-green-50 text-green-600' },
    ];

    const filteredPosts = platformFilter === 'All' 
        ? MOCK_POSTS 
        : MOCK_POSTS.filter(p => p.platform === platformFilter);

    return (
        <div className="h-[calc(100vh-120px)] flex flex-col animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 flex-shrink-0">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-1 bg-indigo-50 text-indigo-700 text-xs font-bold rounded uppercase tracking-wider">Content Lab</span>
                    </div>
                    <h1 className="text-2xl font-bold text-slate-900">Post Pipeline</h1>
                    <p className="text-slate-500">Manage drafts, approvals, and published content.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <select 
                            className="pl-9 pr-8 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-indigo-500 outline-none appearance-none cursor-pointer hover:border-slate-300 transition-colors"
                            value={platformFilter}
                            onChange={(e) => setPlatformFilter(e.target.value)}
                        >
                            <option>All</option>
                            <option>Instagram</option>
                            <option>LinkedIn</option>
                            <option>Twitter</option>
                            <option>Facebook</option>
                        </select>
                    </div>
                    <button 
                        onClick={onCompose}
                        className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-700 hover:to-violet-700 text-white px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-indigo-200 transition-all hover:scale-105 active:scale-95"
                    >
                        <Plus size={18} /> New Post
                    </button>
                </div>
            </div>

            {/* Kanban Board */}
            <div className="flex-1 overflow-x-auto pb-4">
                <div className="flex gap-6 h-full min-w-max px-1">
                    {columns.map(col => {
                        const colPosts = filteredPosts.filter(p => p.status === col.id);
                        return (
                            <div key={col.id} className="w-[340px] flex flex-col h-full bg-slate-50/50 rounded-2xl border border-slate-200/60 overflow-hidden">
                                {/* Column Header */}
                                <div className={`p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10`}>
                                    <div className="flex items-center gap-2">
                                        <div className={`p-1.5 rounded-lg ${col.color.replace('text-', 'bg-').replace('50', '100')} ${col.color}`}>
                                            <col.icon size={16} />
                                        </div>
                                        <h3 className="font-bold text-slate-800 text-sm">{col.label}</h3>
                                    </div>
                                    <span className="bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full text-xs font-bold">
                                        {colPosts.length}
                                    </span>
                                </div>

                                {/* Posts List - Scrollable */}
                                <div className="p-3 space-y-3 overflow-y-auto flex-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
                                    {colPosts.map(post => (
                                        <div key={post.id} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-indigo-300">
                                            {/* Post Header */}
                                            <div className="flex justify-between items-start mb-3">
                                                <div className={`px-2 py-1 rounded text-[10px] font-bold border flex items-center gap-1 ${getPlatformColor(post.platform)}`}>
                                                    {post.platform}
                                                </div>
                                                <button className="text-slate-300 hover:text-slate-600">
                                                    <MoreHorizontal size={16} />
                                                </button>
                                            </div>

                                            {/* Media Thumbnail */}
                                            {post.media && (
                                                <div className="mb-3 rounded-lg overflow-hidden border border-slate-100 h-32 relative group-hover:opacity-90 transition-opacity">
                                                    <img src={post.media} alt="Post media" className="w-full h-full object-cover" />
                                                    {post.platform === 'Instagram' && (
                                                        <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded">
                                                            <ImageIcon size={12} />
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            {/* Content Snippet */}
                                            <p className="text-sm text-slate-700 line-clamp-3 mb-3 font-medium leading-relaxed">
                                                {post.content}
                                            </p>

                                            {/* Stats for Published */}
                                            {post.status === 'Published' && post.stats && (
                                                <div className="flex items-center gap-4 py-2 border-t border-b border-slate-50 mb-3 text-xs text-slate-500">
                                                    <span className="flex items-center gap-1 hover:text-indigo-600"><ThumbsUp size={12} /> {post.stats.likes}</span>
                                                    <span className="flex items-center gap-1 hover:text-indigo-600"><MessageSquare size={12} /> {post.stats.comments}</span>
                                                    <span className="flex items-center gap-1 hover:text-indigo-600"><Share2 size={12} /> {post.stats.shares}</span>
                                                </div>
                                            )}

                                            {/* Footer Info */}
                                            <div className="flex items-center justify-between mt-auto pt-2">
                                                <div className="flex items-center gap-2">
                                                    <img src={post.author.avatar} alt={post.author.name} className="w-5 h-5 rounded-full border border-slate-100" />
                                                    <span className="text-xs text-slate-400">{post.date}</span>
                                                </div>
                                                
                                                {post.status === 'Draft' && (
                                                    <button className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                                                        <Edit2 size={14} />
                                                    </button>
                                                )}
                                                {post.status === 'Scheduled' && (
                                                    <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                        <Clock size={10} /> Queued
                                                    </div>
                                                )}
                                                 {post.status === 'Published' && (
                                                    <button className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors">
                                                        <ExternalLinkIcon size={14} />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                    
                                    {/* Empty State for Column */}
                                    {colPosts.length === 0 && (
                                        <div className="text-center py-10 px-4 border-2 border-dashed border-slate-200 rounded-xl">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2 text-slate-300">
                                                <col.icon size={20} />
                                            </div>
                                            <p className="text-sm text-slate-400">No posts in {col.label}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

// Helper icon component since it was missing
const ExternalLinkIcon = ({ size, className }: { size: number, className?: string }) => (
    <svg 
        xmlns="http://www.w3.org/2000/svg" 
        width={size} 
        height={size} 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        strokeWidth="2" 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        className={className}
    >
        <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
        <polyline points="15 3 21 3 21 9"></polyline>
        <line x1="10" y1="14" x2="21" y2="3"></line>
    </svg>
);