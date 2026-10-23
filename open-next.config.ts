import { defineCloudflareConfig } from "@opennextjs/cloudflare";
import staticAssetsIncrementalCache from "@opennextjs/cloudflare/overrides/incremental-cache/static-assets-incremental-cache";

// Сайт повністю статичний (без ISR), тому сторінки віддаються зі static assets без R2/KV.
// Кеш лише для читання: Next 16 намагається записувати route-cache на кожен запит,
// тож запис тихо ігноруємо, щоб не засмічувати логи Workers помилками.
const readOnlyAssetsCache = Object.assign(Object.create(staticAssetsIncrementalCache), {
  async set() {},
});

export default defineCloudflareConfig({
  incrementalCache: readOnlyAssetsCache,
  enableCacheInterception: true,
});
