// app/blog/template.tsx
import React from 'react';

import Header from '@/components/UCOL/ui/Header/StudentHeader';

import './globals.css';

export default function TeacherTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  );
}
