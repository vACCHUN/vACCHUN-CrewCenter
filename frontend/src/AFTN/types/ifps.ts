export interface IFPS {
  callsign: string;
  cid: string;
  departure: string;
  arrival: string;
  eobt: string;
  tobt: string;
  reqTobt: string;
  taxi: number;
  ctot: string;
  aobt: string;
  atot: string;
  eta: string;
  mostPenalizingAirspace: string;
  cdmSts: string;
  atfcmStatus: string;
  cdmData: {
    tobt: string;
    tsat: string;
    ttot: string;
    ctot: string;
    reason: string;
    reqTobt: string;
    _id: string;
  };
  seen?: boolean;
  timeReceived?: string;
}
