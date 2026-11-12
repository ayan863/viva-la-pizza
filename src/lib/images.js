// Məhsul şəkilləri layihənin öz "public/images" qovluğundan gəlir.
// Əvvəl şəkillər başqa saytlardan (pizzamizza.az, mcdonalds.az, ...) götürülürdü
// və o saytlar şəkilləri bağladığı üçün görünmürdü.

const BY_KEYWORD = [
  ["vegetarian", "vegetarian"],
  ["fungi", "fungi-kon-pollo"],
  ["hawaii", "hawaiian"],
  ["texas", "texas"],
  ["classic", "classico"],
  ["diavola", "diavola"],
  ["mushroom", "mushroom-delight"],
  ["prosciutto", "prosciutto-e-rucola"],
  ["truffle", "truffle-special"],
  ["carbonara", "carbonara"],
  ["seafood", "seafood-special"],
  ["fanta", "orange-soda"],
  ["cola", "cola"],
  ["sprite", "lemon-lime-soda"],
  ["tea", "iced-tea"],
  ["cocktail", "cocktail-sauce"],
  ["ketchup", "ketchup"],
  ["cheese", "cheese-sauce"],
  ["mayo", "mayonnaise"],
];

const BY_TYPE = { pizza: "pizza", drinks: "drink", sous: "sauce" };

const path = (slug) => `/images/products/${slug}.svg`;

export function fallbackImage(type) {
  return path(BY_TYPE[(type || "").toLowerCase()] || "pizza");
}

export function productImage(item = {}) {
  const name = (item.name || "").toLowerCase();
  const image = item.image || "";

  if (image.startsWith("/")) return image; // artıq lokal şəkildir
  if (name.includes("ayran")) {
    return path(image.includes("naneli") || String(item.id) === "24" ? "ayran-mint" : "ayran");
  }
  const match = BY_KEYWORD.find(([key]) => name.includes(key));
  if (match) return path(match[1]);

  // Admin paneldən əlavə olunmuş yeni məhsul: öz linki varsa onu göstər,
  // açılmasa onError ilə fallbackImage-ə keçəcək
  return image.startsWith("http") ? image : fallbackImage(item.type);
}

// <img onError={onImageError(type)} /> — xarici şəkil açılmasa lokal şəkil göstərir
export const onImageError = (type) => (e) => {
  const fb = fallbackImage(type);
  if (!e.currentTarget.src.endsWith(fb)) e.currentTarget.src = fb;
};
