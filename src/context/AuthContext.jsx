import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import jwtDecode from "jwt-decode";

const TOKEN_KEY = "transportation_auth_token";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const navigate = useNavigate();

  const decodeToken = useCallback((token) => {
    try {
      if (!token) return null;
      const decoded = jwtDecode(token);
      return {
        id: decoded.sub,
        email: decoded.email,
        name: decoded.name,
        roles: Array.isArray(decoded.roles) ? decoded.roles : ["user"],
        exp: decoded.exp,
      };
    } catch (error) {
      console.error("Failed to decode token:", error);
      return null;
    }
  }, []);

  const login = useCallback(
    async (email, password) => {
      try {
        setIsLoading(true);
        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        // Mock user data
        const mockUsers = [
          {
            email: "admin@example.com",
            password: "admin123",
            name: "Admin User",
            roles: ["admin"],
          },
          {
            email: "user@example.com",
            password: "user123",
            name: "Regular User",
            roles: ["user"],
          },
        ];

        const user = mockUsers.find(
          (u) => u.email === email && u.password === password
        );

        if (!user) {
          throw new Error("Invalid email or password");
        }

        const mockToken = `mock-jwt-token-${Date.now()}`;
        localStorage.setItem(TOKEN_KEY, mockToken);

        const userData = {
          id: `user-${Date.now()}`,
          email: user.email,
          name: user.name,
          roles: user.roles,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
        };

        setToken(mockToken);
        setUser(userData);
        localStorage.setItem("user", JSON.stringify(userData));

        toast.success("Login successful!");
        navigate("/dashboard");
        return true;
      } catch (error) {
        console.error("Login failed:", error);
        toast.error(error.message || "Login failed. Please try again.");
        return false;
      } finally {
        setIsLoading(false);
      }
    },
    [navigate]
  );

  const logout = useCallback(
    (message = "You have been logged out.") => {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem("user");
      setToken(null);
      setUser(null);
      toast.success(message);
      navigate("/login");
    },
    [navigate]
  );

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (token) {
          const userData = decodeToken(token);
          if (userData) {
            setUser(userData);
          } else {
            localStorage.removeItem(TOKEN_KEY);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        localStorage.removeItem(TOKEN_KEY);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, [token, decodeToken]);

  const value = {
    isAuthenticated: !!user,
    isLoading,
    user,
    token,
    login,
    logout,
    hasRole: (requiredRoles) => {
      if (!user?.roles) return false;
      if (requiredRoles.length === 0) return true;
      return requiredRoles.some((role) => user.roles.includes(role));
    },
  };

  return (
    <AuthContext.Provider value={value}>
      {!isLoading ? children : <div>Loading authentication...</div>}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthContext;
