"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect } from "react"; // <-- 1. Импортирај го useEffect

export default function Navbar() {
    // 2. Додади 'loading' од AuthContext
    const { user, logout, loading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    // 3. Премести ја логиката за редирекција во useEffect
    useEffect(() => {
        // Чекаме да заврши вчитувањето
        if (loading) return;

        // Ако вчитувањето е завршено и нема корисник, редиректирај
        // Исто така, провери дали веќе не сме на страница за најава/регистрација за да избегнеш циклус
        if (!user && pathname !== "/signin" && pathname !== "/signup") {
            router.push("/signin");
        }
    }, [user, loading, pathname, router]); // 4. Додај ги зависностите

    const handleLogout = () => {
        logout();
        // logout функцијата веќе ќе се погрижи за редирекцијата
    };

    // 5. Прикажи состојба на вчитување или ништо додека не се знае статусот на корисникот
    // Ова спречува кратко "блеснување" на навигацијата пред редирекција
    if (loading || !user) {
        return null; // или врати некој спинер/скелетон
    }

    const getLinkClass = (href) =>
        `transition-colors text-[.9rem] ${pathname === href ? "font-semibold underline" : ""}`;

    // 6. Сега кога сме сигурни дека 'user' постои, можеме безбедно да го користиме
    return (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[85%] bg-[#ffffffcc] backdrop-blur-xl border border-[#e5e7eb] shadow-xl rounded-2xl z-50">
            <div className="flex items-center justify-between px-8 py-3">
                <Link
                    href="/dashboard"
                    className="text-2xl font-bold tracking-tight hover:text-[#4338ca] transition-colors text-[1.2rem]"
                    style={{ color: "#4f46e5" }}
                >
                    E-Learning
                </Link>

                <ul className="flex items-center gap-8 font-medium !mb-0 !pr-0">
                    {user.role === "professor" ? (
                        <>
                            {/* ... линкови за професор ... */}
                            <li>
                                <Link href="/dashboard/my-courses" className={`${getLinkClass("/dashboard/my-courses")} hover:text-[#4f46e5]`}>My Courses</Link>
                            </li>
                            <li>
                                <Link href="/dashboard/news" className={`${getLinkClass("/dashboard/news")} hover:text-[#4f46e5]`}>News</Link>
                            </li>
                            <li>
                                <Link href="/dashboard/students" className={`${getLinkClass("/dashboard/students")} hover:text-[#4f46e5]`}>Students</Link>
                            </li>
                            <li>
                                <Link href="/dashboard/my-profile" className={`${getLinkClass("/dashboard/my-profile")} hover:text-[#4f46e5]`}>My profile</Link>
                            </li>
                        </>
                    ) : (
                        <>
                            {/* ... линкови за студент ... */}
                            <li>
                                <Link href="/dashboard/courses" className={`${getLinkClass("/dashboard/courses")} hover:text-[#4f46e5]`}>All Courses</Link>
                            </li>
                            <li>
                                <Link href="/dashboard/my-courses" className={`${getLinkClass("/dashboard/my-courses")} hover:text-[#4f46e5]`}>My Courses</Link>
                            </li>
                            <li>
                                <Link href="/dashboard/news" className={`${getLinkClass("/dashboard/news")} hover:text-[#4f46e5]`}>Notifications</Link>
                            </li>
                            <li>
                                <Link href="/dashboard/my-profile" className={`${getLinkClass("/dashboard/my-profile")} hover:text-[#4f46e5]`}>My profile</Link>
                            </li>
                        </>
                    )}
                </ul>

                <div className="flex items-center gap-6">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={handleLogout}
                        className="px-5 py-2 !rounded-xl font-medium shadow-md transition-colors text-[.9rem]"
                        style={{
                            backgroundColor: "#4f46e5",
                            color: "#ffffff",
                        }}
                    >
                        Logout
                    </motion.button>
                </div>
            </div>
        </div>
    );
}