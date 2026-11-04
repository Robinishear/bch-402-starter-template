"use client";

import { QRCodeSVG } from "qrcode.react";

interface Props {
  address: string;
  amountBch: string;
}

export default function QrCode({ address, amountBch }: Props) {
  const bareAddress = address.replace(/^bitcoincash:/i, "");
  const paymentUri = `bitcoincash:${bareAddress}?amount=${amountBch}`;

  return (
    <div className="flex justify-center">
      <div className="rounded-lg bg-white p-3">
        <QRCodeSVG value={paymentUri} size={176} />
      </div>
    </div>
  );
}