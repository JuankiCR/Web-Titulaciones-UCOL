/** @type {import('next').NextConfig} */
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const nextConfig = {
  reactStrictMode: true,
  
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
      '@fonts': path.resolve(__dirname, 'public/assets/fonts'),
      '@logos': path.resolve(__dirname, 'public/assets/logos'),
      '@icons': path.resolve(__dirname, 'public/assets/icons'),
      '@components': path.resolve(__dirname, 'src/components'),
      '@services': path.resolve(__dirname, 'src/services'),
      '@data': path.resolve(__dirname, 'src/data'),
      '@apptypes': path.resolve(__dirname, 'src/types'),
    };

    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
};

export default nextConfig;
