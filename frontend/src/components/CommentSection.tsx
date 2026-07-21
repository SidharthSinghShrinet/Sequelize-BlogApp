import React, { useState, useEffect } from 'react';
import { marked } from 'marked';
import { CommentApi } from '../api/client';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export interface CommentData {
  id: number;
  content: string;
  authorId: number;
  blogId?: number;
  projectId?: number;
  parentId?: number;
  createdAt: string;
  updatedAt: string;
  authorDetails?: {
    id: number;
    username: string;
    email: string;
    profileImage?: string;
  };
}

interface CommentSectionProps {
  targetType: 'blog' | 'project';
  targetId: number;
  authorId?: number; // ID of post/project author for Creator badge
}

const CommentSection: React.FC<CommentSectionProps> = ({ targetType, targetId, authorId }) => {
  const { user } = useAuth();
  const [comments, setComments] = useState<CommentData[]>([]);
  const [loading, setLoading] = useState(true);

  // Top level comment form state
  const [mainContent, setMainContent] = useState('');
  const [activeTab, setActiveTab] = useState<'write' | 'preview'>('write');
  const [submittingMain, setSubmittingMain] = useState(false);

  // Inline reply form state
  const [replyParentId, setReplyParentId] = useState<number | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [submittingReply, setSubmittingReply] = useState(false);

  const fetchComments = async () => {
    try {
      const response: any =
        targetType === 'blog'
          ? await CommentApi.getBlogComments(targetId)
          : await CommentApi.getProjectComments(targetId);
      setComments(response.data || []);
    } catch (err) {
      console.error("Failed to load discussions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetId) {
      fetchComments();
    }
  }, [targetId, targetType]);

  const handleCreateMainComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!mainContent.trim()) {
      toast.error("Please enter a comment before posting.");
      return;
    }
    if (!user) {
      toast.error("You must be logged in to participate in discussions.");
      return;
    }

    setSubmittingMain(true);
    try {
      const payload: any = { content: mainContent };
      if (targetType === 'blog') payload.blogId = targetId;
      else payload.projectId = targetId;

      await CommentApi.createComment(payload);
      toast.success("Comment posted successfully!");
      setMainContent('');
      setActiveTab('write');
      await fetchComments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to post comment");
    } finally {
      setSubmittingMain(false);
    }
  };

  const handleCreateReply = async (parentId: number) => {
    if (!replyContent.trim()) {
      toast.error("Please enter a reply before submitting.");
      return;
    }
    if (!user) {
      toast.error("You must be logged in to reply.");
      return;
    }

    setSubmittingReply(true);
    try {
      const payload: any = {
        content: replyContent,
        parentId,
      };
      if (targetType === 'blog') payload.blogId = targetId;
      else payload.projectId = targetId;

      await CommentApi.createComment(payload);
      toast.success("Reply posted!");
      setReplyContent('');
      setReplyParentId(null);
      await fetchComments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to post reply");
    } finally {
      setSubmittingReply(false);
    }
  };

  const handleDeleteComment = async (commentId: number) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) return;
    try {
      await CommentApi.deleteComment(commentId);
      toast.success("Comment deleted");
      await fetchComments();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete comment");
    }
  };

  // Safe markdown render helper
  const renderMarkdown = (markdownText: string) => {
    try {
      const html = marked.parse(markdownText);
      return { __html: html };
    } catch (e) {
      return { __html: markdownText };
    }
  };

  // Recursive comment thread renderer
  const renderCommentTree = (parentId: number | null = null, depth = 0) => {
    const childComments = comments.filter((c) =>
      parentId === null ? !c.parentId : c.parentId === parentId
    );

    if (childComments.length === 0) return null;

    return (
      <div className={depth > 0 ? "border-l-2 border-slate-200 dark:border-slate-800 pl-3 md:pl-5 space-y-4 my-3" : "space-y-4"}>
        {childComments.map((comment) => {
          const isAuthor = authorId && Number(comment.authorId) === Number(authorId);
          const canDelete = user && (user.id === comment.authorId || (authorId && user.id === authorId));
          const isReplyingThis = replyParentId === comment.id;

          return (
            <div key={comment.id} className="bg-slate-50/50 dark:bg-slate-900/40 border border-slate-200/70 dark:border-slate-800/70 rounded-xl p-4 transition-all">
              {/* Header: User Info & Actions */}
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-indigo-600 text-white flex items-center justify-center text-xs font-bold shadow-sm">
                    {comment.authorDetails?.username?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-xs text-slate-800 dark:text-slate-200">
                        {comment.authorDetails?.username || 'Developer'}
                      </span>
                      {isAuthor && (
                        <span className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider flex items-center gap-1">
                          <span className="material-symbols-outlined text-[12px]">verified</span> Author
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-slate-400">
                      {new Date(comment.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  {user && (
                    <button
                      onClick={() => {
                        if (isReplyingThis) {
                          setReplyParentId(null);
                          setReplyContent('');
                        } else {
                          setReplyParentId(comment.id);
                          setReplyContent('');
                        }
                      }}
                      className="text-xs text-slate-500 hover:text-primary dark:hover:text-indigo-400 font-medium flex items-center gap-1 transition-colors px-2 py-1 rounded hover:bg-slate-200/50 dark:hover:bg-slate-800/50"
                    >
                      <span className="material-symbols-outlined text-sm">reply</span>
                      {isReplyingThis ? 'Cancel' : 'Reply'}
                    </button>
                  )}
                  {canDelete && (
                    <button
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-xs text-red-500 hover:text-red-700 dark:hover:text-red-400 p-1 rounded hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                      title="Delete comment"
                    >
                      <span className="material-symbols-outlined text-sm">delete</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Comment Content (Markdown) */}
              <div
                className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-700 dark:text-slate-300 leading-relaxed overflow-x-auto"
                dangerouslySetInnerHTML={renderMarkdown(comment.content)}
              />

              {/* Inline Reply Form */}
              {isReplyingThis && (
                <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
                  <div className="text-xs font-semibold text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-1">
                    <span className="material-symbols-outlined text-sm">turn_down</span>
                    Replying to @{comment.authorDetails?.username || 'Developer'}
                  </div>
                  <textarea
                    rows={3}
                    value={replyContent}
                    onChange={(e) => setReplyContent(e.target.value)}
                    placeholder="Write a Markdown response... (e.g. ```js code blocks supported)"
                    className="w-full text-xs md:text-sm p-3 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none resize-y font-mono"
                  />
                  <div className="flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => {
                        setReplyParentId(null);
                        setReplyContent('');
                      }}
                      className="px-3 py-1.5 rounded-lg text-xs text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      disabled={submittingReply}
                      onClick={() => handleCreateReply(comment.id)}
                      className="px-4 py-1.5 rounded-lg text-xs font-semibold bg-primary text-white hover:brightness-110 disabled:opacity-50 transition-all flex items-center gap-1"
                    >
                      {submittingReply ? (
                        <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-xs">send</span> Submit Reply
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Recursive child threads */}
              {renderCommentTree(comment.id, depth + 1)}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-primary text-2xl">forum</span>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Developer Discussions <span className="text-sm font-normal text-slate-400">({comments.length})</span>
          </h2>
        </div>
      </div>

      {/* Main Comment Posting Box */}
      {user ? (
        <div className="mb-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 md:p-5 shadow-sm">
          {/* Editor Header / Tabs */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 dark:border-slate-800">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('write')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'write'
                    ? 'bg-primary/10 text-primary dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Write (Markdown)
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-colors ${
                  activeTab === 'preview'
                    ? 'bg-primary/10 text-primary dark:text-indigo-400'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
              >
                Preview
              </button>
            </div>

            <span className="text-[11px] text-slate-400 hidden sm:inline-block">
              Markdown & ```code syntax supported
            </span>
          </div>

          <form onSubmit={handleCreateMainComment}>
            {activeTab === 'write' ? (
              <textarea
                rows={4}
                value={mainContent}
                onChange={(e) => setMainContent(e.target.value)}
                placeholder="Join the discussion... Ask code questions, share feedback, or report technical details. Markdown supported!"
                className="w-full text-xs md:text-sm p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-primary focus:outline-none resize-y font-mono transition-all"
              />
            ) : (
              <div className="min-h-[100px] p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/60">
                {mainContent.trim() ? (
                  <div
                    className="prose dark:prose-invert max-w-none text-xs md:text-sm text-slate-800 dark:text-slate-200 leading-relaxed"
                    dangerouslySetInnerHTML={renderMarkdown(mainContent)}
                  />
                ) : (
                  <p className="text-xs text-slate-400 italic">Nothing to preview yet.</p>
                )}
              </div>
            )}

            <div className="flex items-center justify-between mt-3">
              <span className="text-[11px] text-slate-400 font-mono">
                Markdown formatting enabled
              </span>
              <button
                type="submit"
                disabled={submittingMain || !mainContent.trim()}
                className="px-5 py-2 rounded-xl text-xs font-bold bg-primary text-white hover:brightness-110 disabled:opacity-50 transition-all shadow-md flex items-center gap-1.5"
              >
                {submittingMain ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span className="material-symbols-outlined text-sm">send</span> Post Comment
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="mb-8 p-6 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
            Want to share feedback or ask code questions in the discussion?
          </p>
          <span className="text-xs font-semibold text-primary">Log in to post a comment or reply.</span>
        </div>
      )}

      {/* Discussion Tree List */}
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-10 bg-slate-50/50 dark:bg-slate-900/20 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
          <span className="material-symbols-outlined text-slate-300 dark:text-slate-700 text-4xl mb-2">chat_bubble_outline</span>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">No discussions yet.</p>
          <p className="text-xs text-slate-400 mt-1">Be the first developer to start a conversation!</p>
        </div>
      ) : (
        renderCommentTree(null)
      )}
    </section>
  );
};

export default CommentSection;
