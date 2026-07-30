'use client';

import React from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}

export function SearchBar({ value, onChange, placeholder }: SearchBarProps) {
  return (
    <div className="relative w-full md:w-96">
      <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#9E938B]" />
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-[#1C1714] rounded-lg pl-10 pr-4 py-2 text-sm text-[#F4F0EB] focus:outline-none focus:ring-1 focus:ring-[#C66B3D]"
      />
    </div>
  );
}