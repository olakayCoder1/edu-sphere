import { ReactNode } from 'react';
import Link from 'next/link';
import { BookOpen } from 'lucide-react';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex">
      <div className="hidden lg:block lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative">
        <div className="absolute inset-0 flex flex-col justify-center items-center px-12 text-white">
          <div className="flex items-center space-x-2 mb-6">
            <BookOpen className="h-10 w-10" />
            <span className="font-bold text-3xl">EduSphere</span>
          </div>
          <h1 className="text-4xl font-bold mb-6 text-center">Transform your learning experience</h1>
          <p className="text-xl mb-8 text-center opacity-90">
            A comprehensive learning platform for students, tutors, and administrators.
          </p>
          <div className="grid grid-cols-2 gap-6 w-full max-w-xl mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Structured Learning</h3>
              <p className="text-sm opacity-90">Progress through chapters and quizzes at your own pace</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Expert Tutors</h3>
              <p className="text-sm opacity-90">Learn from industry professionals and academics</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Live Sessions</h3>
              <p className="text-sm opacity-90">Participate in interactive live classes and discussions</p>
            </div>
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <h3 className="font-semibold mb-2">Track Progress</h3>
              <p className="text-sm opacity-90">Monitor your learning journey with detailed analytics</p>
            </div>
          </div>
          <p className="text-sm opacity-70">
            © {new Date().getFullYear()} EduSphere. All rights reserved.
          </p>
        </div>
      </div>
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <div className="w-full max-w-md px-6 py-12">
          {children}
        </div>
      </div>
    </div>
  );
}