import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Return the service worker file
  const swContent = `
    // Service Worker for PWA functionality
    self.addEventListener('install', (event) => {
      console.log('Service Worker installed');
    });

    self.addEventListener('activate', (event) => {
      console.log('Service Worker activated');
    });

    self.addEventListener('fetch', (event) => {
      // Handle fetch events here
    });
  `;

  return new NextResponse(swContent, {
    headers: {
      'Content-Type': 'application/javascript',
      'Cache-Control': 'no-cache',
    },
  });
}