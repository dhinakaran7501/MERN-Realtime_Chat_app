export const createAuthSlice = (set) => ({
  userInfo: undefined,
  // setUserInfo: (userInfo) => set({ userInfo }),
  setUserInfo: (info) => set({ userInfo: info }),
});
