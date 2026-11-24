// @lovable.dev/vite-tanstack-config already includes the following — do NOT add them manually
// or the app will break with duplicate plugins:
//   - TanStack devtools (dev-only, first), tanstackStart, viteReact, tailwindcss, tsConfigPaths,
//     nitro (build-only using cloudflare as a default target), VITE_* env injection, @ path alias,
//     React/TanStack dedupe, error logger plugins, and sandbox detection (port/host/strictPort).
// You can pass additional config via defineConfig({ vite: { ... }, etc... }) if needed.
import { defineConfig } from "@lovable.dev/vite-tanstack-config";
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

/**
 * The TanStack devtools bundler annotates every JSX element with
 * `data-tsd-source` so the inspector can point at the source file. React Three
 * Fiber forwards unknown props onto the underlying three.js objects, and that
 * attribute makes the scene builder throw while a canvas is (re)mounted. The
 * annotation is meaningless for a 3D scene, so it is removed from the modules
 * that render one.
 */
function stripTsdSourceFromScenes(): Plugin {
  const sceneModules = new Set<string>();

  return {
    name: "eyercall:strip-tsd-source-from-scenes",
    enforce: "post",
    load(id) {
      const file = id.split("?")[0] ?? id;
      if (!file.includes("/src/") || !/\.tsx?$/.test(file)) return null;
      try {
        const source = readFileSync(file, "utf8");
        if (/@react-three\/(fiber|drei)/.test(source)) sceneModules.add(file);
      } catch {
        // A module that cannot be read is simply not a scene module.
      }
      return null;
    },
    transform(code, id) {
      const file = id.split("?")[0] ?? id;
      const isScene = sceneModules.has(file) || /react-three-(fiber|drei)/.test(code);
      if (!isScene) return null;
      if (!code.includes("data-tsd-source")) return null;
      return {
        // Matches both the JSX form and the compiled object form.
        code: code.replace(/\s*"?data-tsd-source"?\s*[:=]\s*"[^"]*"\s*,?/g, ""),
        map: null,
      };
    },
  };
}

/** Serve isolated HTML entries before TanStack's development SSR catch-all. */
function sourceDemoAssets(): Plugin {
  return {
    name: 'eyercall:source-demo-assets',
    configureServer(server) {
      const directory = path.resolve('public/software-demo-assets');
      server.middlewares.use((request, response, next) => {
        if (!request.url?.startsWith('/software-demo-assets/')) return next();
        const relative = decodeURIComponent(request.url.split('?')[0]!.slice('/software-demo-assets/'.length));
        const file = path.resolve(directory, relative);
        if (!file.startsWith(directory + path.sep) || !existsSync(file)) return next();
        const types: Record<string,string> = {'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.woff':'font/woff','.woff2':'font/woff2','.svg':'image/svg+xml','.png':'image/png','.jpg':'image/jpeg'};
        response.setHeader('Content-Type', types[path.extname(file)] ?? 'application/octet-stream');
        response.end(readFileSync(file));
      });
    },
  };
}

export default defineConfig({
  tanstackStart: {
    // Redirect TanStack Start's bundled server entry to src/server.ts (our SSR error wrapper).
    // nitro/vite builds from this
    server: { entry: "server" },
  },
  vite: {
    plugins: [stripTsdSourceFromScenes(), sourceDemoAssets()],
    // Pin the dev server to the canonical Eyercall URL. strictPort makes a real
    // conflict fail loudly instead of silently drifting to 8081/8082/…
    // Bind to localhost only so the dev server is never exposed to the network.
    server: {
      port: 8080,
      strictPort: true,
      host: "localhost",
    },
  },
});
