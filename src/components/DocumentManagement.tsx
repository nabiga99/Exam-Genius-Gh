import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { Upload, FileText, Download, Trash2, Eye } from 'lucide-react';
import Sidebar from './Sidebar';

interface Document {
  id: string;
  fileName: string;
  uploadedAt: string;
  fileSize: string;
  fileType: string;
  storageURL: string;
}

type CurrentView = 'landing' | 'dashboard' | 'generate' | 'documents' | 'sets' | 'billing' | 'settings' | 'support';

interface DocumentManagementProps {
  onLogout: () => void;
  onNavigate: (view: CurrentView) => void;
}

const DocumentManagement = ({ onLogout, onNavigate }: DocumentManagementProps) => {
  const [documents, setDocuments] = useState<Document[]>([
    {
      id: '1',
      fileName: 'JHS Mathematics Syllabus.pdf',
      uploadedAt: '2024-01-15 10:30',
      fileSize: '2.3',
      fileType: 'PDF',
      storageURL: '#'
    },
    {
      id: '2',
      fileName: 'Science Teaching Notes.docx',
      uploadedAt: '2024-01-12 14:20',
      fileSize: '1.8',
      fileType: 'DOCX',
      storageURL: '#'
    }
  ]);
  
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
          setIsUploading(false);
          setShowUploadModal(false);
          setUploadProgress(0);
          // Add new document to list
          const newDoc: Document = {
            id: Date.now().toString(),
            fileName: file.name,
            uploadedAt: new Date().toLocaleString(),
            fileSize: (file.size / (1024 * 1024)).toFixed(1),
            fileType: file.name.split('.').pop()?.toUpperCase() || 'Unknown',
            storageURL: '#'
          };
          setDocuments(prev => [newDoc, ...prev]);
        }
      }, 200);
    }
  };

  const handleDelete = (docId: string) => {
    setDocuments(prev => prev.filter(doc => doc.id !== docId));
    setShowDeleteModal(false);
    setSelectedDocument(null);
  };

  const EmptyState = () => (
    <div className="text-center py-12">
      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
      <h3 className="text-lg font-medium text-gray-900 mb-2">No documents yet</h3>
      <p className="text-gray-500 mb-4">Click 'Upload New Document' to add one.</p>
      <Button onClick={() => setShowUploadModal(true)}>
        <Upload className="w-4 h-4 mr-2" />
        Upload New Document
      </Button>
    </div>
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar onLogout={onLogout} onNavigate={onNavigate} currentView="documents" />
      
      <div className="flex-1">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-900">My Uploaded Documents</h1>
            <Button onClick={() => setShowUploadModal(true)} className="bg-green-600 hover:bg-green-700">
              <Upload className="w-4 h-4 mr-2" />
              Upload New Document
            </Button>
          </div>

          {documents.length === 0 ? (
            <Card>
              <CardContent>
                <EmptyState />
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-gray-50 border-b">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          File Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Uploaded At
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          File Size
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {documents.map((doc) => (
                        <tr key={doc.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4">
                            <button
                              onClick={() => {
                                setSelectedDocument(doc);
                                setShowDetailsModal(true);
                              }}
                              className="text-blue-600 hover:text-blue-800 font-medium"
                            >
                              {doc.fileName}
                            </button>
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {doc.uploadedAt}
                          </td>
                          <td className="px-6 py-4 text-sm text-gray-500">
                            {doc.fileSize} MB
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex space-x-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setShowDetailsModal(true);
                                }}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedDocument(doc);
                                  setShowDeleteModal(true);
                                }}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      <Dialog open={showUploadModal} onOpenChange={setShowUploadModal}>
        <DialogContent className="sm:max-w-[640px]">
          <DialogHeader>
            <DialogTitle>Upload Document</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-gray-400 transition-colors">
              <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-2">
                Drag & drop PDF/DOCX/PPTX here, or click to browse
              </p>
              <p className="text-sm text-gray-500 mb-4">Max file size: 10 MB</p>
              <Input
                type="file"
                accept=".pdf,.docx,.pptx"
                onChange={handleFileUpload}
                className="hidden"
                id="file-upload"
              />
              <Button variant="outline" onClick={() => document.getElementById('file-upload')?.click()}>
                Browse Files
              </Button>
            </div>
            
            {isUploading && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <Progress value={uploadProgress} className="w-full" />
              </div>
            )}
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowUploadModal(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Document Details Modal */}
      {selectedDocument && (
        <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Document Details</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">File Name</label>
                  <p className="text-sm text-gray-900">{selectedDocument.fileName}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Uploaded At</label>
                  <p className="text-sm text-gray-900">{selectedDocument.uploadedAt}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">File Size</label>
                  <p className="text-sm text-gray-900">{selectedDocument.fileSize} MB</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">Document Type</label>
                  <p className="text-sm text-gray-900">{selectedDocument.fileType}</p>
                </div>
              </div>
              
              <div className="border rounded-lg p-4 bg-gray-50">
                <p className="text-sm text-gray-600 text-center">Preview not available</p>
              </div>
              
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={() => setShowDetailsModal(false)}>
                  Close
                </Button>
                <Button>
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Confirmation Modal */}
      {selectedDocument && (
        <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Confirm Deletion</DialogTitle>
            </DialogHeader>
            <p className="text-sm text-gray-600">
              Are you sure you want to delete "{selectedDocument.fileName}"? This action cannot be undone.
            </p>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button 
                variant="destructive" 
                onClick={() => handleDelete(selectedDocument.id)}
              >
                Delete
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default DocumentManagement;
