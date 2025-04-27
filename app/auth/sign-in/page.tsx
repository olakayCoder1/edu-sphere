"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { BookOpen, EyeIcon, EyeOffIcon } from "lucide-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Separator } from "@/components/ui/separator";
import { DEMO_USERS } from "@/lib/constants";
import { toast } from "sonner";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export default function SignIn() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const redirectTo = searchParams.get("redirectTo") || "";

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = (values: FormValues) => {
    // Simulate authentication with demo users
    const { email, password } = values;
    
    if (email === DEMO_USERS.admin.email && password === DEMO_USERS.admin.password) {
      // Admin login
      localStorage.setItem("user", JSON.stringify(DEMO_USERS.admin));
      toast.success("Signed in as Admin");
      router.push("/dashboard/admin");
    } else if (email === DEMO_USERS.tutor.email && password === DEMO_USERS.tutor.password) {
      // Tutor login
      localStorage.setItem("user", JSON.stringify(DEMO_USERS.tutor));
      toast.success("Signed in as Tutor");
      router.push("/dashboard/tutor");
    } else if (email === DEMO_USERS.student.email && password === DEMO_USERS.student.password) {
      // Student login
      localStorage.setItem("user", JSON.stringify(DEMO_USERS.student));
      toast.success("Signed in as Student");
      router.push("/dashboard/student");
    } else {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div>
      <div className="flex justify-center mb-6 lg:hidden">
        <div className="flex items-center space-x-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <span className="font-bold text-2xl">EduSphere</span>
        </div>
      </div>

      <div className="space-y-2 text-center mb-8">
        <h1 className="text-2xl font-bold">Welcome back</h1>
        <p className="text-muted-foreground">Enter your credentials to sign in</p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="you@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      {...field}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">
            Sign In
          </Button>
        </form>
      </Form>

      <div className="mt-6">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Demo Credentials</span>
          </div>
        </div>
        
        <div className="mt-6 grid grid-cols-1 gap-4 text-sm">
          <div className="border rounded-md p-3">
            <div className="font-medium mb-1">Admin</div>
            <div className="text-muted-foreground mb-1">Email: admin@edusphere.com</div>
            <div className="text-muted-foreground">Password: admin123</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="font-medium mb-1">Tutor</div>
            <div className="text-muted-foreground mb-1">Email: tutor@edusphere.com</div>
            <div className="text-muted-foreground">Password: tutor123</div>
          </div>
          <div className="border rounded-md p-3">
            <div className="font-medium mb-1">Student</div>
            <div className="text-muted-foreground mb-1">Email: student@edusphere.com</div>
            <div className="text-muted-foreground">Password: student123</div>
          </div>
        </div>
      </div>

      <div className="mt-6 text-center">
        <p className="text-sm text-muted-foreground">
          Don't have an account?{" "}
          <Link href="/auth/sign-up" className="text-primary hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}