'use client';
import { useEffect } from 'react';

export default function NoBackground() {
  useEffect(() => {
    document.body.classList.add('no-bg');
    return () => document.body.classList.remove('no-bg');
  }, []);

  return null;
}
