// "use client";

// import { useState, useRef, useEffect } from "react";
// import Link from "next/link";
// import { useAuth } from "@/hooks/useAuth";
// import { motion, AnimatePresence } from "framer-motion";
// import {
//   Bell,
//   ChevronDown,
//   User,
//   Settings,
//   LogOut,
//   PlusCircle,
// } from "lucide-react";

// export default function Topbar() {
//   const [open, setOpen] = useState(false);
//   const dropdownRef = useRef<HTMLDivElement>(null);
//   const { user, logout } = useAuth();

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       if (
//         dropdownRef.current &&
//         !dropdownRef.current.contains(e.target as Node)
//       ) {
//         setOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     return () =>
//       document.removeEventListener("mousedown", handleClickOutside);
//   }, []);

//   const displayName = user?.email
//     ? user.email.split("@")[0]
//     : "User";

//   const firstName =
//     displayName.charAt(0).toUpperCase() +
//     displayName.slice(1);

//   const avatarLetter = firstName.charAt(0).toUpperCase();

//   return (
//     <header className="w-full flex justify-end px-10 pt-4 relative z-50">

//       {/* Glass Card */}
//       <div className="flex items-center gap-6 px-8 py-4 rounded-[28px]
//         backdrop-blur-3xl
//         bg-gradient-to-b from-white/15 to-white/5
//         border border-white/20
//         shadow-[0_20px_60px_rgba(0,0,0,0.35)]
//         text-white
//       ">

//         {/* Notification */}
//         <Link
//           href="/dashboard/settings/notifications"
//           className="relative p-3 rounded-xl hover:bg-white/10 transition"
//         >
//           <Bell size={20} className="text-white/80" />
//           <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-primary rounded-full shadow-md" />
//         </Link>

//         {/* Profile */}
//         <div className="relative" ref={dropdownRef}>
//           <button
//             onClick={() => setOpen((v) => !v)}
//             className="flex items-center gap-4 px-4 py-2 rounded-2xl hover:bg-white/10 transition"
//           >
//             <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center text-white font-bold shadow-lg">
//               {avatarLetter}
//             </div>

//             <div className="hidden lg:block text-left">
//               <p className="text-base font-semibold leading-none">
//                 {firstName}
//               </p>
//             </div>

//             <ChevronDown
//               size={16}
//               className={`transition-transform ${
//                 open ? "rotate-180" : ""
//               }`}
//             />
//           </button>

//           {/* Dropdown */}
//           <AnimatePresence>
//             {open && (
//               <motion.div
//                 initial={{ opacity: 0, y: 12, scale: 0.95 }}
//                 animate={{ opacity: 1, y: 0, scale: 1 }}
//                 exit={{ opacity: 0, y: 12, scale: 0.95 }}
//                 transition={{ duration: 0.2 }}
//                 className="absolute right-0 mt-5 w-72 z-50 rounded-[28px]
//                   backdrop-blur-3xl
//                   bg-gradient-to-b from-[#3b3f6b]/95 to-[#2b2e63]/95
//                   border border-white/20
//                   shadow-[0_30px_80px_rgba(0,0,0,0.5)]
//                   overflow-hidden
//                   text-white"
//               >
//                 <div className="px-7 py-5 border-b border-white/10">
//                   <p className="text-xs uppercase tracking-widest text-white/50 mb-2">
//                     Account
//                   </p>
//                   <p className="text-base font-semibold truncate">
//                     {user?.email || "user@quickbillz.com"}
//                   </p>
//                 </div>

//                 <div className="p-3 space-y-1">

//                   <DropdownLink
//                     href="/dashboard/settings/profile"
//                     icon={<User size={18} />}
//                   >
//                     Profile
//                   </DropdownLink>

//                   <DropdownLink
//                     href="/dashboard/invoices/create"
//                     icon={<PlusCircle size={18} />}
//                   >
//                     Create Invoice
//                   </DropdownLink>

//                   <DropdownLink
//                     href="/dashboard/settings"
//                     icon={<Settings size={18} />}
//                   >
//                     Settings
//                   </DropdownLink>

//                   <button
//                     onClick={logout}
//                     className="w-full flex items-center gap-3 px-5 py-3 mt-2 rounded-2xl
//                       text-red-400 hover:bg-red-500/20 transition font-semibold"
//                   >
//                     <LogOut size={18} />
//                     Logout
//                   </button>

//                 </div>
//               </motion.div>
//             )}
//           </AnimatePresence>
//         </div>
//       </div>
//     </header>
//   );
// }

// /* Dropdown Link */
// function DropdownLink({
//   href,
//   children,
//   icon,
// }: {
//   href: string;
//   children: React.ReactNode;
//   icon: React.ReactNode;
// }) {
//   return (
//     <Link
//       href={href}
//       className="flex items-center gap-4 px-5 py-3 rounded-2xl
//         text-white/80 hover:text-white
//         hover:bg-white/10 transition font-medium"
//     >
//       <span className="text-white/50">{icon}</span>
//       {children}
//     </Link>
//   );
// }
