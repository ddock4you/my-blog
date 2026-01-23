"use client";

import { createContext, useContext, ReactNode } from "react";
import { SearchData } from "@/lib/post";

interface SearchContextType {
  searchData: SearchData[];
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export function SearchProvider({
  children,
  searchData,
}: {
  children: ReactNode;
  searchData: SearchData[];
}) {
  return <SearchContext.Provider value={{ searchData }}>{children}</SearchContext.Provider>;
}

export function useSearchData() {
  const context = useContext(SearchContext);
  if (context === undefined) {
    throw new Error("useSearchData must be used within a SearchProvider");
  }
  return context;
}
