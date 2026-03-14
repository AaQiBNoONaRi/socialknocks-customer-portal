import React, { useState, useRef, useEffect } from 'react';
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
    AlertCircle,
    Trash2,
    RefreshCw,
    Copy,
    XCircle,
    ExternalLink,
    CheckSquare
} from 'lucide-react';

interface Post {
    id: string;
    content: string;
    media?: string;
    media_url?: string;
    platform?: string;
    platforms?: string[];
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

// MOCK_POSTS removed - now fetching from backend

interface PostsProps {
    onCompose: () => void;
    onEdit: (post: Post) => void;
    workspaceId: string;
    refreshKey?: number;
}

// ─── Context-aware Dropdown Menu ────────────────────────────────────────────
interface DropdownMenuProps {
    post: Post;
    onEdit: (post: Post) => void;
    onDelete: (postId: string) => void;
    onPreview: (post: Post) => void;
    onPublishNow: (postId: string) => void;
    onCopyLink: (post: Post) => void;
    onWithdraw: (postId: string) => void;
    onReschedule: (post: Post) => void;
}

const PostDropdownMenu: React.FC<DropdownMenuProps> = ({
    post,
    onEdit,
    onDelete,
    onPreview,
    onPublishNow,
    onCopyLink,
    onWithdraw,
    onReschedule,
}) => {
    const [open, setOpen] = useState(false);
    const ref = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (ref.current && !ref.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        if (open) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [open]);

    const menuItem = (
        icon: React.ReactNode,
        label: string,
        onClick: () => void,
        variant: 'default' | 'danger' = 'default'
    ) => (
        <button
            key={label}
            type="button"
            onClick={(e) => { e.preventDefault(); e.stopPropagation(); onClick(); setOpen(false); }}
            className={`w-full flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg transition-colors text-left
                ${variant === 'danger'
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-slate-700 hover:bg-slate-50'}`}
        >
            {icon}
            {label}
        </button>
    );

    // Build actions based on post status
    const actions: React.ReactNode[] = [];

    if (post.status === 'Draft') {
        actions.push(menuItem(<Edit2 size={14} />, 'Edit Draft', () => onEdit(post)));
        actions.push(menuItem(<Eye size={14} />, 'Preview', () => onPreview(post)));
        actions.push(menuItem(<Send size={14} />, 'Submit for Approval', () => onPublishNow(post.id)));
        actions.push(<hr key="sep" className="my-1 border-slate-100" />);
        actions.push(menuItem(<Trash2 size={14} />, 'Delete Draft', () => onDelete(post.id), 'danger'));
    }

    if (post.status === 'Pending') {
        actions.push(menuItem(<Eye size={14} />, 'Preview', () => onPreview(post)));
        actions.push(menuItem(<Edit2 size={14} />, 'Edit Post', () => onEdit(post)));
        actions.push(menuItem(<CheckSquare size={14} />, 'Approve & Publish Now', () => onPublishNow(post.id)));
        actions.push(menuItem(<Calendar size={14} />, 'Reschedule', () => onReschedule(post)));
        actions.push(<hr key="sep" className="my-1 border-slate-100" />);
        actions.push(menuItem(<XCircle size={14} />, 'Reject / Withdraw', () => onWithdraw(post.id), 'danger'));
    }

    if (post.status === 'Scheduled') {
        actions.push(menuItem(<Eye size={14} />, 'Preview', () => onPreview(post)));
        actions.push(menuItem(<RefreshCw size={14} />, 'Reschedule', () => onReschedule(post)));
        actions.push(menuItem(<Send size={14} />, 'Publish Now', () => onPublishNow(post.id)));
        actions.push(<hr key="sep" className="my-1 border-slate-100" />);
        actions.push(menuItem(<XCircle size={14} />, 'Cancel Schedule', () => onWithdraw(post.id), 'danger'));
    }

    if (post.status === 'Published') {
        actions.push(menuItem(<Eye size={14} />, 'View Post', () => onPreview(post)));
        actions.push(menuItem(<ExternalLink size={14} />, 'Open on Platform', () => onCopyLink(post)));
        actions.push(menuItem(<Copy size={14} />, 'Duplicate as Draft', () => onEdit(post)));
        actions.push(<hr key="sep" className="my-1 border-slate-100" />);
        actions.push(menuItem(<Trash2 size={14} />, 'Archive Post', () => onDelete(post.id), 'danger'));
    }

    return (
        <div ref={ref} className={`relative ${open ? 'z-[100]' : 'z-10'}`} onClick={(e) => e.stopPropagation()}>
            <button
                type="button"
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setOpen(v => !v); }}
                className={`p-1.5 rounded-lg transition-colors ${open ? 'text-indigo-600 bg-indigo-50' : 'text-slate-300 hover:text-slate-600 hover:bg-slate-100'}`}
            >
                <MoreHorizontal size={16} />
            </button>

            {open && (
                <div className="absolute right-0 top-full mt-1.5 w-52 bg-white border border-slate-200 rounded-xl shadow-xl shadow-slate-200/50 z-[100] p-1.5 animate-in fade-in slide-in-from-top-1 duration-150">
                    {/* Status badge */}
                    <div className="px-3 py-1.5 mb-1 border-b border-slate-100">
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                            {post.status} Actions
                        </span>
                    </div>
                    {actions}
                </div>
            )}
        </div>
    );
};

// ─── Preview Modal ───────────────────────────────────────────────────────────
const PreviewModal: React.FC<{ post: Post | null; onClose: () => void }> = ({ post, onClose }) => {
    if (!post) return null;
    return (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={onClose}
        >
            <div
                className="bg-white rounded-2xl p-6 max-w-md w-full mx-4 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex items-center justify-between mb-4">
                    <h3 className="font-bold text-slate-900">Post Preview</h3>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400">
                        <XCircle size={18} />
                    </button>
                </div>
                {(post.media || post.media_url) && (
                    <img
                        src={post.media || post.media_url}
                        alt="Post media"
                        className="w-full h-52 object-cover rounded-xl mb-4 border border-slate-100"
                    />
                )}
                <p className="text-sm text-slate-700 leading-relaxed mb-4">{post.content}</p>
                <div className="flex items-center gap-2 text-xs text-slate-400">
                    <span>By {post.author.name}</span>
                    <span>·</span>
                    <span>{post.date}</span>
                </div>
            </div>
        </div>
    );
};

// ─── Main Component ──────────────────────────────────────────────────────────
export const Posts: React.FC<PostsProps> = ({ onCompose, onEdit, workspaceId, refreshKey }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [platformFilter, setPlatformFilter] = useState<string>('All');
    const [previewPost, setPreviewPost] = useState<Post | null>(null);

    React.useEffect(() => {
        if (!workspaceId) return;

        const fetchPosts = async () => {
            setIsLoading(true);
            try {
                const response = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/posts/${workspaceId}`);
                if (response.ok) {
                    const data = await response.json();
                    setPosts(data.posts);
                }
            } catch (error) {
                console.error('Failed to fetch posts:', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchPosts();
    }, [workspaceId, refreshKey]);

    // ── Action Handlers ──────────────────────────────────────────────────────

    const handleDelete = async (postId: string) => {
        if (!confirm('Are you sure you want to delete this post?')) return;
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/posts/${postId}`, { method: 'DELETE' });
            if (res.ok) setPosts(prev => prev.filter(p => p.id !== postId));
        } catch (err) {
            console.error('Delete failed:', err);
            // Optimistic delete even without backend
            setPosts(prev => prev.filter(p => p.id !== postId));
        }
    };

    const handlePublishNow = async (postId: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/posts/${postId}/publish`, { method: 'POST' });
            if (res.ok) {
                setPosts(prev =>
                    prev.map(p => p.id === postId ? { ...p, status: 'Published' as const } : p)
                );
            }
        } catch (err) {
            console.error('Publish failed:', err);
            // Optimistic update
            setPosts(prev =>
                prev.map(p => p.id === postId ? { ...p, status: 'Published' as const } : p)
            );
        }
    };

    const handleWithdraw = async (postId: string) => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:8000'}/api/posts/${postId}/withdraw`, { method: 'POST' });
            if (res.ok) {
                setPosts(prev =>
                    prev.map(p => p.id === postId ? { ...p, status: 'Draft' as const } : p)
                );
            }
        } catch (err) {
            console.error('Withdraw failed:', err);
            // Optimistic update
            setPosts(prev =>
                prev.map(p => p.id === postId ? { ...p, status: 'Draft' as const } : p)
            );
        }
    };

    const handleCopyLink = (post: Post) => {
        const link = post.media_url || `https://platform.com/post/${post.id}`;
        navigator.clipboard.writeText(link).then(() => {
            alert('Link copied to clipboard!');
        });
    };

    const handleReschedule = (post: Post) => {
        // Opens edit modal which can reschedule
        onEdit(post);
    };

    // ────────────────────────────────────────────────────────────────────────

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
        ? posts
        : posts.filter(p => p.platform === platformFilter);

    return (
        <>
            {/* Preview Modal */}
            <PreviewModal post={previewPost} onClose={() => setPreviewPost(null)} />

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
                                            <div key={post.id} className="relative bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all group cursor-pointer hover:border-indigo-300">
                                                {/* Post Header */}
                                                <div className="flex justify-between items-start mb-3">
                                                    <div className="flex flex-wrap gap-1">
                                                        {(post.platforms || (post.platform ? [post.platform] : [])).map((plat, idx) => plat && (
                                                            <div key={idx} className={`px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${getPlatformColor(plat)}`}>
                                                                {plat}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    {/* ── Three-dot dropdown ── */}
                                                    <PostDropdownMenu
                                                        post={post}
                                                        onEdit={onEdit}
                                                        onDelete={handleDelete}
                                                        onPreview={(p) => setPreviewPost(p)}
                                                        onPublishNow={handlePublishNow}
                                                        onCopyLink={handleCopyLink}
                                                        onWithdraw={handleWithdraw}
                                                        onReschedule={handleReschedule}
                                                    />
                                                </div>

                                                {/* Media Thumbnail */}
                                                {(post.media || post.media_url) && (
                                                    <div className="mb-3 rounded-lg overflow-hidden border border-slate-100 h-32 relative group-hover:opacity-90 transition-opacity">
                                                        <img src={post.media || post.media_url} alt="Post media" className="w-full h-full object-cover" />
                                                        {((post.platforms || (post.platform ? [post.platform] : [])).includes('Instagram')) && (
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
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); onEdit(post); }}
                                                            className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors"
                                                        >
                                                            <Edit2 size={14} />
                                                        </button>
                                                    )}
                                                    {post.status === 'Scheduled' && (
                                                        <div className="flex items-center gap-1 text-[10px] font-bold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full">
                                                            <Clock size={10} /> Queued
                                                        </div>
                                                    )}
                                                    {post.status === 'Published' && (
                                                        <button
                                                            onClick={(e) => { e.stopPropagation(); setPreviewPost(post); }}
                                                            className="p-1.5 rounded-lg bg-slate-50 text-slate-400 group-hover:text-indigo-600 group-hover:bg-indigo-50 transition-colors"
                                                        >
                                                            <Eye size={14} />
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
        </>
    );
};