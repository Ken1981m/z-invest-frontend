import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteTsconfigPaths from "vite-tsconfig-paths"
import path from "path";
import fs from "fs";

const configFolder = path.resolve(__dirname, 'config');
const matcher = /config\.(\w+)\.json/;

export const configFiles = fs
    .readdirSync(configFolder)
    .filter((file) => file.match(matcher))
    .map((file) => ({
      filePath: path.resolve(configFolder, file),
      name: matcher.exec(file)?.[1]
    }))
    .filter(({ filePath }) => fs.existsSync(filePath));

export function readConfigs(files) {
  return files
      .map(({ name, filePath }) => [name, fs.readFileSync(filePath)])
      .reduce((config, [name, file]) => ({ ...config, [name]: JSON.parse(file) }), {});
}


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), viteTsconfigPaths()],
  define: {
    'process.env.config': readConfigs(configFiles)
  },
  server: {
    host: true,
    strictPort: true,
    port: 8000,
    },
})
