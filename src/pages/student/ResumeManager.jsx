import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import supabase from '../../supabase/client';
import { Loader2, FileText, Upload, X } from 'lucide-react';

const ResumeManager = ({ usn, initialResumeUrl = null }) => {
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [progress, setProgress] = useState(0);
  const [resumePath, setResumePath] = useState(null);
  const [resumeUrl, setResumeUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExistingResume = async () => {
      try {
        const { data, error } = await supabase
          .from('students')
          .select('resume')
          .eq('usn', usn)
          .maybeSingle();

        if (error) throw error;
        
        if (data?.resume) {
          setResumePath(data.resume);
          // Get public URL only when needed
          const { data: { publicUrl } } = await supabase.storage
            .from('resumes')
            .getPublicUrl(data.resume);
          setResumeUrl(publicUrl);
        }
      } catch (err) {
        console.error('Error fetching resume:', err);
        setError('Error loading existing resume');
      } finally {
        setLoading(false);
      }
    };

    fetchExistingResume();
  }, [usn]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError('');
    } else {
      setError('Please select a PDF file');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setError('Please select a file first');
      return;
    }

    setUploading(true);
    setError('');
    setProgress(0);

    try {
      // Delete existing file if present
      if (resumePath) {
        await supabase.storage
          .from('resumes')
          .remove([resumePath]);
      }

      // Upload new file
      const fileExt = file.name.split('.').pop();
      const fileName = `${usn}_${Date.now()}.${fileExt}`;
      const filePath = `resumes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('resumes')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Update database with filepath
      const { error: updateError } = await supabase
        .from('students')
        .update({ resume: filePath })
        .eq('usn', usn);

      if (updateError) throw updateError;

      // Get public URL for display
      const { data: { publicUrl } } = await supabase.storage
        .from('resumes')
        .getPublicUrl(filePath);

      setResumePath(filePath);
      setResumeUrl(publicUrl);
      setFile(null);
    } catch (err) {
      setError('Error uploading file: ' + err.message);
    } finally {
      setUploading(false);
      setProgress(0);
    }
  };

  const handleDelete = async () => {
    if (!resumePath) return;

    try {
      // Delete from storage
      const {data,error} = await supabase.storage
        .from('resumes')
        .remove([resumePath]);

      // Update database
      await supabase
        .from('students')
        .update({ resume: null })
        .eq('usn', usn);

      setResumePath(null);
      setResumeUrl(null);
    } catch (err) {
      setError('Error deleting resume: ' + err.message);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="animate-spin h-6 w-6 text-blue-500" />
      </div>
    );
  }

  return (
    <Card className="p-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-medium">Resume Management</h3>
          {resumePath && (
            <Button
              variant="destructive"
              size="sm"
              onClick={handleDelete}
              className="flex items-center gap-2"
            >
              <X size={16} />
              Remove Resume
            </Button>
          )}
        </div>

        {resumePath ? (
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="font-medium">Current Resume</p>
                  <p className="text-sm text-gray-500">
                    {Date(resumePath.split('_')[1].split('.')[0]).split('GMT')[0].slice(4,15)}
                  </p>
                </div>
              </div>
              <a
                href={resumeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:text-blue-800"
              >
                <Button variant="outline">View Resume</Button>
              </a>
            </div>
          </div>
        ) : (
          <div className="text-center p-4 border-2 border-dashed rounded-lg">
            <p className="text-gray-500">No resume uploaded yet</p>
          </div>
        )}

        <div className="space-y-4">
          <div className="flex items-center space-x-4">
            <input
              type="file"
              accept=".pdf"
              onChange={handleFileChange}
              className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700
                hover:file:bg-blue-100"
            />
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="whitespace-nowrap flex items-center gap-2"
            >
              {uploading ? (
                <>
                  <Loader2 className="animate-spin h-4 w-4" />
                  <span>Uploading..</span>
                </>
              ) : (
                <>
                  <Upload size={16} />
                  <span>Upload New</span>
                </>
              )}
            </Button>
          </div>
          
          {error && (
            <div className="text-red-500 text-sm p-2 bg-red-50 rounded">{error}</div>
          )}
          
        </div>
      </div>
    </Card>
  );
};

export default ResumeManager;