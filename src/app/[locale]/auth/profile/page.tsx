'use client';

import { UserInfo } from '@/types';
import Help from './components/Help';
import TermsOfUse from './components/TermsOfUse';
import WalletRecharge from './components/WalletRecharge';

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
