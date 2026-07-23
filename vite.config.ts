import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from "vite-tsconfig-paths";
import { traeBadgePlugin } from 'vite-plugin-trae-solo-badge';

// https://vite.dev/config/
export default defineConfig({
  base: process.env.BASE_PATH || '/',
  build: {
    sourcemap: 'hidden',
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // 按依赖类型拆分 vendor，提升缓存命中率与首屏加载速度
        manualChunks(id) {
          if (!id.includes('node_modules')) return;
          // PDF / 截图导出相关（仅 AssessReport 使用，懒加载后单独成块）
          if (id.includes('jspdf') || id.includes('html2canvas') || id.includes('purify.es')) {
            return 'pdf-vendor';
          }
          // Office 文档导出相关
          if (id.includes('docx') || id.includes('xlsx') || id.includes('file-saver')) {
            return 'office-vendor';
          }
          // React 核心
          if (id.includes('react-router') || id.includes('react-dom') || id.includes('/react/') || id.includes('zustand')) {
            return 'react-vendor';
          }
          // 图标库
          if (id.includes('lucide-react')) {
            return 'icons-vendor';
          }
          // 其它第三方依赖
          return 'vendor';
        },
      },
    },
  },
  server: {
    watch: {
      ignored: ['**/.pnpm-store/**', '**/node_modules/**'],
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          'react-dev-locator',
        ],
      },
    }),
    traeBadgePlugin({
      variant: 'dark',
      position: 'bottom-right',
      prodOnly: true,
      clickable: true,
      clickUrl: 'https://www.trae.ai/solo?showJoin=1',
      autoTheme: true,
      autoThemeTarget: '#root'
    }), 
    tsconfigPaths()
  ],
})
