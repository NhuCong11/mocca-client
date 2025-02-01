import { MINIMUM_AGE } from '@/constants';

function useAgeEligible(birthDate: Date) {
  const today = new Date();
  const age = today.getFullYear() - birthDate.getFullYear();

  // Kiểm tra xem năm nay đã qua sinh nhật của người dùng chưa
  const isBeforeBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() && today.getDate() < birthDate.getDate());

  return isBeforeBirthdayThisYear ? age - 1 >= MINIMUM_AGE : age >= MINIMUM_AGE;
}

export default useAgeEligible;
