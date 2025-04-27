"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { FileCheck, FileUp, Upload, ChevronLeft, CircleCheck, Book } from "lucide-react";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { DEMO_COURSES } from "@/lib/constants";

export default function MaterialUpload() {
  const router = useRouter();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [processingStatus, setProcessingStatus] = useState<'idle' | 'processing' | 'complete'>('idle');
  const [processingProgress, setProcessingProgress] = useState(0);
  const [course, setCourse] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [generatedChapters, setGeneratedChapters] = useState<string[]>([]);

  const courses = DEMO_COURSES;

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const simulateUpload = () => {
    setIsUploading(true);
    setUploadProgress(0);
    
    // Simulate file upload progress
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 200);
    
    // Once upload completes, start processing
    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);
      setIsUploading(false);
      simulateProcessing();
    }, 4000);
  };

  const simulateProcessing = () => {
    setProcessingStatus('processing');
    setProcessingProgress(0);
    
    // Simulate backend processing progress
    const interval = setInterval(() => {
      setProcessingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.random() * 10;
      });
    }, 500);
    
    // After processing, show generated chapters
    setTimeout(() => {
      clearInterval(interval);
      setProcessingProgress(100);
      setProcessingStatus('complete');
      setGeneratedChapters([
        "Introduction to Web Development",
        "HTML Fundamentals",
        "CSS Styling Basics",
        "JavaScript Syntax and Variables",
        "DOM Manipulation",
        "Event Handling",
        "Form Validation",
        "Introduction to Frameworks"
      ]);
    }, 6000);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    if (!course) {
      toast.error("Please select a course");
      return;
    }
    
    if (!title.trim()) {
      toast.error("Please enter a title for the material");
      return;
    }
    
    // Start upload simulation
    simulateUpload();
  };

  const handleConfirm = () => {
    toast.success("Chapters confirmed and added to course");
    setTimeout(() => {
      router.push("/dashboard/tutor/courses");
    }, 1500);
  };

  return (
    <div>
      <Header title="Upload Course Material" />
      <main className="container mx-auto px-4 py-6">
        <Button variant="ghost" onClick={() => router.back()} className="mb-6">
          <ChevronLeft className="h-5 w-5 mr-1" /> Back
        </Button>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Upload Learning Material</CardTitle>
                <CardDescription>
                  Upload PDF materials to be processed into structured course chapters
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Select Course</label>
                      <Select value={course} onValueChange={setCourse}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a course" />
                        </SelectTrigger>
                        <SelectContent>
                          {courses.map((course) => (
                            <SelectItem key={course.id} value={course.id}>
                              {course.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Material Title</label>
                      <Input 
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter a title for this material"
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Description (Optional)</label>
                      <Textarea 
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Add a brief description of this material"
                        rows={3}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Upload File</label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center hover:bg-muted/50 transition-colors cursor-pointer">
                        <Input
                          id="file-upload"
                          type="file"
                          onChange={handleFileChange}
                          className="hidden"
                          accept=".pdf,.docx,.ppt,.pptx"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer">
                          {selectedFile ? (
                            <div className="flex flex-col items-center">
                              <FileCheck className="h-10 w-10 text-green-500 mb-2" />
                              <p className="font-medium text-green-600">{selectedFile.name}</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                              </p>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="mt-4"
                                onClick={() => setSelectedFile(null)}
                              >
                                Change File
                              </Button>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center">
                              <Upload className="h-10 w-10 text-muted-foreground mb-2" />
                              <p className="font-medium">Drag and drop or click to upload</p>
                              <p className="text-sm text-muted-foreground mt-1">
                                Supports PDF, DOCX, PPT, PPTX (Max 50MB)
                              </p>
                            </div>
                          )}
                        </label>
                      </div>
                    </div>
                    
                    {isUploading && (
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm mb-1">
                          <span>Uploading...</span>
                          <span>{uploadProgress}%</span>
                        </div>
                        <Progress value={uploadProgress} className="h-2" />
                      </div>
                    )}
                    
                    <Button 
                      type="submit" 
                      className="w-full"
                      disabled={isUploading || !selectedFile || processingStatus !== 'idle'}
                    >
                      <FileUp className="h-4 w-4 mr-2" /> Upload and Process Material
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle>Processing Status</CardTitle>
                <CardDescription>
                  Track the processing status of your uploaded material
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      uploadProgress === 100 ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' : 'bg-muted text-muted-foreground'
                    }`}>
                      {uploadProgress === 100 ? (
                        <CircleCheck className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">1</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">File Upload</h3>
                      <p className="text-sm text-muted-foreground">Uploading your file to the server</p>
                      {isUploading && (
                        <Progress value={uploadProgress} className="h-1.5 mt-2" />
                      )}
                    </div>
                  </div>
                  
                  <div className="w-px h-6 bg-border ml-4"></div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      processingStatus === 'complete' 
                        ? 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300' 
                        : processingStatus === 'processing'
                          ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300'
                          : 'bg-muted text-muted-foreground'
                    }`}>
                      {processingStatus === 'complete' ? (
                        <CircleCheck className="h-5 w-5" />
                      ) : (
                        <span className="text-sm font-medium">2</span>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium">AI Processing</h3>
                      <p className="text-sm text-muted-foreground">Analyzing content and generating chapters</p>
                      {processingStatus === 'processing' && (
                        <Progress value={processingProgress} className="h-1.5 mt-2" />
                      )}
                    </div>
                  </div>
                  
                  <div className="w-px h-6 bg-border ml-4"></div>
                  
                  <div className="flex items-start gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                      processingStatus === 'complete' 
                        ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' 
                        : 'bg-muted text-muted-foreground'
                    }`}>
                      <span className="text-sm font-medium">3</span>
                    </div>
                    <div>
                      <h3 className="font-medium">Review and Confirm</h3>
                      <p className="text-sm text-muted-foreground">Verify generated chapters and confirm</p>
                    </div>
                  </div>
                  
                  <Separator className="my-2" />
                  
                  {processingStatus === 'complete' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="font-medium mb-2">Generated Chapters</h3>
                      <ul className="space-y-2 mb-4">
                        {generatedChapters.map((chapter, index) => (
                          <motion.li 
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center gap-2 bg-muted/50 rounded px-3 py-2"
                          >
                            <Book className="h-4 w-4 text-primary" />
                            <span className="text-sm">{chapter}</span>
                          </motion.li>
                        ))}
                      </ul>
                      <Button className="w-full" onClick={handleConfirm}>
                        Confirm Chapters
                      </Button>
                    </motion.div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}