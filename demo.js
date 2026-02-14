// // src/Auth/AuthContext.jsx
// import { createContext, useContext, useState, useEffect } from "react";
// import axios from "axios";
// import { useMenu } from "../../routes/menu-context";

// const API_URL = import.meta.env.VITE_API_URL;

// const AuthContext = createContext();

// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true,
// });

// export function AuthProvider({ children }) {
//   const { fetchMenu } = useMenu();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [user, setUser] = useState(null);
//   const [userPermissions, setUserPermissions] = useState(null);

//   const [userRoles, setUserRoles] = useState(null);
//   const [isLoading, setIsLoading] = useState(true);
//   useEffect(() => {
//     checkAuth();
//   }, []);
//   const login = async (email, password) => {
//     try {
//       const response = await api.post("/user/login", {
//         userName: email,
//         userPassword: password,
//       });

//       if (response.data.status === 200) {
//         await checkAuth();
//         return true;
//       }

//       return false;
//     } catch (err) {
//       if (err.response) {
//         const { status, data } = err.response;

//         if (status === 401) {
//           console.error("Login failed: Invalid email or password.");
//         } else {
//           console.error(
//             `Login failed: ${status} - ${data?.message || "Unknown error"}`
//           );
//         }
//       } else {
//         console.error("Login failed: Network error or server unreachable.");
//       }

//       setIsAuthenticated(false);
//       setUser(null);
//       setIsLoading(false);
//       throw err;
//     }
//   };
//   const checkAuth = async () => {
//     setIsLoading(true);

//     try {
//       const response = await api.get("/user/protected");
//       setIsAuthenticated(true);
//       const { roles, associatedSubMenus, ...userData } = response.data.user;
//       setUser(userData);
//       setUserRoles(roles);
//       setUserPermissions(associatedSubMenus);
//       await fetchMenu(roles);
//     } catch (err) {
//       if (err.response?.status === 401) {
//         try {
//           await axios
//             .post(`${API_URL}/user/refresh`, {}, { withCredentials: true })
//             .then(async (response) => {
//               await checkAuth();
//             });

//           setIsAuthenticated(true);
//         } catch (refreshError) {
//           setIsAuthenticated(false);
//           setUser(null);
//         }
//       } else {
//         setIsAuthenticated(false);
//         setUser(null);
//       }
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const logout = async () => {
//     try {
//       await api.post("/user/logout");
//       setIsAuthenticated(false);
//       setUser(null);
//       setUserPermissions(null);
//       setUserRoles(null);
//     } catch (err) {
//       console.error("Logout failed:", err);
//     }
//   };

//   return (
//     <AuthContext.Provider
//       value={{
//         isAuthenticated,
//         user,
//         userPermissions,
//         // userAccess,
//         userRoles,
//         login,
//         logout,
//         isLoading,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export const useAuth = () => useContext(AuthContext);




// import React, { createContext, useContext, useState } from "react";
// import api from "../shared/Auth/api";

// const MenuContext = createContext();

// export const MenuProvider = ({ children }) => {
//   const [menu, setMenu] = useState([]);

//   const fetchMenu = async (roles) => {
//     try {
//       const response = await api.post("/menu/by-roles", { roles });

//       setMenu(response.data.data);
//     } catch (error) {
//       console.error("Error fetching menu:", error);
//     }
//   };

//   return (
//     <MenuContext.Provider value={{ menu, fetchMenu }}>
//       {children}
//     </MenuContext.Provider>
//   );
// };

// export const useMenu = () => useContext(MenuContext);


// import axios from "axios";
// const API_URL = import.meta.env.VITE_API_URL;

// // Create Axios instance
// const api = axios.create({
//   baseURL: API_URL,
//   withCredentials: true, // Include cookies (e.g., refreshToken)
// });

// // Store token in memory
// let accessToken = null;

// export const setAccessToken = (token) => {
//   accessToken = token;
// };

// // Request interceptor to add Authorization header
// api.interceptors.request.use(
//   (config) => {
//     if (accessToken) {
//       config.headers.Authorization = `Bearer ${accessToken}`;
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // Response interceptor for token refresh
// let isRefreshing = false;
// let failedQueue = [];

// const processQueue = (error, token = null) => {
//   failedQueue.forEach((prom) => {
//     if (error) {
//       prom.reject(error);
//     } else {
//       prom.resolve(token);
//     }
//   });
//   failedQueue = [];
// };

// api.interceptors.response.use(
//   (response) => response,
//   async (error) => {
//     const originalRequest = error.config;

//     // Check if error is 401 and not a retry attempt
//     if (error.response?.status === 401 && !originalRequest._retry) {
//       if (isRefreshing) {
//         // Queue the request while refreshing
//         return new Promise((resolve, reject) => {
//           failedQueue.push({ resolve, reject });
//         })
//           .then((token) => {
//             originalRequest.headers.Authorization = `Bearer ${token}`;
//             return api(originalRequest);
//           })
//           .catch((err) => Promise.reject(err));
//       }

//       originalRequest._retry = true;
//       isRefreshing = true;

//       try {
//         // Refresh token
//         const response = await axios.post(`${API_URL}/user/refresh`, {}, {
//           withCredentials: true,
//         });
//         const newAccessToken = response.data.accessToken;
//         setAccessToken(newAccessToken);

//         // Update original request with new token
//         originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

//         // Process queued requests
//         processQueue(null, newAccessToken);

//         // Retry original request
//         return api(originalRequest);
//       } catch (refreshError) {
//         processQueue(refreshError);
//         // Clear token on refresh failure (e.g., logout needed)
//         setAccessToken(null);
//         return Promise.reject(refreshError);
//       } finally {
//         isRefreshing = false;
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default api;


// import React, { Suspense } from "react";
// import { BrowserRouter, Routes, Route, useLocation, Navigate } from "react-router-dom";
// import { AuthProvider, useAuth } from "./shared/Auth/AuthContext";
// import { MenuProvider } from "./routes/menu-context";
// import { ToastProvider } from "./shared/components/ToastModal";
// import { Toaster } from "sonner";
// import { Spinner } from "./components/ui/spinner";
// import Layout from "@/components/Layout";
// import { publicRoutes, authProtectedRoutes } from "./routes";

// // Loading component for reusability
// const LoadingSpinner = () => (
//   <div className="d-flex justify-content-center align-items-center vh-100">
//     <Spinner animation="border" variant="primary" />
//   </div>
// );

// // ProtectedRoute component
// function ProtectedRoute({ children }) {
//   const { isAuthenticated, isLoading } = useAuth();

//   if (isLoading) {
//     return (
//       <div className="d-flex justify-content-center align-items-center vh-100">
//         <Spinner animation="border" variant="primary" />
//       </div>
//     );
//   }
//   console.log("ProtectedRoute: isAuthenticated =", isAuthenticated);
//   return isAuthenticated ? children : <Navigate to="/login" replace />;
// }

// // PublicRoute component
// function PublicRoute({ children }) {
//   const { isAuthenticated, isLoading } = useAuth();
//   const location = useLocation();

//   console.log("PublicRoute: pathname =", location.pathname, "isAuthenticated =", isAuthenticated);

//   if (isLoading) {
//     console.log("PublicRoute: Loading state");
//     return <LoadingSpinner />;
//   }

//   // Allow /reset-code/:id and /reset-user-password/:id to be accessed by both authenticated and unauthenticated users
//   if (location.pathname.startsWith("/reset-code") || location.pathname.startsWith("/reset-user-password")) {
//     console.log("PublicRoute: Matched /reset-code or /reset-user-password route:", location.pathname);
//     return children;
//   }

//   // For /verify-password, check userEmail in location.state
//   if (
//     ["/verify-password"].includes(location.pathname) &&
//     !location?.state?.userEmail
//   ) {
//     console.log("PublicRoute: Redirecting to /login due to missing userEmail for", location.pathname);
//     return <Navigate to="/login" replace />;
//   }

//   // For other public routes (e.g., /login, /forgot-password), redirect authenticated users to /
//   console.log("PublicRoute: Applying default logic for", location.pathname);
//   return isAuthenticated ? <Navigate to="/" replace /> : children;
// }

// // AuthenticatedLayout component
// function AuthenticatedLayout({ children, name }) {
//   const location = useLocation();
//   const menuName = location?.state?.menu || name || "";
//   const data = { children, name: menuName };

//   return <Layout>{data}</Layout>;
// }

// function App() {
//   console.log("App: Rendering routes, publicRoutes =", publicRoutes.map(r => r.path));
//   return (
//     <MenuProvider>
//       <AuthProvider>
//         <BrowserRouter>
//           <Suspense
//             fallback={
//               <div className="d-flex justify-content-center align-items-center vh-100">
//                 <Spinner animation="border" variant="primary" />
//               </div>
//             }
//           >
//             <Routes>
//               {/* Public Routes */}
//               {publicRoutes.map((route, index) => (
//                 <Route
//                   key={index}
//                   path={route.path}
//                   element={
//                     <ToastProvider>
//                       <PublicRoute>{route.element}</PublicRoute>
//                     </ToastProvider>
//                   }
//                 />
//               ))}

//               {/* Protected Routes */}
//               <Route
//                 path="/*"
//                 element={
//                   <ProtectedRoute>
//                     <AuthenticatedLayout>
//                       <ToastProvider>
//                         <Routes>
//                           {authProtectedRoutes.map((route, index) => (
//                             <Route
//                               key={index}
//                               path={route.path}
//                               element={route.element}
//                               name={route.name}
//                             />
//                           ))}
//                           {/* Fallback for unmatched protected routes */}
//                           <Route path="*" element={<Navigate to="/dashboard" replace />} />
//                         </Routes>
//                       </ToastProvider>
//                     </AuthenticatedLayout>
//                   </ProtectedRoute>
//                 }
//               />
//               {/* Catch-all for unmatched routes */}
//               <Route
//                 path="*"
//                 element={
//                   <div>
//                     <h1>404: Route Not Found</h1>
//                     <p>Redirecting to login...</p>
//                     <Navigate to="/login" replace state={{ from: window.location.pathname }} />
//                   </div>
//                 }
//               />
//             </Routes>
//           </Suspense>
//           <Toaster position="top-right" richColors />
//         </BrowserRouter>
//       </AuthProvider>
//     </MenuProvider>
//   );
// }

// export default App;