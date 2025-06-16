export const jwtConstants = {
  salt: Number(process.env.CRYPT_SALT),
  secret: process.env.JWT_SECRET_KEY,
  secretRefresh: process.env.JWT_SECRET_REFRESH_KEY,
  expireTime: process.env.TOKEN_EXPIRE_TIME,
  refreshExpireTime: process.env.TOKEN_REFRESH_EXPIRE_TIME,
};
