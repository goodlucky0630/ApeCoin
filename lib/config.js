export const ironOptions = {
  cookieName: "siwe",
  password: "complex_password_at_least_32_characters_long_CHANGE_BEFORE_LAUNCE",
  // secure: true should be used in production (HTTPS) but can't be used in development (HTTP)
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
  },
};
