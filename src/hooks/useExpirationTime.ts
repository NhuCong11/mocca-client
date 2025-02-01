const getExpirationTime = (minutes: number): Date => {
  const expirationDate = new Date();
  expirationDate.setMinutes(expirationDate.getMinutes() + minutes);
  return expirationDate;
};

export default getExpirationTime;
