import { defineConfig } from '@tanstack/start/config'
import { TanStackRouterPlugin } from '@tanstack/router-plugin/vite'
import { execSync } from 'child_process'

const commitHash = execSync('git rev-parse --short HEAD').toString().trim()

export default defineConfig({
  vite: {
    plugins: [
      TanStackRouterPlugin({
        routesDirectory: './app/routes',
        generatedRouteTree: './app/routeTree.gen.ts',
      }),
    ],
    define: {
      'import.meta.env.VITE_GIT_COMMIT_SHA': JSON.stringify(commitHash),
    },
  },
  server: {
    preset: 'node-server',
  },
})