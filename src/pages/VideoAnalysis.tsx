import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Upload,
  Video,
  Play,
  Pause,
  Brain,
  Eye,
  Mic,
  FileText,
  TrendingUp,
  Sparkles,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  MessageSquare,
  Download,
  Share2,
  RefreshCw,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { analyzeVideoWithCES, analyzeVideoFromUrl } from '@/services/videoAnalysis';
import { CampaignAnalysisViewer } from '@/components/CampaignAnalysisViewer';

const VideoAnalysis: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [uploadedVideo, setUploadedVideo] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoUrlInput, setVideoUrlInput] = useState<string>('');
  const [videoSource, setVideoSource] = useState<'file' | 'url' | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState(0);
  const [analysisStage, setAnalysisStage] = useState('');
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [customQuery, setCustomQuery] = useState('');
  const [queryLoading, setQueryLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragActive, setIsDragActive] = useState(false);

  // Video upload handler
  const handleFileSelect = useCallback((file: File | null) => {
    if (file && file.type.startsWith('video/')) {
      setUploadedVideo(file);
      setVideoUrl(URL.createObjectURL(file));
      setVideoSource('file');
      setVideoUrlInput('');
      toast({
        title: 'Video uploaded',
        description: `${file.name} ready for analysis`,
      });
    } else if (file) {
      toast({
        title: 'Invalid file',
        description: 'Please upload a video file',
        variant: 'destructive',
      });
    }
  }, [toast]);

  // URL validation helper
  const isValidVideoUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url);
      // Check for common video platforms and direct video file URLs
      const validDomains = ['youtube.com', 'youtu.be', 'vimeo.com', 'dailymotion.com', 'twitch.tv'];
      const validExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv'];
      
      const isDomain = validDomains.some(domain => urlObj.hostname.includes(domain));
      const isDirectVideo = validExtensions.some(ext => urlObj.pathname.toLowerCase().includes(ext));
      const isHttps = urlObj.protocol === 'https:' || urlObj.protocol === 'http:';
      
      return isHttps && (isDomain || isDirectVideo);
    } catch {
      return false;
    }
  };

  // Handle URL input
  const handleUrlSubmit = () => {
    if (!videoUrlInput.trim()) {
      toast({
        title: 'URL required',
        description: 'Please enter a video URL',
        variant: 'destructive',
      });
      return;
    }

    if (!isValidVideoUrl(videoUrlInput)) {
      toast({
        title: 'Invalid URL',
        description: 'Please enter a valid video URL (YouTube, Vimeo, or direct video link)',
        variant: 'destructive',
      });
      return;
    }

    setVideoUrl(videoUrlInput);
    setVideoSource('url');
    setUploadedVideo(null);
    toast({
      title: 'Video URL added',
      description: 'Video ready for analysis',
    });
  };

  const clearVideo = () => {
    setUploadedVideo(null);
    setVideoUrl('');
    setVideoUrlInput('');
    setVideoSource(null);
    setAnalysisResults(null);
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    handleFileSelect(file);
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    
    const file = e.dataTransfer.files?.[0] || null;
    handleFileSelect(file);
  };

  // Start video analysis
  const startAnalysis = async () => {
    if (!videoSource || (!uploadedVideo && !videoUrl)) return;

    setAnalyzing(true);
    setAnalysisProgress(0);
    setAnalysisStage('Initializing analysis...');

    try {
      // Simulate progress updates
      const progressInterval = setInterval(() => {
        setAnalysisProgress(prev => {
          if (prev >= 90) return prev;
          return prev + Math.random() * 10;
        });
      }, 1000);

      // Update stages based on source type
      const stages = videoSource === 'url' ? [
        { time: 0, stage: 'Downloading video from URL...', progress: 5 },
        { time: 2000, stage: 'Extracting video frames...', progress: 15 },
        { time: 4000, stage: 'Detecting scenes and objects...', progress: 30 },
        { time: 7000, stage: 'Analyzing emotions and expressions...', progress: 45 },
        { time: 10000, stage: 'Transcribing speech...', progress: 60 },
        { time: 13000, stage: 'Calculating CES score...', progress: 75 },
        { time: 16000, stage: 'Generating insights...', progress: 90 },
        { time: 19000, stage: 'Finalizing report...', progress: 95 },
      ] : [
        { time: 0, stage: 'Extracting video frames...', progress: 10 },
        { time: 3000, stage: 'Detecting scenes and objects...', progress: 25 },
        { time: 6000, stage: 'Analyzing emotions and expressions...', progress: 40 },
        { time: 9000, stage: 'Transcribing speech...', progress: 55 },
        { time: 12000, stage: 'Calculating CES score...', progress: 70 },
        { time: 15000, stage: 'Generating insights...', progress: 85 },
        { time: 18000, stage: 'Finalizing report...', progress: 95 },
      ];

      stages.forEach(({ time, stage, progress }) => {
        setTimeout(() => {
          setAnalysisStage(stage);
          setAnalysisProgress(progress);
        }, time);
      });

      // Prepare analysis request based on source
      let results;
      if (videoSource === 'file' && uploadedVideo) {
        results = await analyzeVideoWithCES(uploadedVideo, {
          campaign_name: uploadedVideo.name.split('.')[0],
          brand: 'Unknown',
          campaign_type: 'brand',
          enable_enrichment: true,
        });
      } else if (videoSource === 'url' && videoUrl) {
        // For URL analysis, we'll call a different endpoint
        results = await analyzeVideoFromUrl(videoUrl, {
          campaign_name: extractCampaignNameFromUrl(videoUrl),
          brand: 'Unknown',
          campaign_type: 'brand',
          enable_enrichment: true,
        });
      }

      clearInterval(progressInterval);
      setAnalysisProgress(100);
      setAnalysisStage('Analysis complete!');
      setAnalysisResults(results);

      toast({
        title: 'Analysis complete',
        description: `CES Score: ${results?.ces_score?.toFixed(1) || 'N/A'}/100`,
      });
    } catch (error) {
      toast({
        title: 'Analysis failed',
        description: error instanceof Error ? error.message : 'Unknown error',
        variant: 'destructive',
      });
    } finally {
      setAnalyzing(false);
    }
  };

  // Helper function to extract campaign name from URL
  const extractCampaignNameFromUrl = (url: string): string => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname.includes('youtube.com') || urlObj.hostname.includes('youtu.be')) {
        return 'YouTube Campaign';
      } else if (urlObj.hostname.includes('vimeo.com')) {
        return 'Vimeo Campaign';
      } else {
        return 'Video Campaign';
      }
    } catch {
      return 'Video Campaign';
    }
  };

  // Handle custom queries
  const handleCustomQuery = async () => {
    if (!customQuery.trim() || !analysisResults) return;

    setQueryLoading(true);
    try {
      const response = await fetch(`/api/analysis/${analysisResults.analysis_id}/query`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: customQuery,
          analysis_id: analysisResults.analysis_id,
        }),
      });

      const data = await response.json();
      toast({
        title: 'Query answered',
        description: data.answer.substring(0, 100) + '...',
      });
    } catch (error) {
      toast({
        title: 'Query failed',
        description: 'Unable to process your question',
        variant: 'destructive',
      });
    } finally {
      setQueryLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-3">
                <Video className="w-10 h-10 text-tbwa-red" />
                Video Campaign Analysis
              </h1>
              <p className="text-muted-foreground mt-2">
                AI-powered video analysis with Creative Effectiveness Scoring
              </p>
            </div>
            <Button variant="outline" onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
          </div>
        </motion.div>

        {!analysisResults ? (
          <>
            {/* Upload Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
            >
              <Card className="mb-8">
                <CardHeader>
                  <CardTitle>Add Campaign Video</CardTitle>
                  <CardDescription>
                    Upload a video file or paste a video URL for comprehensive campaign analysis
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs defaultValue="upload" className="w-full">
                    <TabsList className="grid w-full grid-cols-2">
                      <TabsTrigger value="upload" className="flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Upload File
                      </TabsTrigger>
                      <TabsTrigger value="url" className="flex items-center gap-2">
                        <Video className="w-4 h-4" />
                        Video URL
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload" className="space-y-4">
                      <div
                        onClick={() => fileInputRef.current?.click()}
                        onDragEnter={handleDragEnter}
                        onDragLeave={handleDragLeave}
                        onDragOver={handleDragOver}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-12 text-center cursor-pointer transition-colors ${
                          isDragActive ? 'border-tbwa-red bg-tbwa-red/5' : 'border-border hover:border-tbwa-red/50'
                        }`}
                      >
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="video/mp4,video/quicktime,video/x-msvideo,video/webm"
                          onChange={handleFileInputChange}
                          className="hidden"
                        />
                        <Upload className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
                        {isDragActive ? (
                          <p className="text-lg">Drop the video here...</p>
                        ) : (
                          <div>
                            <p className="text-lg mb-2">Drag & drop your video here</p>
                            <p className="text-sm text-muted-foreground">or click to browse</p>
                            <p className="text-xs text-muted-foreground mt-2">
                              Supports MP4, MOV, AVI, WebM (max 500MB)
                            </p>
                          </div>
                        )}
                      </div>
                    </TabsContent>

                    <TabsContent value="url" className="space-y-4">
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Video URL</label>
                          <div className="flex gap-2">
                            <Input
                              placeholder="https://www.youtube.com/watch?v=... or https://vimeo.com/..."
                              value={videoUrlInput}
                              onChange={(e) => setVideoUrlInput(e.target.value)}
                              className="flex-1"
                            />
                            <Button 
                              onClick={handleUrlSubmit}
                              disabled={!videoUrlInput.trim()}
                              className="bg-tbwa-red hover:bg-tbwa-red/90"
                            >
                              Add URL
                            </Button>
                          </div>
                          <p className="text-xs text-muted-foreground mt-2">
                            Supports YouTube, Vimeo, and direct video file URLs
                          </p>
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>

                  {/* Video Preview */}
                  {(uploadedVideo || (videoSource === 'url' && videoUrl)) && (
                    <div className="mt-6">
                      <div className="bg-gray-100 rounded-lg p-4 mb-4">
                        {videoSource === 'file' && uploadedVideo ? (
                          <video
                            src={videoUrl}
                            controls
                            className="w-full max-h-96 rounded-lg shadow-lg"
                          />
                        ) : (
                          <div className="flex items-center justify-center h-48 bg-gray-200 rounded-lg">
                            <div className="text-center">
                              <Video className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                              <p className="text-sm text-gray-600">Video from URL</p>
                              <p className="text-xs text-gray-500 mt-1 max-w-md truncate">
                                {videoUrl}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div>
                          {videoSource === 'file' && uploadedVideo ? (
                            <>
                              <p className="font-medium">{uploadedVideo.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {(uploadedVideo.size / 1024 / 1024).toFixed(2)} MB
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="font-medium">{extractCampaignNameFromUrl(videoUrl)}</p>
                              <p className="text-sm text-muted-foreground">Video URL</p>
                            </>
                          )}
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            onClick={clearVideo}
                            disabled={analyzing}
                          >
                            Clear
                          </Button>
                          <Button
                            onClick={startAnalysis}
                            disabled={analyzing}
                            className="bg-tbwa-red hover:bg-tbwa-red/90"
                          >
                            {analyzing ? (
                              <>
                                <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                                Analyzing...
                              </>
                            ) : (
                              <>
                                <Brain className="w-4 h-4 mr-2" />
                                Start Analysis
                              </>
                            )}
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Analysis Progress */}
            {analyzing && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card>
                  <CardHeader>
                    <CardTitle>Analysis in Progress</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-sm font-medium">{analysisStage}</p>
                          <span className="text-sm text-muted-foreground">{analysisProgress.toFixed(0)}%</span>
                        </div>
                        <Progress value={analysisProgress} className="h-2" />
                      </div>

                      <div className="grid grid-cols-4 gap-4 mt-6">
                        <div className="text-center">
                          <Eye className={`w-8 h-8 mx-auto mb-2 ${analysisProgress >= 25 ? 'text-green-600' : 'text-gray-300'}`} />
                          <p className="text-xs">Scene Detection</p>
                        </div>
                        <div className="text-center">
                          <Brain className={`w-8 h-8 mx-auto mb-2 ${analysisProgress >= 40 ? 'text-green-600' : 'text-gray-300'}`} />
                          <p className="text-xs">Emotion Analysis</p>
                        </div>
                        <div className="text-center">
                          <Mic className={`w-8 h-8 mx-auto mb-2 ${analysisProgress >= 55 ? 'text-green-600' : 'text-gray-300'}`} />
                          <p className="text-xs">Speech Analysis</p>
                        </div>
                        <div className="text-center">
                          <BarChart3 className={`w-8 h-8 mx-auto mb-2 ${analysisProgress >= 70 ? 'text-green-600' : 'text-gray-300'}`} />
                          <p className="text-xs">CES Scoring</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Feature Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5 text-blue-600" />
                    Visual Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Scene-by-scene breakdown
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Object & brand detection
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Visual quality scoring
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Attention heatmaps
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    AI Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Emotion tracking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Message effectiveness
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Predictive ROI
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Custom Q&A
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                    Market Intelligence
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Competitive benchmarking
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Share of voice analysis
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Trend alignment
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      Social predictions
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </motion.div>
          </>
        ) : (
          /* Analysis Results */
          <CampaignAnalysisViewer
            analysisId={analysisResults.analysis_id}
            videoUrl={videoUrl}
          />
        )}
      </div>
    </div>
  );
};

export default VideoAnalysis;