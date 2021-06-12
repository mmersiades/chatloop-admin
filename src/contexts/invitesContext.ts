import React, { useContext } from 'react';
import { Pageable, PartnerInQueue, Invite } from '../@types/interfaces';

interface InvitesContext {
  partnersQueue?: Pageable<Array<PartnerInQueue>>;
  invites?: Pageable<Array<Invite>>;
}

// eslint-disable-next-line
export const InvitesContext = React.createContext<InvitesContext>({} as InvitesContext);

export const useInvites = () => {
  return useContext(InvitesContext);
};
