// CatRenderer for Cat Elementary
// Generates stylized, hand-drawn vector SVG graphics matching the warm cartoon reference:
// - Bold ink-like outlines (dark slate stroke)
// - Sparkling round cartoon eyes with double highlight shines
// - Fluffy cheek bumps
// - Wearing cute school uniforms (polo shirts), tiny backpacks, and little sneakers on their paws!

export const CAT_BREEDS = {
  siamese: {
    name: "Siamese",
    primary: "#f3eae1",
    secondary: "#5d4437",
    eyes: "#4fc3f7",
    nose: "#e57373"
  },
  tabby: {
    name: "Orange Tabby",
    primary: "#ffb74d",
    secondary: "#e65100",
    eyes: "#81c784",
    nose: "#e57373"
  },
  calico: {
    name: "Calico",
    primary: "#ffffff",
    secondary: "#e67e22",
    extra: "#34495e",
    eyes: "#81c784",
    nose: "#e57373"
  },
  tuxedo: {
    name: "Tuxedo",
    primary: "#2c3e50",
    secondary: "#ffffff",
    eyes: "#f1c40f",
    nose: "#ff8a80"
  },
  persian: {
    name: "Persian",
    primary: "#f2f4f4",
    secondary: "#bdc3c7",
    eyes: "#4fc3f7",
    nose: "#ff8a80",
    isFluffy: true
  },
  russianblue: {
    name: "Russian Blue",
    primary: "#7f8c8d",
    secondary: "#34495e",
    eyes: "#2ecc71",
    nose: "#e57373"
  }
};

export const CatRenderer = {
  getSVG(breedId, collarColor = "#ff3333") {
    const breed = CAT_BREEDS[breedId] || CAT_BREEDS.tabby;
    const p = breed.primary;
    const s = breed.secondary;
    const eyes = breed.eyes;
    const nose = breed.nose;

    // Determine paw color based on breed (Siamese and Tuxedo have dark/white paws)
    const pawColor = (breedId === "siamese" || breedId === "tuxedo") ? s : p;

    let bodyHTML = "";
    let headHTML = "";
    let earsHTML = "";
    let faceHTML = "";
    let collarHTML = "";

    // 1. Tail (curved and striped/colored, bold stroke)
    const tailColor = breedId === "siamese" || breedId === "russianblue" ? s : p;
    bodyHTML += `
      <!-- Tail -->
      <path d="M 68,64 C 82,64 88,38 78,28 C 72,22 73,32 76,36 C 80,42 78,54 66,54" 
            fill="${tailColor}" stroke="#2c3e50" stroke-width="2.5" stroke-linejoin="round" />
    `;
    
    // Tabby tail stripes
    if (breedId === "tabby") {
      bodyHTML += `
        <path d="M 75,34 Q 78,32 76,30" stroke="${s}" stroke-width="2.5" fill="none" />
        <path d="M 77,40 Q 80,38 78,36" stroke="${s}" stroke-width="2.5" fill="none" />
        <path d="M 75,48 Q 78,46 76,44" stroke="${s}" stroke-width="2.5" fill="none" />
      `;
    }

    // 2. Body (Natural Cat Body)
    bodyHTML += `
      <!-- Body -->
      <ellipse cx="48" cy="62" rx="19" ry="13" fill="${p}" stroke="#2c3e50" stroke-width="2.5" />
    `;

    // Overlays for specific breeds (Calico/Tuxedo/Tabby parts)
    if (breedId === "calico") {
      bodyHTML += `
        <!-- Calico body patches -->
        <path d="M 52,50 C 60,50 64,56 60,62 C 54,64 52,58 52,50 Z" fill="${s}" />
        <path d="M 38,54 C 42,54 44,60 40,64 C 36,66 34,60 38,54 Z" fill="${breed.extra}" />
      `;
    } else if (breedId === "tuxedo") {
      bodyHTML += `
        <!-- Tuxedo white chest bib -->
        <path d="M 30,58 C 36,60 40,64 38,71 C 32,73 30,68 30,58 Z" fill="${s}" />
      `;
    } else if (breedId === "tabby") {
      bodyHTML += `
        <!-- Tabby body stripes -->
        <path d="M 50,50 C 53,52 53,55 50,58" stroke="${s}" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M 56,53 C 59,55 59,58 56,61" stroke="${s}" stroke-width="2" fill="none" stroke-linecap="round" />
        <path d="M 44,55 C 47,57 47,60 44,63" stroke="${s}" stroke-width="2" fill="none" stroke-linecap="round" />
      `;
    }

    // 2. Collar (natural cat neck band + bell tag)
    collarHTML += `
      <!-- Collar -->
      <path d="M 31,55 Q 39,58 46,53" fill="none" stroke="${collarColor}" stroke-width="5.5" stroke-linecap="round" />
      <path d="M 31,55 Q 39,58 46,53" fill="none" stroke="#2c3e50" stroke-width="1.2" stroke-linecap="round" />
      <!-- Collar Bell -->
      <circle cx="39" cy="59" r="3.6" fill="#f1c40f" stroke="#2c3e50" stroke-width="1.2" />
    `;

    // 3. Legs and paws (Natural paw drawing matching breed color points)
    bodyHTML += `
      <!-- Back Leg Left -->
      <rect x="56" y="66" width="6" height="11" fill="${p}" stroke="#2c3e50" stroke-width="2.5" />
      <ellipse cx="59" cy="77" rx="4.5" ry="3.5" fill="${pawColor}" stroke="#2c3e50" stroke-width="2" />
      
      <!-- Back Leg Right -->
      <rect x="46" y="68" width="6" height="9" fill="${p}" stroke="#2c3e50" stroke-width="2.5" />
      <ellipse cx="49" cy="77" rx="4.5" ry="3.5" fill="${pawColor}" stroke="#2c3e50" stroke-width="2" />
      
      <!-- Front Leg Left -->
      <rect x="34" y="67" width="6" height="10" fill="${p}" stroke="#2c3e50" stroke-width="2.5" />
      <ellipse cx="37" cy="77" rx="4.5" ry="3.5" fill="${pawColor}" stroke="#2c3e50" stroke-width="2" />
      
      <!-- Front Leg Right -->
      <rect x="25" y="65" width="6" height="12" fill="${p}" stroke="#2c3e50" stroke-width="2.5" />
      <ellipse cx="28" cy="77" rx="4.5" ry="3.5" fill="${pawColor}" stroke="#2c3e50" stroke-width="2" />
    `;

    // 5. Ears (cartoony, bold)
    const earColor = breedId === "siamese" ? s : p;
    earsHTML += `
      <!-- Left Ear -->
      <path d="M 28,34 L 23,10 L 40,24 Z" fill="${earColor}" stroke="#2c3e50" stroke-width="2.5" stroke-linejoin="round" />
      <path d="M 30,31 L 26,16 L 36,24 Z" fill="#ffcdd2" />
      <!-- Right Ear -->
      <path d="M 52,24 L 69,10 L 64,34 Z" fill="${earColor}" stroke="#2c3e50" stroke-width="2.5" stroke-linejoin="round" />
      <path d="M 56,24 L 66,16 L 62,31 Z" fill="#ffcdd2" />
    `;

    // 6. Head (Fluffy cheeks & custom mask)
    // Left and right fluffy cheeks paths
    const fluffLeft = `C 18,36 18,48 28,47`;
    const fluffRight = `C 74,48 74,36 64,37`;
    
    if (breedId === "siamese") {
      headHTML += `
        <!-- Siamese Head Base -->
        <path d="M 28,30 C 28,20 64,20 64,30 ${fluffRight} C 64,48 28,48 28,47 ${fluffLeft} Z" fill="${p}" stroke="#2c3e50" stroke-width="2.5" stroke-linejoin="round" />
        <!-- Dark Mask overlay -->
        <path d="M 32,32 C 34,26 58,26 60,32 C 64,38 60,46 46,46 C 32,46 28,38 32,32 Z" fill="${s}" />
      `;
    } else {
      headHTML += `
        <!-- Head Base -->
        <path d="M 28,30 C 28,20 64,20 64,30 ${fluffRight} C 64,50 28,50 28,47 ${fluffLeft} Z" fill="${p}" stroke="#2c3e50" stroke-width="2.5" stroke-linejoin="round" />
      `;
    }

    // Tabby face stripes
    if (breedId === "tabby") {
      headHTML += `
        <!-- Tabby forehead stripes -->
        <path d="M 42,21 L 44,26 L 43,21 M 46,20 L 46,27 M 50,21 L 48,26 L 49,21" stroke="${s}" stroke-width="2" fill="none" stroke-linecap="round" />
        <!-- Cheek stripes -->
        <path d="M 27,38 L 33,39 M 27,42 L 32,42" stroke="${s}" stroke-width="2" fill="none" />
        <path d="M 65,38 L 59,39 M 65,42 L 60,42" stroke="${s}" stroke-width="2" fill="none" />
      `;
    }

    // Calico patches
    if (breedId === "calico") {
      headHTML += `
        <!-- Patch over right eye -->
        <path d="M 48,22 C 58,22 66,28 64,38 C 64,46 54,48 48,42 Z" fill="${s}" />
        <!-- Patch on left cheek -->
        <path d="M 28,32 C 22,34 26,45 32,44 Z" fill="${breed.extra}" />
      `;
    }

    // 7. Sparkling eyes (Large cartoon eyes, white sparkles)
    faceHTML += `
      <!-- Left Eye -->
      <circle cx="39" cy="34" r="5.5" fill="#ffffff" stroke="#2c3e50" stroke-width="2" />
      <circle cx="39" cy="34" r="4.2" fill="${eyes}" />
      <circle cx="39" cy="34" r="2.8" fill="#1c2833" />
      <circle cx="37.5" cy="32.2" r="1.5" fill="#ffffff" /> <!-- Big sparkle -->
      <circle cx="40.5" cy="35.5" r="0.7" fill="#ffffff" /> <!-- Tiny sparkle -->
      
      <!-- Right Eye -->
      <circle cx="53" cy="34" r="5.5" fill="#ffffff" stroke="#2c3e50" stroke-width="2" />
      <circle cx="53" cy="34" r="4.2" fill="${eyes}" />
      <circle cx="53" cy="34" r="2.8" fill="#1c2833" />
      <circle cx="51.5" cy="32.2" r="1.5" fill="#ffffff" /> <!-- Big sparkle -->
      <circle cx="54.5" cy="35.5" r="0.7" fill="#ffffff" /> <!-- Tiny sparkle -->
    `;

    // 8. Whiskers & Mouth (smiley!)
    faceHTML += `
      <!-- Whiskers -->
      <path d="M 26,40 L 16,39 M 25,43 L 14,43" stroke="#2c3e50" stroke-width="1.8" />
      <path d="M 66,40 L 76,39 M 67,43 L 78,43" stroke="#2c3e50" stroke-width="1.8" />
      
      <!-- Nose -->
      <polygon points="45,39 47,39 46,40.5" fill="${nose}" stroke="#2c3e50" stroke-width="1" />
      
      <!-- W-shaped Smile -->
      <path d="M 42,42 Q 44.5,44.5 46,42 M 46,42 Q 47.5,44.5 50,42" stroke="#2c3e50" stroke-width="2" fill="none" stroke-linecap="round" />
    `;

    return `
      <svg viewBox="0 0 100 100" class="cute-cat-svg cat-${breedId}" style="width: 100%; height: 100%;">
        ${bodyHTML}
        ${earsHTML}
        ${headHTML}
        ${collarHTML}
        ${faceHTML}
      </svg>
    `;
  }
};
export default CatRenderer;
