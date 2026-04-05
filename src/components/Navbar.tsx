import { Link, useLocation } from "react-router-dom";
import { Moon, Sun, BookOpen, Settings, Home, User } from "lucide-react";
import { useLearning } from "@/context/LearningContext";
import { motion } from "framer-motion";

export default function Navbar() {
  const { darkMode, toggleDarkMode } = useLearning();
  const location = useLocation();

  const links = [
    { to: "/", label: "Home", icon: Home },
    { to: "/profile", label: "Profile", icon: User },
    { to: "/admin", label: "Admin", icon: Settings },
  ];

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="fixed top-0 left-0 right-0 z-50 glass border-b"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold gradient-text">CodeLearn</span>
          </Link>

          <div className="flex items-center gap-1">
            {links.map((link) => {
              const isActive = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary/10 text-primary"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted"
                  }`}
                >
                  <link.icon className="w-4 h-4" />
                  <span className="hidden sm:inline">{link.label}</span>
                </Link>
              );
            })}
            <button
              onClick={toggleDarkMode}
              className="ml-2 p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>
    </motion.nav>
  );
}
