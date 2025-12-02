import { writable } from "svelte/store";
import { browser } from "$app/environment";

// The family password (obfuscated in base64 - not secure, but keeps casual viewers out)
// To change: btoa("your_password") in browser console
const PASSWORD_B64 = "QW15J3MgZmF2b3VyaXRlIGNoZWVzZSBpcyBnb2F0";

const STORAGE_KEY = "family_auth";

function createAuthStore() {
  const isAuthenticated =
    browser && localStorage.getItem(STORAGE_KEY) === "true";
  const { subscribe, set } = writable(isAuthenticated);

  return {
    subscribe,
    login: (password: string): boolean => {
      // Simple comparison (base64 encoded for minimal obfuscation)
      if (btoa(password) === PASSWORD_B64) {
        if (browser) {
          localStorage.setItem(STORAGE_KEY, "true");
        }
        set(true);
        return true;
      }
      return false;
    },
    logout: () => {
      if (browser) {
        localStorage.removeItem(STORAGE_KEY);
      }
      set(false);
    },
    check: () => {
      if (browser) {
        const isAuth = localStorage.getItem(STORAGE_KEY) === "true";
        set(isAuth);
        return isAuth;
      }
      return false;
    },
  };
}

export const auth = createAuthStore();
