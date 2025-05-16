"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Header } from "@/components/dashboard/header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import {
  ChevronLeft,
  BookOpen,
  Save,
  Plus,
  FileUp,
  Edit,
  CalendarRange,
  Clock,
  Trash2,
  Loader2,
  Badge,
} from "lucide-react";
import Link from "next/link";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// Drag and Drop Component for Chapters
function SortableChapterItem({
  chapter,
  onEdit,
  onDelete,
}: {
  chapter: any;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({
    id: chapter.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between p-3 mb-2 bg-muted/40 rounded-md border cursor-move"
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 p-2 rounded-md">
          <BookOpen className="h-4 w-4 text-primary" />
        </div>
        <div>
          <div className="font-medium">{chapter.title}</div>
          <div className="text-sm text-muted-foreground flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{chapter.duration} min</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onEdit(chapter.id)}
        >
          <Edit className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onDelete(chapter.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export default function CourseCreatePage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("basic");
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    category: "",
    level: "Beginner",
    isPaid: false,
    price: "0",
    thumbnail: "",
    chapters: [] as any[],
  });
  
  const [newChapter, setNewChapter] = useState({
    id: "",
    title: "",
    duration: "",
    isEditing: false,
  });

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setCourseData((prev) => {
        const oldIndex = prev.chapters.findIndex((ch) => ch.id === active.id);
        const newIndex = prev.chapters.findIndex((ch) => ch.id === over.id);

        return {
          ...prev,
          chapters: arrayMove(prev.chapters, oldIndex, newIndex),
        };
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setCourseData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (name: string, checked: boolean) => {
    setCourseData((prev) => ({ ...prev, [name]: checked }));
  };

  const handleAddChapter = () => {
    if (newChapter.isEditing) {
      // Update existing chapter
      setCourseData((prev) => ({
        ...prev,
        chapters: prev.chapters.map((ch) =>
          ch.id === newChapter.id
            ? { ...ch, title: newChapter.title, duration: newChapter.duration }
            : ch
        ),
      }));
    } else {
      // Add new chapter
      if (newChapter.title.trim() === "") return;
      
      const newId = `chapter-${Date.now()}`;
      setCourseData((prev) => ({
        ...prev,
        chapters: [
          ...prev.chapters,
          {
            id: newId,
            title: newChapter.title,
            duration: newChapter.duration || "0",
          },
        ],
      }));
    }

    // Reset new chapter form
    setNewChapter({
      id: "",
      title: "",
      duration: "",
      isEditing: false,
    });
  };

  const handleEditChapter = (id: string) => {
    const chapter = courseData.chapters.find((ch) => ch.id === id);
    if (chapter) {
      setNewChapter({
        id: chapter.id,
        title: chapter.title,
        duration: chapter.duration,
        isEditing: true,
      });
    }
  };

  const handleDeleteChapter = (id: string) => {
    setCourseData((prev) => ({
      ...prev,
      chapters: prev.chapters.filter((ch) => ch.id !== id),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // In a real app, this would be an API call to save the course
      console.log("Saving course:", courseData);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      // Redirect to course list
      router.push("/dashboard/tutor/courses");
    } catch (error) {
      console.error("Error saving course:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isBasicInfoValid = 
    courseData.title.trim() !== "" && 
    courseData.description.trim() !== "" && 
    courseData.category.trim() !== "";

  const isCourseValid = isBasicInfoValid && courseData.chapters.length > 0;

  const categories = [
    "Programming",
    "Web Development",
    "Data Science",
    "UI/UX Design",
    "Mobile Development",
    "Machine Learning",
    "DevOps",
    "Business",
    "Marketing",
    "Photography",
    "Music",
    "Other"
  ];

  const levels = ["Beginner", "Intermediate", "Advanced"];

  return (
    <div>
      <Header title="Create New Course" />
      <main className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/dashboard/tutor/courses">
            <Button variant="ghost" size="icon">
              <ChevronLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Create New Course</h1>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="basic">Basic Information</TabsTrigger>
                  <TabsTrigger value="content">Course Content</TabsTrigger>
                </TabsList>

                <TabsContent value="basic" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Details</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="title">Course Title</Label>
                        <Input
                          id="title"
                          name="title"
                          value={courseData.title}
                          onChange={handleInputChange}
                          placeholder="Introduction to Web Development"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="description">Course Description</Label>
                        <Textarea
                          id="description"
                          name="description"
                          value={courseData.description}
                          onChange={handleInputChange}
                          placeholder="Provide a detailed description of your course"
                          rows={5}
                          required
                        />
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Category</Label>
                          <Select
                            value={courseData.category}
                            onValueChange={(value) => handleSelectChange("category", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                              {categories.map((category) => (
                                <SelectItem key={category} value={category}>
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="level">Difficulty Level</Label>
                          <Select
                            value={courseData.level}
                            onValueChange={(value) => handleSelectChange("level", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select a level" />
                            </SelectTrigger>
                            <SelectContent>
                              {levels.map((level) => (
                                <SelectItem key={level} value={level}>
                                  {level}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Course Pricing</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="isPaid">Paid Course</Label>
                          <p className="text-sm text-muted-foreground">
                            Enable to set a price for your course
                          </p>
                        </div>
                        <Switch
                          id="isPaid"
                          checked={courseData.isPaid}
                          onCheckedChange={(checked) => handleSwitchChange("isPaid", checked)}
                        />
                      </div>
                      {courseData.isPaid && (
                        <div className="space-y-2">
                          <Label htmlFor="price">Course Price ($)</Label>
                          <Input
                            id="price"
                            name="price"
                            type="number"
                            min="0"
                            step="0.01"
                            value={courseData.price}
                            onChange={handleInputChange}
                            placeholder="29.99"
                          />
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Course Thumbnail</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-8 text-center">
                        <div className="mx-auto flex flex-col items-center justify-center gap-1">
                          <FileUp className="h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">
                            Drag and drop or click to upload
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Recommended size: 1280x720px (16:9)
                          </p>
                          <Input
                            id="thumbnail"
                            name="thumbnail"
                            type="file"
                            accept="image/*"
                            className="hidden"
                          />
                          <Button variant="secondary" size="sm" className="mt-2">
                            Select File
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={() => setActiveTab("content")}
                      disabled={!isBasicInfoValid}
                    >
                      Continue to Course Content
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="content" className="mt-4 space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Course Chapters</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                          <div className="md:col-span-3">
                            <Input
                              placeholder="Chapter title"
                              value={newChapter.title}
                              onChange={(e) => 
                                setNewChapter((prev) => ({ ...prev, title: e.target.value }))
                              }
                            />
                          </div>
                          <div>
                            <Input
                              type="number"
                              placeholder="Duration (min)"
                              value={newChapter.duration}
                              onChange={(e) => 
                                setNewChapter((prev) => ({ ...prev, duration: e.target.value }))
                              }
                            />
                          </div>
                        </div>
                        <Button
                          type="button"
                          onClick={handleAddChapter}
                          disabled={!newChapter.title.trim()}
                          variant="secondary"
                          className="w-full"
                        >
                          {newChapter.isEditing ? (
                            <>
                              <Save className="mr-2 h-4 w-4" />
                              Update Chapter
                            </>
                          ) : (
                            <>
                              <Plus className="mr-2 h-4 w-4" />
                              Add Chapter
                            </>
                          )}
                        </Button>
                      </div>

                      <div className="mt-6">
                        <h3 className="text-sm font-medium mb-2">
                          {courseData.chapters.length === 0
                            ? "No chapters added yet"
                            : "Chapter List (drag to reorder)"}
                        </h3>
                        
                        {courseData.chapters.length > 0 && (
                          <DndContext
                            sensors={sensors}
                            collisionDetection={closestCenter}
                            onDragEnd={handleDragEnd}
                          >
                            <SortableContext
                              items={courseData.chapters.map((ch) => ch.id)}
                              strategy={verticalListSortingStrategy}
                            >
                              {courseData.chapters.map((chapter) => (
                                <SortableChapterItem
                                  key={chapter.id}
                                  chapter={chapter}
                                  onEdit={handleEditChapter}
                                  onDelete={handleDeleteChapter}
                                />
                              ))}
                            </SortableContext>
                          </DndContext>
                        )}
                      </div>
                    </CardContent>
                  </Card>

                  <div className="flex justify-between">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setActiveTab("basic")}
                    >
                      Back to Basic Information
                    </Button>
                    <Button type="submit" disabled={!isCourseValid || isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Course
                        </>
                      )}
                    </Button>
                  </div>
                </TabsContent>
              </Tabs>
            </div>

            <div>
              <Card className="sticky top-6">
                <CardHeader>
                  <CardTitle>Course Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-md p-6 text-center mb-4">
                    {courseData.thumbnail ? (
                      <img
                        src={courseData.thumbnail}
                        alt="Course thumbnail"
                        className="rounded-md w-full"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-32">
                        <BookOpen className="h-12 w-12 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground mt-2">
                          Thumbnail preview
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h3 className="font-medium">
                        {courseData.title || "Course Title"}
                      </h3>
                      <p className="text-sm text-muted-foreground line-clamp-2 mt-1">
                        {courseData.description || "Course description will appear here"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {courseData.category && (
                        <span className="badge badge-outline">{courseData.category}</span>
                      )}
                      {courseData.level && (
                        <span className="badge badge-outline">{courseData.level}</span>
                      )}
                    </div>

                    <div className="text-sm">
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Chapters:</span>
                        <span className="font-medium">{courseData.chapters.length}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-muted-foreground">Price:</span>
                        <span className="font-medium">
                          {courseData.isPaid
                            ? `$${parseFloat(courseData.price || "0").toFixed(2)}`
                            : "Free"}
                        </span>
                      </div>
                      {courseData.chapters.length > 0 && (
                        <div className="flex justify-between py-1">
                          <span className="text-muted-foreground">Total Duration:</span>
                          <span className="font-medium">
                            {courseData.chapters.reduce(
                              (acc, ch) => acc + Number(ch.duration || 0),
                              0
                            )}{" "}
                            minutes
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}