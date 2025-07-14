/**
 * Configuration Next.js pour Jupiter Swap DApp
 * 
 * Cette configuration optimise l'application pour la production avec :
 * - Intégration Sentry pour le monitoring
 * - Support des polyfills pour les bibliothèques Solana
 * - Optimisations de bundle et performance
 * - Configuration de sécurité appropriée
 * 
 * @author Manus AI
 * @version 1.0.0
 */

const { withSentryConfig } = require('@sentry/nextjs');
const webpack = require('webpack');

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuration de base
  reactStrictMode: true,
  swcMinify: true,
  
  // Configuration expérimentale pour les optimisations
  experimental: {
    // Optimisation des imports pour réduire la taille du bundle
    optimizePackageImports: [
      '@solana/web3.js',
      '@solana/spl-token',
      'lucide-react',
      'recharts'
    ],
    // Activation du turbo mode pour des builds plus rapides
    turbo: {
      rules: {
        '*.svg': {
          loaders: ['@svgr/webpack'],
          as: '*.js',
        },
      },
    },
  },

  // Configuration des images pour l'optimisation
  images: {
    domains: [
      'raw.githubusercontent.com', // Pour les logos de tokens
      'cdn.jsdelivr.net',          // CDN pour les assets
      'arweave.net',               // Stockage décentralisé
    ],
    formats: ['image/webp', 'image/avif'],
    minimumCacheTTL: 60 * 60 * 24 * 7, // Cache 7 jours
  },

  // Configuration Webpack pour les polyfills Solana
  webpack: (config, { isServer, webpack }) => {
    // Polyfills nécessaires pour les bibliothèques Solana dans le navigateur
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        net: false,
        tls: false,
        crypto: require.resolve('crypto-browserify'),
        stream: require.resolve('stream-browserify'),
        buffer: require.resolve('buffer'),
        process: require.resolve('process/browser'),
        zlib: require.resolve('browserify-zlib'),
        path: require.resolve('path-browserify'),
        os: require.resolve('os-browserify/browser'),
        http: require.resolve('stream-http'),
        https: require.resolve('https-browserify'),
        assert: require.resolve('assert'),
      };

      // Ajout des plugins nécessaires
      config.plugins.push(
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
          process: 'process/browser',
        }),
        // Définir les variables d'environnement pour le client
        new webpack.DefinePlugin({
          'process.env.NEXT_PUBLIC_SOLANA_NETWORK': JSON.stringify(process.env.NEXT_PUBLIC_SOLANA_NETWORK || 'mainnet-beta'),
          'process.env.NEXT_PUBLIC_HELIUS_API_KEY': JSON.stringify(process.env.NEXT_PUBLIC_HELIUS_API_KEY),
        }),
        // Ignorer les avertissements spécifiques liés à Solana
        new webpack.IgnorePlugin({
          resourceRegExp: /^encoding$/,
          contextRegExp: /node-fetch/,
        })
      );
      
      // Optimiser les chunks pour les bibliothèques Solana
      config.optimization.splitChunks = {
        ...config.optimization.splitChunks,
        cacheGroups: {
          ...config.optimization.splitChunks.cacheGroups,
          solana: {
            test: /[\\/]node_modules[\\/](@solana|@project-serum|@metaplex|borsh|bs58)[\\/]/,
            name: 'solana-vendors',
            chunks: 'all',
            priority: 10,
          },
        },
      };
    }

    // Optimisation des modules externes
    config.externals = config.externals || [];
    if (isServer) {
      config.externals.push({
        'utf-8-validate': 'commonjs utf-8-validate',
        'bufferutil': 'commonjs bufferutil',
        'encoding': 'commonjs encoding',
      });
    }
    
    // Augmenter la taille maximale des assets pour les bibliothèques Solana
    config.performance = {
      ...config.performance,
      maxEntrypointSize: 512000,
      maxAssetSize: 512000,
      hints: isServer ? false : 'warning',
    };

    return config;
  },

  // Configuration des en-têtes de sécurité
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          // Ajouter des en-têtes de sécurité supplémentaires
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          // Autoriser les requêtes vers les APIs externes
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
      // En-têtes spécifiques pour les appels API
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ];
  },

  // Configuration des redirections
  async redirects() {
    return [
      {
        source: '/swap',
        destination: '/',
        permanent: true,
      },
    ];
  },

  // Configuration des rewrites pour l'API
  async rewrites() {
    return [
      {
        source: '/api/jupiter/:path*',
        destination: 'https://quote-api.jup.ag/v6/:path*',
        // Ajouter des en-têtes personnalisés pour éviter les erreurs 403
        has: [
          {
            type: 'header',
            key: 'user-agent',
          },
        ],
      },
      // Rewrite pour l'API Helius
      {
        source: '/api/helius/:path*',
        destination: 'https://api.helius.xyz/v0/:path*',
      },
      // Fallback pour les autres APIs
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },

  // Variables d'environnement publiques
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },

  // Configuration de la compression
  compress: true,

  // Configuration du trailing slash
  trailingSlash: false,

  // Configuration de la génération de source maps
  productionBrowserSourceMaps: process.env.NODE_ENV === 'development',

  // Configuration des optimisations de build
  compiler: {
    // Suppression des console.log en production
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },

  // Configuration de l'analyse de bundle (optionnelle)
  ...(process.env.ANALYZE === 'true' && {
    webpack: (config, { isServer }) => {
      if (!isServer) {
        const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
        config.plugins.push(
          new BundleAnalyzerPlugin({
            analyzerMode: 'static',
            openAnalyzer: false,
            reportFilename: '../bundle-analyzer-report.html',
          })
        );
      }
      return config;
    },
  }),
};

// Configuration Sentry pour le monitoring en production
const sentryWebpackPluginOptions = {
  // Configuration pour l'upload des source maps
  org: process.env.SENTRY_ORG,
  project: process.env.SENTRY_PROJECT,
  
  // Suppression des logs de build Sentry
  silent: true,
  
  // Configuration de l'upload des source maps
  widenClientFileUpload: true,
  hideSourceMaps: true,
  disableLogger: true,
  
  // Configuration du tunnel pour éviter les bloqueurs de pub
  tunnelRoute: '/monitoring',
  
  // Configuration des releases automatiques
  automaticVercelMonitors: true,
};

// Export de la configuration avec ou sans Sentry selon l'environnement
module.exports = process.env.NEXT_PUBLIC_SENTRY_DSN
  ? withSentryConfig(nextConfig, sentryWebpackPluginOptions)
  : nextConfig;
