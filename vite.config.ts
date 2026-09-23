import { defineConfig } from "vite";
import { tanstackStart } from "@tanstack/react-start/plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import tsConfigPaths from "vite-tsconfig-paths";
import { nitro } from "nitro/vite";

export default defineConfig({
  server: {
    // Dev server frontend berjalan di port 8080 (samakan dengan yang kamu pakai).
    host: true,
    port: 8080,
    // Gagal (bukan pindah port) bila 8080 sudah dipakai, biar konsisten.
    strictPort: true,
  },
  preview: {
    port: 8080,
    strictPort: true,
  },
  plugins: [
    // Resolve TypeScript path aliases (e.g. "@/...").
    tsConfigPaths(),
    tailwindcss(),
    // TanStack Start. Server entry points to src/server.ts (our SSR error wrapper).
    tanstackStart({
      server: { entry: "server" },
    }),
    // Nitro builds the server output.
    nitro(),
    viteReact(),
  ],
});
