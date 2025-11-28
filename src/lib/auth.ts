import { writable } from "svelte/store";
import { browser } from "$app/environment";

// SHA-256 hash of the family password
// To generate: echo -n "your_password" | shasum -a 256
const PASSWORD_HASH =
  "cb585eb2853f46cc1abecb47545cf6c9f8d156d658d46b675df5272c2cfc63c5";

const STORAGE_KEY = "family_auth";

function createAuthStore() {
  const isAuthenticated =
    browser && localStorage.getItem(STORAGE_KEY) === "true";
  const { subscribe, set } = writable(isAuthenticated);

  return {
    subscribe,
    login: async (password: string): Promise<boolean> => {
      const hash = await hashPassword(password);
      console.log(password, "Computed hash:", hash);
      if (hash === PASSWORD_HASH) {
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

async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const auth = createAuthStore();
