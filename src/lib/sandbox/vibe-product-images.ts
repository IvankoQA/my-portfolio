/**
 * One image URL per catalog SKU (Unsplash only). Each URL was checked against
 * the product title/category; anything ambiguous uses `undefined` so the UI
 * shows the deterministic gradient placeholder (`ProductImageGradient`).
 *
 * Hostnames are allowlisted in `next.config.ts`.
 */

import type { VibeProduct } from "@/lib/sandbox/vibe-store-data"

function unsplash(photoId: string): string {
  return `https://images.unsplash.com/photo-${photoId}?auto=format&fit=crop&w=480&q=80`
}

/** Curated per `id`; keys mirror `SB_PRODUCTS`. */
const VIBE_PRODUCT_IMAGE_BY_ID: Record<string, string | undefined> = {
  // Rubber ducks — verified toy rubber-duck photos (Unsplash)
  p01: unsplash("1720117386029-2e30f1959e78"),
  p02: unsplash("1649055984069-e075c1074256"),
  p03: unsplash("1720117666954-2ca0e960b657"),
  p04: unsplash("1720117386029-2e30f1959e78"),
  p05: unsplash("1649055984069-e075c1074256"),
  p06: unsplash("1720117666954-2ca0e960b657"),

  // Mugs & coffee — classic café / cup still lifes
  p07: unsplash("1495474472287-4d71bcdd2085"),
  p08: unsplash("1509042239860-f550ce710b93"),
  p09: unsplash("1461023058943-07fcbe16d735"),
  p10: unsplash("1504753793650-d4a2b783c15e"),
  p11: unsplash("1499636136210-6f4ee915583e"),
  p12: unsplash("1558961363-fa8fdf82db35"),
  p43: unsplash("1611532736597-de2d4265fba3"),

  // Stickers — desk / sticky-note textures (no ambiguous “random stock” people)
  p13: unsplash("1586892478407-7f54fcec5b89"),
  p14: unsplash("1586892478025-2b5472316f22"),
  p15: unsplash("1586892477901-f70e288a7318"),
  p16: unsplash("1550483428-f9a3cb69a789"),
  p17: unsplash("1550483428-9facac419319"),
  p18: unsplash("1633180888652-c561b86040f1"),
  p42: unsplash("1586892477838-2b96e85e0f96"),

  // Apparel — no literal product match without model shots; gradient only
  p19: undefined,
  p20: undefined,
  p21: undefined,
  p22: undefined,
  p23: undefined,
  p24: undefined,
  p44: undefined,

  // Desk tools & gadgets
  p25: unsplash("1547394765-185e1e68f34e"),
  p26: unsplash("1579326882518-21eaa7893b02"),
  p27: unsplash("1623177623442-979c1e42c255"),
  p28: unsplash("1760348213270-7cd00b8c3405"),
  p29: unsplash("1760376789478-c1023d2dc007"),
  p30: unsplash("1650566301820-ded93a1bb635"),
  p31: undefined,
  p32: unsplash("1700547949736-024ad8cb56cd"),
  p41: undefined,

  // Books & audiobook
  p33: unsplash("1544947950-fa07a98d237f"),
  p34: unsplash("1524995997946-a1c2e315a42f"),
  p35: unsplash("1555066931-4365d14bab8c"),
  p36: unsplash("1658198406843-29206c1b01a8"),

  // Snacks
  p37: unsplash("1562878423-eb50aaa70328"),
  p38: undefined,
  p39: unsplash("1533602933119-70608e48905d"),
  p40: undefined,
}

export function vibeProductImageUrl(
  p: Pick<VibeProduct, "id">,
): string | undefined {
  const url = VIBE_PRODUCT_IMAGE_BY_ID[p.id]
  if (url) return url
  return undefined
}
