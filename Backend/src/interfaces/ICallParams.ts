// src/interfaces/iCallParams.ts (new interface for signaling data)
export interface ICallParams {
    to: string; // The user ID of the recipient
    from: string; // The user ID of the sender
    signal: any; // The WebRTC signaling data (offer, answer, ICE candidate)
  }