#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# convert-webp.sh
# Converteert alle bruikbare afbeeldingen in assets/Images/ naar WebP.
#   - Maximale breedte: 1920px (hero's), behoud aspect ratio
#   - Kwaliteit: 82  (scherp genoeg, ~60-80% kleiner dan JPEG)
#   - Slaat old stock en reserve over
#   - Overschrijft bestaande .webp bestanden niet (gebruik --force om dat te doen)
# Gebruik:
#   bash scripts/convert-webp.sh          # normaal
#   bash scripts/convert-webp.sh --force  # overschrijf bestaande webp's
# ─────────────────────────────────────────────────────────────────────────────

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
IMG_ROOT="$(cd "$SCRIPT_DIR/../assets/Images" && pwd)"
QUALITY=82
MAX_WIDTH=1920
FORCE=false

[[ "${1:-}" == "--force" ]] && FORCE=true

converted=0
skipped=0
errors=0

find "$IMG_ROOT" -type f \( -iname "*.jpg" -o -iname "*.jpeg" -o -iname "*.png" -o -iname "*.avif" \) | \
  grep -v "/old stock/" | \
  grep -v "/reserve/" | \
  sort | \
while read -r src; do
    webp="${src%.*}.webp"

    if [[ -f "$webp" && "$FORCE" == false ]]; then
        echo "  SKIP  $(basename "$webp") (bestaat al)"
        ((skipped++)) || true
        continue
    fi

    if convert "$src" \
        -resize "${MAX_WIDTH}x>" \
        -quality "$QUALITY" \
        -define webp:method=6 \
        "$webp" 2>/dev/null; then

        orig_kb=$(du -k "$src" | cut -f1)
        new_kb=$(du -k "$webp" | cut -f1)
        echo "  OK    $(basename "$src") → $(basename "$webp")  (${orig_kb}KB → ${new_kb}KB)"
        ((converted++)) || true
    else
        echo "  FOUT  $src"
        ((errors++)) || true
    fi
done

echo ""
echo "Klaar. Gebruik --force om bestaande .webp bestanden te overschrijven."
