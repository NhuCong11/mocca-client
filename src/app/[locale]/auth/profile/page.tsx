'use client';

import { UserInfo } from '@/types';
import Help from './Help';
import TermsOfUse from './TermsOfUse';
import WalletRecharge from './WalletRecharge';

function Profile() {
  return (
    <>
      <TermsOfUse />
      <Help />
      <WalletRecharge userInfo={{ username: 'cong' } as UserInfo} />
    </>
  );
}

export default Profile;
