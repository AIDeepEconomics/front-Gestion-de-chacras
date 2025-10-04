import { createContext, useContext, useState, ReactNode } from "react";

export type UserType = "productor" | "molino";

export interface MockUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  type: UserType;
  organization?: string;
}

interface UserContextType {
  currentUser: MockUser;
  setCurrentUser: (user: MockUser) => void;
  isProductor: boolean;
  isMolino: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

// Mock users
export const MOCK_USERS: Record<string, MockUser> = {
  productor: {
    id: "1",
    name: "Juan Carlos Rodríguez",
    email: "juan.rodriguez@example.com",
    initials: "JR",
    type: "productor"
  },
  molino: {
    id: "2",
    name: "María González",
    email: "maria.gonzalez@molinolospinos.com",
    initials: "MG",
    type: "molino",
    organization: "Molino Los Pinos"
  }
};

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser, setCurrentUser] = useState<MockUser>(MOCK_USERS.productor);

  const isProductor = currentUser.type === "productor";
  const isMolino = currentUser.type === "molino";

  return (
    <UserContext.Provider value={{ currentUser, setCurrentUser, isProductor, isMolino }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
