import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { converterAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import {
  Trash2,
  Eye,
  Download,
  Search,
  Calendar,
  FileText,
  ArrowRightLeft,
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const MyConversions = () => {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedConversion, setSelectedConversion] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-conversions', page, search],
    queryFn: () => converterAPI.getMyConversions(page, search),
  });

  const handleDelete = async id => {
    if (!confirm('Are you sure you want to delete this conversion?')) {
      return;
    }

    try {
      await converterAPI.deleteConversion(id);
      toast.success('Conversion deleted successfully');
      refetch();
    } catch (error) {
      toast.error('Error deleting conversion');
    }
  };

  const handleView = async id => {
    try {
      const { conversion } = await converterAPI.getConversionById(id);
      setSelectedConversion(conversion);
      setShowViewModal(true);
    } catch (error) {
      toast.error('Error loading conversion');
    }
  };

  const handleDownload = conversion => {
    const blob = new Blob([conversion.outputData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${conversion.name}.${conversion.outputType}`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Downloaded!');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
      >
        <div>
          <h1 className="text-4xl md:text-5xl font-pixel mb-2">MY CONVERSIONS</h1>
          <p className="text-terminal-dim">View and manage your saved conversions</p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="card-retro">
        <div className="flex items-center gap-2">
          <Search size={20} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or tags..."
            className="input-retro flex-1"
          />
        </div>
      </div>

      {/* Conversions List */}
      {isLoading ? (
        <div className="text-center py-12">
          <div className="animate-pulse text-2xl">LOADING CONVERSIONS...</div>
        </div>
      ) : data?.conversions?.length === 0 ? (
        <div className="card-retro text-center py-12">
          <FileText className="w-16 h-16 mx-auto mb-4 text-terminal-dim" />
          <h3 className="text-2xl font-bold mb-2">No conversions found</h3>
          <p className="text-terminal-dim">
            Start converting and save your work to see it here!
          </p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4">
            {data?.conversions?.map((conversion, index) => (
              <motion.div
                key={conversion._id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="card-retro hover:scale-[1.01] transition-transform"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <ArrowRightLeft className="text-terminal-bright" size={20} />
                      <h3 className="text-xl font-bold text-terminal-bright">
                        {conversion.name}
                      </h3>
                      <span className="px-2 py-1 bg-terminal-dim rounded text-xs font-bold">
                        {conversion.inputType.toUpperCase()} → {conversion.outputType.toUpperCase()}
                      </span>
                    </div>

                    {conversion.description && (
                      <p className="text-terminal-dim text-sm mb-2">
                        {conversion.description}
                      </p>
                    )}

                    {/* Tags */}
                    {conversion.tags?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-2">
                        {conversion.tags.map((tag, i) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-terminal-bg border border-terminal-dim rounded text-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Meta */}
                    <div className="flex flex-wrap items-center gap-4 text-xs text-terminal-dim">
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{formatDistanceToNow(new Date(conversion.createdAt))} ago</span>
                      </div>
                      {conversion.metadata?.processingTime && (
                        <div>⚡ {conversion.metadata.processingTime}ms</div>
                      )}
                      {conversion.isPublic && (
                        <div className="text-terminal-bright font-bold">🌐 PUBLIC</div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleView(conversion._id)}
                      className="btn-neon px-3 py-2 text-sm"
                      title="View conversion"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleDownload(conversion)}
                      className="btn-neon px-3 py-2 text-sm"
                      title="Download output"
                    >
                      <Download size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(conversion._id)}
                      className="btn-neon px-3 py-2 text-sm bg-red-500/20 hover:bg-red-500/30"
                      title="Delete conversion"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {data?.totalPages > 1 && (
            <div className="flex justify-center gap-2">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="btn-neon px-4 py-2 disabled:opacity-50"
              >
                PREVIOUS
              </button>
              <span className="px-4 py-2 border-2 border-terminal-dim rounded">
                Page {page} of {data.totalPages}
              </span>
              <button
                onClick={() => setPage(p => Math.min(data.totalPages, p + 1))}
                disabled={page === data.totalPages}
                className="btn-neon px-4 py-2 disabled:opacity-50"
              >
                NEXT
              </button>
            </div>
          )}
        </>
      )}

      {/* View Modal */}
      {showViewModal && selectedConversion && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50"
          onClick={() => setShowViewModal(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-retro max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            onClick={e => e.stopPropagation()}
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h2 className="text-2xl font-bold mb-2">{selectedConversion.name}</h2>
                {selectedConversion.description && (
                  <p className="text-terminal-dim">{selectedConversion.description}</p>
                )}
              </div>
              <button
                onClick={() => setShowViewModal(false)}
                className="btn-neon px-3 py-2"
              >
                <Eye size={16} className="opacity-50" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Input */}
              <div>
                <h3 className="text-lg font-bold mb-2">
                  INPUT [{selectedConversion.inputType.toUpperCase()}]
                </h3>
                <pre className="code-block max-h-96 overflow-auto text-xs md:text-sm">
                  {selectedConversion.inputData}
                </pre>
              </div>

              {/* Output */}
              <div>
                <h3 className="text-lg font-bold mb-2">
                  OUTPUT [{selectedConversion.outputType.toUpperCase()}]
                </h3>
                <pre className="code-block max-h-96 overflow-auto text-xs md:text-sm">
                  {selectedConversion.outputData}
                </pre>
              </div>
            </div>

            {selectedConversion.metadata && (
              <div className="mt-4 pt-4 border-t-2 border-terminal-dim">
                <h3 className="text-lg font-bold mb-2">METRICS</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  {selectedConversion.metadata.processingTime && (
                    <div>
                      <div className="text-terminal-dim">Processing Time</div>
                      <div className="font-bold">{selectedConversion.metadata.processingTime}ms</div>
                    </div>
                  )}
                  {selectedConversion.metadata.inputSize && (
                    <div>
                      <div className="text-terminal-dim">Input Size</div>
                      <div className="font-bold">{selectedConversion.metadata.inputSize} bytes</div>
                    </div>
                  )}
                  {selectedConversion.metadata.outputSize && (
                    <div>
                      <div className="text-terminal-dim">Output Size</div>
                      <div className="font-bold">{selectedConversion.metadata.outputSize} bytes</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default MyConversions;

