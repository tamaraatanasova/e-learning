"use client";

import Link from "next/link";
import { useAuth } from "../context/AuthContext";
import { useRouter, usePathname } from "next/navigation";
import { motion } from "framer-motion";

export default function Navbar() {
    const { user, logout } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const handleLogout = () => {
        logout();
        router.push("/signin");
    };

    if (!user) {
        router.push("/signin");
    }

    const getLinkClass = (href) =>
        `transition-colors text-[.9rem] ${pathname === href ? "font-semibold underline" : ""}`;

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
                            <li>
                                <Link
                                    href="/dashboard/my-courses"
                                    className={`${getLinkClass("/dashboard/my-courses")} hover:text-[#4f46e5]`}
                                    style={{ color: "#374151" }}
                                >
                                    My Courses
                                </Link>
                            </li>

                            <li>
                                <Link
                                    href="/dashboard/news"
                                    className={`${getLinkClass("/dashboard/news")} hover:text-[#4f46e5]`}
                                    style={{ color: "#374151" }}
                                >
                                    News
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/students"
                                    className={`${getLinkClass("/dashboard/students")} hover:text-[#4f46e5]`}
                                    style={{ color: "#374151" }}
                                >
                                    Students
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/my-profile"
                                    className={`${getLinkClass("/dashboard/my-profile")} hover:text-[#4f46e5]`}
                                    style={{ color: "#374151" }}
                                >
                                    My profile
                                </Link>
                            </li>
                        </>
                    ) : (
                        <>
                            <li>
                                <Link
                                    href="/dashboard/courses"
                                    className={`${getLinkClass("/dashboard/courses")} hover:text-[#4f46e5]`}
                                    style={{ color: "#374151" }}
                                >
                                    All Courses
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/my-courses"
                                    className={`${getLinkClass("/dashboard/my-courses")} hover:text-[#4f46e5]`}
                                    style={{ color: "#374151" }}
                                >
                                    My Courses
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/news"
                                    className={`${getLinkClass("/dashboard/news")} hover:text-[#4f46e5]`}
                                    style={{ color: "#374151" }}
                                >
                                    Notifications
                                </Link>
                            </li>
                            <li>
                                <Link
                                    href="/dashboard/my-profile"
                                    className={`${getLinkClass("/dashboard/my-profile")} hover:text-[#4f46e5]`}
                                    style={{ color: "#374151" }}
                                >
                                    My profile
                                </Link>
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
