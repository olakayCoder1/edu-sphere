// "use client";

// import { useEffect, useState } from "react";
// import { Header } from "@/components/dashboard/header";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Input } from "@/components/ui/input";
// import { Button } from "@/components/ui/button";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge";
// import { format } from "date-fns";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
//   AlertDialogTrigger,
// } from "@/components/ui/alert-dialog";
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
// import {
//   Pagination,
//   PaginationContent,
//   PaginationEllipsis,
//   PaginationItem,
//   PaginationLink,
//   PaginationNext,
//   PaginationPrevious,
// } from "@/components/ui/pagination";
// import { Label } from "@/components/ui/label";
// import { toast } from "sonner";
// import { 
//   Search, 
//   MoreVertical, 
//   CheckCircle, 
//   XCircle, 
//   UserX, 
//   UserCheck, 
//   Download, 
//   RefreshCw, 
//   Filter,
//   UserPlus,
//   Users,
//   GraduationCap,
//   School
// } from "lucide-react";
// import React from "react";
// import { UserService } from "@/services/userService"; // Import the new service

// // Type definitions
// export type User = {
//   id: string;
//   name: string;
//   email: string;
//   role: 'student' | 'tutor' | 'admin';
//   status: 'approved' | 'pending' | 'rejected' | 'inactive';
//   registeredAt: string;
//   lastActive?: string;
//   coursesEnrolled?: number;
//   coursesCreated?: number;
//   profileImage?: string;
// };

// export default function AdminUsersPage() {
//   // State for users and filters
//   const [users, setUsers] = useState<User[]>([]);
//   const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalItems, setTotalItems] = useState(0);
//   const [itemsPerPage, setItemsPerPage] = useState(10);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [roleFilter, setRoleFilter] = useState<string>("all");
//   const [statusFilter, setStatusFilter] = useState<string>("all");
//   const [isLoading, setIsLoading] = useState(true);
//   const [editingUser, setEditingUser] = useState<User | null>(null);
//   const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
//   const [isAddUserDialogOpen, setIsAddUserDialogOpen] = useState(false);
//   const [newUser, setNewUser] = useState<Partial<User>>({
//     name: "",
//     email: "",
//     role: "student",
//     status: "pending"
//   });
//   const [userStats, setUserStats] = useState({
//     total: 0,
//     active: 0,
//     pending: 0,
//     inactive: 0,
//     students: { total: 0, active: 0, pending: 0 },
//     tutors: { total: 0, active: 0, pending: 0 },
//     admins: { total: 0 }
//   });

//   // Load users and stats on component mount
//   useEffect(() => {
//     loadUsers();
//     loadUserStats();
//   }, []);

//   // Load users when filters or pagination changes
//   useEffect(() => {
//     loadUsers();
//   }, [searchTerm, roleFilter, statusFilter, currentPage, itemsPerPage]);

//   // Load users from API
//   const loadUsers = async () => {
//     try {
//       setIsLoading(true);
//       const filters = {
//         search: searchTerm,
//         role: roleFilter,
//         status: statusFilter,
//         page: currentPage,
//         page_size: itemsPerPage
//       };
      
//       const response = await UserService.getAllUsers(filters);


//       console.log(response)
//       console.log(response)
//       console.log(response)
//       console.log(response)
      
//       // Transform backend users to frontend format if needed
//       const formattedUsers = response.results?.map(user => UserService.formatUserForFrontend(user));
      
//       setUsers(formattedUsers);
//       setFilteredUsers(formattedUsers);
//       setTotalItems(response.count);
//       setIsLoading(false);
//     } catch (error) {
//       console.error("Error loading users:", error);
//       toast.error("Failed to load users. Please try again.");
//       setIsLoading(false);
//     }
//   };

//   // Load user statistics
//   const loadUserStats = async () => {
//     try {
//       const stats = await UserService.getUserStats();
//       setUserStats(stats);
//     } catch (error) {
//       console.error("Error loading user stats:", error);
//       toast.error("Failed to load user statistics");
//     }
//   };

//   // Calculate pagination
//   const totalPages = Math.ceil(totalItems / itemsPerPage);

//   // Format date for display
//   const formatDate = (dateString: string) => {
//     try {
//       const date = new Date(dateString);
//       return format(date, "MMM d, yyyy");
//     } catch (e) {
//       return "Invalid date";
//     }
//   };

//   // Handle user status change
//   const handleStatusChange = async (userId: string, newStatus: User['status']) => {
//     try {
//       setIsLoading(true);
//       await UserService.updateUserStatus(userId, newStatus);
      
//       toast.success(`User status updated to ${newStatus}`);
      
//       // Reload the users and stats
//       await loadUsers();
//       await loadUserStats();
//     } catch (error) {
//       console.error("Error updating user status:", error);
//       toast.error("Failed to update user status");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle editing user
//   const handleEditUser = async () => {
//     if (editingUser) {
//       try {
//         setIsLoading(true);
        
//         // Map frontend user back to backend format
//         const backendUserData = {
//           first_name: editingUser.name.split(' ')[0],
//           last_name: editingUser.name.split(' ')?.slice(1).join(' '),
//           email: editingUser.email,
//           app_level_role: editingUser.role,
//           is_active: editingUser.status === 'approved' || editingUser.status === 'pending',
//           is_verify: editingUser.status === 'approved'
//         };
        
//         await UserService.updateUser(editingUser.id, backendUserData);
//         toast.success("User updated successfully");
        
//         // Reload the users
//         await loadUsers();
//         await loadUserStats();
        
//         setIsEditDialogOpen(false);
//       } catch (error) {
//         console.error("Error updating user:", error);
//         toast.error("Failed to update user");
//       } finally {
//         setIsLoading(false);
//       }
//     }
//   };

//   // Handle adding new user
//   const handleAddUser = async () => {
//     try {
//       setIsLoading(true);
      
//       // Prepare user data for backend
//       const [firstName, ...lastNameParts] = newUser.name?.split(' ') || ['', ''];
//       const lastName = lastNameParts.join(' ');
      
//       const backendUserData = {
//         first_name: firstName,
//         last_name: lastName,
//         email: newUser.email,
//         app_level_role: newUser.role,
//         is_active: newUser.status === 'approved' || newUser.status === 'pending',
//         is_verify: newUser.status === 'approved',
//         password: 'tempPassword123' // In a real app, you might generate this or handle differently
//       };
      
//       await UserService.createUser(backendUserData);
//       toast.success("User created successfully");
      
//       // Reload data
//       await loadUsers();
//       await loadUserStats();
      
//       // Reset form
//       setIsAddUserDialogOpen(false);
//       setNewUser({
//         name: "",
//         email: "",
//         role: "student",
//         status: "pending"
//       });
//     } catch (error) {
//       console.error("Error creating user:", error);
//       toast.error("Failed to create user");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle approving all pending users
//   const handleApproveAllPending = async () => {
//     try {
//       setIsLoading(true);
//       const response = await UserService.approveAllPending();
      
//       toast.success(response.message || `Approved ${response.updated_count} pending users`);
      
//       // Reload data
//       await loadUsers();
//       await loadUserStats();
//     } catch (error) {
//       console.error("Error approving pending users:", error);
//       toast.error("Failed to approve pending users");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle deactivating inactive users
//   const handleDeactivateInactive = async () => {
//     try {
//       setIsLoading(true);
//       const response = await UserService.deactivateInactiveUsers();
      
//       toast.success(response.message || `Deactivated ${response.updated_count} inactive users`);
      
//       // Reload data
//       await loadUsers();
//       await loadUserStats();
//     } catch (error) {
//       console.error("Error deactivating inactive users:", error);
//       toast.error("Failed to deactivate inactive users");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle exporting users as CSV
//   const handleExportCSV = async () => {
//     try {
//       setIsLoading(true);
      
//       const filters = {
//         search: searchTerm,
//         role: roleFilter,
//         status: statusFilter
//       };
      
//       const blob = await UserService.exportUsersCSV(filters);
      
//       // Create a download link
//       const url = window.URL.createObjectURL(blob);
//       const a = document.createElement('a');
//       a.href = url;
//       a.download = 'users.csv';
//       document.body.appendChild(a);
//       a.click();
      
//       // Clean up
//       window.URL.revokeObjectURL(url);
//       document.body.removeChild(a);
      
//       toast.success("CSV exported successfully");
//     } catch (error) {
//       console.error("Error exporting CSV:", error);
//       toast.error("Failed to export users CSV");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Get color for user status badge
//   const getStatusColor = (status: User['status']) => {
//     switch (status) {
//       case 'approved':
//         return 'bg-green-100 text-green-600 dark:bg-green-900 dark:text-green-300';
//       case 'pending':
//         return 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900 dark:text-yellow-300';
//       case 'rejected':
//         return 'bg-red-100 text-red-600 dark:bg-red-900 dark:text-red-300';
//       case 'inactive':
//         return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
//       default:
//         return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
//     }
//   };

//   // Get color for user role badge
//   const getRoleColor = (role: User['role']) => {
//     switch (role) {
//       case 'student':
//         return 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300';
//       case 'tutor':
//         return 'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300';
//       case 'admin':
//         return 'bg-purple-100 text-purple-600 dark:bg-purple-900 dark:text-purple-300';
//       default:
//         return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300';
//     }
//   };

//   // Get initials for avatar
//   const getInitials = (name: string) => {
//     return name
//       .split(' ')
//       .map(part => part[0])
//       .join('')
//       .toUpperCase()
//       .substring(0, 2);
//   };

//   return (
//     <div className="">
//       <Header title="User Management" />
//       <main className="container mx-auto px-4 py-6">
//         {/* User Stats Cards */}
//         <div className="grid gap-6 md:grid-cols-4 my-8">
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Total Users
//               </CardTitle>
//               <Users className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">{userStats.total}</div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 {/* Display new users in last 30 days if available */}
//                 Managing all platform users
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Active Students
//               </CardTitle>
//               <GraduationCap className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {userStats.students.active}
//               </div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 {userStats.students.pending} pending approval
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Active Tutors
//               </CardTitle>
//               <School className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {userStats.tutors.active}
//               </div>
//               <p className="text-xs text-muted-foreground mt-1">
//                 {userStats.tutors.pending} pending approval
//               </p>
//             </CardContent>
//           </Card>
//           <Card>
//             <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//               <CardTitle className="text-sm font-medium">
//                 Pending Approvals
//               </CardTitle>
//               <UserCheck className="h-4 w-4 text-muted-foreground" />
//             </CardHeader>
//             <CardContent>
//               <div className="text-2xl font-bold">
//                 {userStats.pending}
//               </div>
//               <div className="flex mt-1">
//                 <Button 
//                   variant="link" 
//                   className="h-auto p-0 text-xs text-primary"
//                   onClick={() => setStatusFilter('pending')}
//                 >
//                   View all pending users
//                 </Button>
//               </div>
//             </CardContent>
//           </Card>
//         </div>


//         {/* Batch Actions Card */}
//         <Card className="mb-6">
//           <CardHeader>
//             <CardTitle>Batch Actions</CardTitle>
//             <CardDescription>
//               Perform actions on multiple users at once
//             </CardDescription>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-wrap gap-4">
//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button variant="outline" className="flex items-center gap-2">
//                     <CheckCircle className="h-4 w-4" />
//                     Approve All Pending Users
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>Are you sure?</AlertDialogTitle>
//                     <AlertDialogDescription>
//                       This will approve all pending user registrations. 
//                       Currently there are {userStats.pending} pending users.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <AlertDialogAction onClick={handleApproveAllPending}>
//                       Continue
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>

//               <Button 
//                 variant="outline" 
//                 className="flex items-center gap-2"
//                 onClick={handleExportCSV}
//               >
//                 <Download className="h-4 w-4" />
//                 Export Users CSV
//               </Button>

//               <AlertDialog>
//                 <AlertDialogTrigger asChild>
//                   <Button variant="outline" className="flex items-center gap-2 text-red-600 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950">
//                     <UserX className="h-4 w-4" />
//                     Deactivate Inactive Users
//                   </Button>
//                 </AlertDialogTrigger>
//                 <AlertDialogContent>
//                   <AlertDialogHeader>
//                     <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//                     <AlertDialogDescription>
//                       This will deactivate all users who haven't been active in the last 60 days.
//                       This action cannot be undone.
//                     </AlertDialogDescription>
//                   </AlertDialogHeader>
//                   <AlertDialogFooter>
//                     <AlertDialogCancel>Cancel</AlertDialogCancel>
//                     <AlertDialogAction onClick={handleDeactivateInactive}>
//                       Continue
//                     </AlertDialogAction>
//                   </AlertDialogFooter>
//                 </AlertDialogContent>
//               </AlertDialog>
//             </div>
//           </CardContent>
//         </Card>


//         <Card>
//           <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
//             <div>
//               <CardTitle>Users</CardTitle>
//               <CardDescription>
//                 Manage all users, approve registrations, and edit user details
//               </CardDescription>
//             </div>
//             <Button 
//               onClick={() => setIsAddUserDialogOpen(true)}
//               className="flex items-center gap-2"
//             >
//               <UserPlus className="h-4 w-4" />
//               Add User
//             </Button>
//           </CardHeader>
//           <CardContent>
//             <div className="flex flex-col sm:flex-row gap-4 mb-6">
//               <div className="relative flex-grow">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   type="search"
//                   placeholder="Search users..."
//                   className="pl-8"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//               <div className="flex gap-2">
//                 <Select value={roleFilter} onValueChange={setRoleFilter}>
//                   <SelectTrigger className="w-[110px]">
//                     <SelectValue placeholder="All Roles" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Roles</SelectItem>
//                     <SelectItem value="student">Students</SelectItem>
//                     <SelectItem value="tutor">Tutors</SelectItem>
//                     <SelectItem value="admin">Admins</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Select value={statusFilter} onValueChange={setStatusFilter}>
//                   <SelectTrigger className="w-[120px]">
//                     <SelectValue placeholder="All Status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="all">All Status</SelectItem>
//                     <SelectItem value="approved">Approved</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="rejected">Rejected</SelectItem>
//                     <SelectItem value="inactive">Inactive</SelectItem>
//                   </SelectContent>
//                 </Select>
//                 <Button 
//                   variant="outline" 
//                   size="icon"
//                   onClick={() => {
//                     setSearchTerm("");
//                     setRoleFilter("all");
//                     setStatusFilter("all");
//                   }}
//                   title="Reset filters"
//                 >
//                   <RefreshCw className="h-4 w-4" />
//                 </Button>
//               </div>
//             </div>

//             {isLoading ? (
//               <div className="flex justify-center items-center h-60">
//                 <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
//               </div>
//             ) : (
//               <>
//                 <div className="rounded-md border overflow-hidden">
//                   <Table>
//                     <TableHeader>
//                       <TableRow>
//                         <TableHead>User</TableHead>
//                         <TableHead>Role</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Registered</TableHead>
//                         <TableHead className="hidden md:table-cell">Activity</TableHead>
//                         <TableHead className="text-right">Actions</TableHead>
//                       </TableRow>
//                     </TableHeader>
//                     <TableBody>
//                       {filteredUsers?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)?.length > 0 ? (
//                         filteredUsers?.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)?.map((user) => (
//                           <TableRow key={user.id}>
//                             <TableCell className="font-medium">
//                               <div className="flex items-center space-x-3">
//                                 <Avatar>
//                                   {user.profileImage ? (
//                                     <AvatarImage src={user.profileImage} alt={user.name} />
//                                   ) : (
//                                     <AvatarFallback className={getRoleColor(user.role)}>
//                                       {getInitials(user.name)}
//                                     </AvatarFallback>
//                                   )}
//                                 </Avatar>
//                                 <div>
//                                   <div className="font-medium">{user.name}</div>
//                                   <div className="text-sm text-muted-foreground">{user.email}</div>
//                                 </div>
//                               </div>
//                             </TableCell>
//                             <TableCell>
//                               <Badge className={getRoleColor(user.role)}>
//                                 {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
//                               </Badge>
//                               {user.role === 'student' && user.coursesEnrolled !== undefined && (
//                                 <div className="text-xs text-muted-foreground mt-1">
//                                   {user.coursesEnrolled} courses enrolled
//                                 </div>
//                               )}
//                               {user.role === 'tutor' && user.coursesCreated !== undefined && (
//                                 <div className="text-xs text-muted-foreground mt-1">
//                                   {user.coursesCreated} courses created
//                                 </div>
//                               )}
//                             </TableCell>
//                             <TableCell>
//                               <Badge className={getStatusColor(user.status)}>
//                                 {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
//                               </Badge>
//                             </TableCell>
//                             <TableCell>
//                               <div className="text-sm">{formatDate(user.registeredAt)}</div>
//                             </TableCell>
//                             <TableCell className="hidden md:table-cell">
//                               {user.lastActive ? (
//                                 <div className="text-sm">Last active: {formatDate(user.lastActive)}</div>
//                               ) : (
//                                 <div className="text-sm text-muted-foreground">No activity</div>
//                               )}
//                             </TableCell>
//                             <TableCell className="text-right">
//                               <DropdownMenu>
//                                 <DropdownMenuTrigger asChild>
//                                   <Button variant="ghost" size="icon">
//                                     <MoreVertical className="h-4 w-4" />
//                                     <span className="sr-only">Open menu</span>
//                                   </Button>
//                                 </DropdownMenuTrigger>
//                                 <DropdownMenuContent align="end">
//                                   <DropdownMenuLabel>Actions</DropdownMenuLabel>
//                                   <DropdownMenuItem
//                                     onClick={() => {
//                                       setEditingUser(user);
//                                       setIsEditDialogOpen(true);
//                                     }}
//                                   >
//                                     Edit User
//                                   </DropdownMenuItem>
//                                   <DropdownMenuSeparator />
//                                   {user.status === 'pending' && (
//                                     <>
//                                       <DropdownMenuItem
//                                         onClick={() => handleStatusChange(user.id, 'approved')}
//                                         className="text-green-600"
//                                       >
//                                         <CheckCircle className="h-4 w-4 mr-2" />
//                                         Approve
//                                       </DropdownMenuItem>
//                                       <DropdownMenuItem
//                                         onClick={() => handleStatusChange(user.id, 'rejected')}
//                                         className="text-red-600"
//                                       >
//                                         <XCircle className="h-4 w-4 mr-2" />
//                                         Reject
//                                       </DropdownMenuItem>
//                                     </>
//                                   )}
//                                   {user.status === 'approved' && (
//                                     <DropdownMenuItem
//                                       onClick={() => handleStatusChange(user.id, 'inactive')}
//                                       className="text-amber-600"
//                                     >
//                                       <UserX className="h-4 w-4 mr-2" />
//                                       Deactivate
//                                     </DropdownMenuItem>
//                                   )}
//                                   {user.status === 'inactive' && (
//                                     <DropdownMenuItem
//                                       onClick={() => handleStatusChange(user.id, 'approved')}
//                                       className="text-green-600"
//                                     >
//                                       <UserCheck className="h-4 w-4 mr-2" />
//                                       Reactivate
//                                     </DropdownMenuItem>
//                                   )}
//                                 </DropdownMenuContent>
//                               </DropdownMenu>
//                             </TableCell>
//                           </TableRow>
//                         ))
//                       ) : (
//                         <TableRow>
//                           <TableCell colSpan={6} className="text-center h-24">
//                             No users found matching the current filters
//                           </TableCell>
//                         </TableRow>
//                       )}
//                     </TableBody>
//                   </Table>
//                 </div>

//                 {/* Pagination */}
//                 {filteredUsers?.length > 0 && (
//                   <div className="flex justify-between items-center mt-4">
//                     <div className="text-sm text-muted-foreground">
//                       Showing {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredUsers.length)} of {filteredUsers.length} users
//                     </div>
//                     <Pagination>
//                       <PaginationContent>
//                         <PaginationItem>
//                           <PaginationPrevious 
//                             onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
//                             className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
//                           />
//                         </PaginationItem>
                        
//                         {Array.from({ length: totalPages }, (_, i) => i + 1)
//                           .filter(page => 
//                             page === 1 || 
//                             page === totalPages || 
//                             Math.abs(page - currentPage) <= 1
//                           )
//                           .map((page, index, array) => {
//                             // Add ellipsis
//                             if (index > 0 && page - array[index - 1] > 1) {
//                               return (
//                                 <React.Fragment key={`ellipsis-${page}`}>
//                                   <PaginationItem>
//                                     <PaginationEllipsis />
//                                   </PaginationItem>
//                                   <PaginationItem>
//                                     <PaginationLink
//                                       onClick={() => setCurrentPage(page)}
//                                       isActive={page === currentPage}
//                                     >
//                                       {page}
//                                     </PaginationLink>
//                                   </PaginationItem>
//                                 </React.Fragment>
//                               );
//                             }
//                             return (
//                               <PaginationItem key={page}>
//                                 <PaginationLink
//                                   onClick={() => setCurrentPage(page)}
//                                   isActive={page === currentPage}
//                                 >
//                                   {page}
//                                 </PaginationLink>
//                               </PaginationItem>
//                             );
//                           })}
                        
//                         <PaginationItem>
//                           <PaginationNext 
//                             onClick={() => 
//                               setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)
//                             }
//                             className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
//                           />
//                         </PaginationItem>
//                       </PaginationContent>
//                     </Pagination>
//                   </div>
//                 )}
//               </>
//             )}
//           </CardContent>
//         </Card>

//         {/* Edit User Dialog */}
//         <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Edit User</DialogTitle>
//               <DialogDescription>
//                 Update user details and settings.
//               </DialogDescription>
//             </DialogHeader>
//             {editingUser && (
//               <div className="grid gap-4 py-4">
//                 <div className="flex items-center justify-center mb-2">
//                   <Avatar className="h-16 w-16">
//                     {editingUser.profileImage ? (
//                       <AvatarImage src={editingUser.profileImage} alt={editingUser.name} />
//                     ) : (
//                       <AvatarFallback className={getRoleColor(editingUser.role)}>
//                         {getInitials(editingUser.name)}
//                       </AvatarFallback>
//                     )}
//                   </Avatar>
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="name" className="text-right">
//                     Name
//                   </Label>
//                   <Input
//                     id="name"
//                     value={editingUser.name}
//                     onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
//                     className="col-span-3"
//                   />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="email" className="text-right">
//                     Email
//                   </Label>
//                   <Input
//                     id="email"
//                     value={editingUser.email}
//                     onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
//                     className="col-span-3"
//                   />
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="role" className="text-right">
//                     Role
//                   </Label>
//                   <Select 
//                     value={editingUser.role} 
//                     onValueChange={(value: string) => 
//                       setEditingUser({
//                         ...editingUser, 
//                         role: value as 'student' | 'tutor' | 'admin'
//                       })
//                     }
//                   >
//                     <SelectTrigger className="col-span-3">
//                       <SelectValue placeholder="Select role" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="student">Student</SelectItem>
//                       <SelectItem value="tutor">Tutor</SelectItem>
//                       <SelectItem value="admin">Admin</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//                 <div className="grid grid-cols-4 items-center gap-4">
//                   <Label htmlFor="status" className="text-right">
//                     Status
//                   </Label>
//                   <Select 
//                     value={editingUser.status} 
//                     onValueChange={(value: string) => 
//                       setEditingUser({
//                         ...editingUser, 
//                         status: value as 'approved' | 'pending' | 'rejected' | 'inactive'
//                       })
//                     }
//                   >
//                     <SelectTrigger className="col-span-3">
//                       <SelectValue placeholder="Select status" />
//                     </SelectTrigger>
//                     <SelectContent>
//                       <SelectItem value="approved">Approved</SelectItem>
//                       <SelectItem value="pending">Pending</SelectItem>
//                       <SelectItem value="rejected">Rejected</SelectItem>
//                       <SelectItem value="inactive">Inactive</SelectItem>
//                     </SelectContent>
//                   </Select>
//                 </div>
//               </div>
//             )}
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button onClick={handleEditUser}>Save Changes</Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>

//         {/* Add User Dialog */}
//         <Dialog open={isAddUserDialogOpen} onOpenChange={setIsAddUserDialogOpen}>
//           <DialogContent className="sm:max-w-[425px]">
//             <DialogHeader>
//               <DialogTitle>Add New User</DialogTitle>
//               <DialogDescription>
//                 Create a new user account.
//               </DialogDescription>
//             </DialogHeader>
//             <div className="grid gap-4 py-4">
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="new-name" className="text-right">
//                   Name
//                 </Label>
//                 <Input
//                   id="new-name"
//                   value={newUser.name}
//                   onChange={(e) => setNewUser({...newUser, name: e.target.value})}
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="new-email" className="text-right">
//                   Email
//                 </Label>
//                 <Input
//                   id="new-email"
//                   value={newUser.email}
//                   onChange={(e) => setNewUser({...newUser, email: e.target.value})}
//                   className="col-span-3"
//                 />
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="new-role" className="text-right">
//                   Role
//                 </Label>
//                 <Select 
//                   value={newUser.role as string} 
//                   onValueChange={(value: string) => 
//                     setNewUser({
//                       ...newUser, 
//                       role: value as 'student' | 'tutor' | 'admin'
//                     })
//                   }
//                 >
//                   <SelectTrigger className="col-span-3">
//                     <SelectValue placeholder="Select role" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="student">Student</SelectItem>
//                     <SelectItem value="tutor">Tutor</SelectItem>
//                     <SelectItem value="admin">Admin</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//               <div className="grid grid-cols-4 items-center gap-4">
//                 <Label htmlFor="new-status" className="text-right">
//                   Status
//                 </Label>
//                 <Select 
//                   value={newUser.status as string} 
//                   onValueChange={(value: string) => 
//                     setNewUser({
//                       ...newUser, 
//                       status: value as 'approved' | 'pending' | 'rejected' | 'inactive'
//                     })
//                   }
//                 >
//                   <SelectTrigger className="col-span-3">
//                     <SelectValue placeholder="Select status" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="approved">Approved</SelectItem>
//                     <SelectItem value="pending">Pending</SelectItem>
//                     <SelectItem value="inactive">Inactive</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//             <DialogFooter>
//               <Button variant="outline" onClick={() => setIsAddUserDialogOpen(false)}>
//                 Cancel
//               </Button>
//               <Button 
//                 onClick={handleAddUser}
//                 disabled={!newUser.name || !newUser.email}
//               >
//                 Add User
//               </Button>
//             </DialogFooter>
//           </DialogContent>
//         </Dialog>



        
//       </main>
//     </div>
//   );
// }


// page.tsx
'use client'; // This tells Next.js to treat this component as a client component.

import React from "react";

const Page = () => {
  return <div>Page content here</div>;
};

export default Page;
