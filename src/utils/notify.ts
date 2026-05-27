/** True when the user is already on this ticket's detail page (skip redundant toasts). */
export function isViewingTicket(ticketId: string): boolean {
  return window.location.pathname.includes(ticketId);
}
