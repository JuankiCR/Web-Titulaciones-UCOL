// app/blog/template.tsx
import React from 'react';

import '../../globals.css';

export default function TeacherTemplate({ children }: { children: React.ReactNode }) {
  return (
    <div>
      {children}
    </div>
  );
}
