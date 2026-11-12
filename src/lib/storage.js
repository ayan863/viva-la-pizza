// localStorage-dan təhlükəsiz oxuma: dəyər yoxdursa, "undefined"-dirsə
// və ya JSON xarabdırsa, xəta atmaq əvəzinə null qaytarır.
export function readStorage(key) {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(key);
  if (!raw || raw === "undefined" || raw === "null") return null;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// Köhnə səhv yazılmış dəyərləri ("undefined", xarab JSON) təmizləyir.
export function cleanStorage() {
  if (typeof window === "undefined") return;
  for (const key of Object.keys(window.localStorage)) {
    const raw = window.localStorage.getItem(key);
    if (raw === "undefined") { window.localStorage.removeItem(key); continue; }
    try { JSON.parse(raw); } catch { window.localStorage.removeItem(key); }
  }
}
