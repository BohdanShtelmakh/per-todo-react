const KEY = 'accessToken';
let mem: string | null = localStorage.getItem(KEY);

export const authToken = {
  get: () => mem,
  set: (t: string | null) => {
    mem = t;
    if (t) localStorage.setItem(KEY, t);
    else localStorage.removeItem(KEY);
  },
  clear: () => authToken.set(null),
};
