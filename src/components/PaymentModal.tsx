import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { formatPKR, copyToClipboard } from '../utils/helpers';

export const PaymentModal: React.FC = () => {
  const {
    paymentModalOpen,
    cancelPayment,
    cartTotal,
    paymentConfig,
    customPaymentMethods,
    confirmPayment,
    orderStatus,
    approvalSecondsLeft,
    currentOrder,
    setAdminModalOpen,
    manualApproveOrder,
    showToast
  } = useStore();

  const [selectedMethod, setSelectedMethod] = useState<string>('easypaisa');
  const [email, setEmail] = useState<string>('guest@apexstore.io');
  const [senderMobile, setSenderMobile] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [proofUrl, setProofUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!paymentModalOpen) return null;

  // Compile payment methods list
  const availableMethods: { key: string; name: string; icon: string }[] = [];
  if (paymentConfig.easypaisa?.active !== false) {
    availableMethods.push({ key: 'easypaisa', name: 'EasyPaisa', icon: 'fa-mobile-screen-button' });
  }
  if (paymentConfig.jazzcash?.active !== false) {
    availableMethods.push({ key: 'jazzcash', name: 'JazzCash', icon: 'fa-mobile-screen-button' });
  }
  if (paymentConfig.bank?.active !== false) {
    availableMethods.push({ key: 'bank', name: 'Bank Transfer', icon: 'fa-building-columns' });
  }
  if (paymentConfig.card?.active !== false) {
    availableMethods.push({ key: 'card', name: 'Card', icon: 'fa-credit-card' });
  }
  customPaymentMethods.forEach((cm) => {
    availableMethods.push({ key: `custom_${cm.id}`, name: cm.name, icon: cm.icon || 'fa-wallet' });
  });

  // Selected account details
  let accountLabel = 'Transfer to Account';
  let accountNumber = '03455724552';

  if (selectedMethod === 'easypaisa') {
    accountLabel = paymentConfig.easypaisa?.name || 'Anees Abid (EasyPaisa)';
    accountNumber = paymentConfig.easypaisa?.number || '03455724552';
  } else if (selectedMethod === 'jazzcash') {
    accountLabel = paymentConfig.jazzcash?.name || 'Anees Abid (JazzCash)';
    accountNumber = paymentConfig.jazzcash?.number || '03001234567';
  } else if (selectedMethod === 'bank') {
    accountLabel = paymentConfig.bank?.name || 'Meezan Bank Ltd (ApexStore)';
    accountNumber = paymentConfig.bank?.number || 'PK88MEZN00012345678901';
  } else if (selectedMethod === 'card') {
    accountLabel = 'Secure Card Checkout';
    accountNumber = '•••• •••• •••• ••••';
  } else if (selectedMethod.startsWith('custom_')) {
    const id = parseInt(selectedMethod.replace('custom_', ''), 10);
    const cm = customPaymentMethods.find((c) => c.id === id);
    if (cm) {
      accountLabel = cm.name + (cm.accountName ? ` - ${cm.accountName}` : '');
      accountNumber = cm.account;
    }
  }

  const handleCopy = async () => {
    const success = await copyToClipboard(accountNumber);
    if (success) {
      setCopied(true);
      showToast('Account number copied!');
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handlePayNow = () => {
    if (!proofUrl.trim()) {
      showToast('Please enter Payment Proof URL or receipt image link', 'error');
      return;
    }
    setIsSubmitted(true);
    confirmPayment({
      method: selectedMethod,
      email,
      senderMobile,
      transactionId: transactionId || `TRX-${Date.now().toString().slice(-6)}`,
      proofUrl
    });
  };

  // Timer format
  const mins = Math.floor(approvalSecondsLeft / 60);
  const secs = approvalSecondsLeft % 60;
  const progressPercent = Math.max(0, (approvalSecondsLeft / 300) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-[#13131a] rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/70 max-w-xl w-full border border-purple-900/40 relative max-h-[90vh] flex flex-col animate-[slideUpFade_0.3s_cubic-bezier(0.22,1,0.36,1)]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-900/40 flex items-center justify-between bg-gradient-to-r from-purple-950/70 via-purple-900/30 to-[#13131a] shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
              Secure Payment Gateway
            </h3>
            <p className="text-[11px] text-purple-400">
              Total: <span className="font-black text-purple-300">{formatPKR(cartTotal)}</span>
            </p>
          </div>
          <button
            onClick={cancelPayment}
            className="text-purple-400 hover:text-purple-300 p-2 cursor-pointer rounded-xl"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* Awaiting Admin Approval Banner with live 5-minute countdown */}
        {isSubmitted && (
          <div className="p-6 bg-gradient-to-b from-[#0a0a0f] to-[#1a0a2e] flex flex-col items-center justify-center border-b border-purple-900/40">
            <div className="w-full max-w-sm bg-[#13131a] border-2 border-purple-700 rounded-3xl p-6 text-center shadow-2xl shadow-purple-950/60 relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-purple-600 via-fuchsia-400 to-purple-600 animate-[awaitingShine_2.5s_linear_infinite]" />

              <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-700 via-purple-600 to-fuchsia-500 rounded-2xl flex items-center justify-center text-white text-2xl shadow-lg shadow-purple-500/50 animate-[awaitingIconPulse_2s_ease-in-out_infinite]">
                <i className="fa-solid fa-clock-rotate-left" />
              </div>

              <h4 className="text-base sm:text-lg font-black text-white mb-1">
                Awaiting Admin Approval
              </h4>
              <p className="text-xs text-purple-300/90 font-medium mb-3 leading-relaxed">
                Payment received. Admin is verifying your proof.<br />
                <span className="text-[11px] text-amber-300 font-bold">Only Admin Panel can approve this order.</span>
              </p>

              {/* Real-time countdown timer */}
              <div className="font-mono text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-200 tracking-widest mb-3">
                {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
              </div>

              {/* Progress Bar */}
              <div className="w-full h-1.5 bg-purple-950 rounded-full overflow-hidden mb-4 border border-purple-800/40">
                <div
                  className="h-full bg-gradient-to-r from-purple-600 via-purple-400 to-fuchsia-400 transition-all duration-1000 ease-linear shadow-[0_0_10px_rgba(168,85,247,0.6)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Pulsing Dots */}
              <div className="flex justify-center gap-1.5 mb-5">
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-[awaitingDotPulse_1.4s_ease-in-out_infinite]" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-[awaitingDotPulse_1.4s_ease-in-out_infinite_0.2s]" />
                <span className="w-2 h-2 rounded-full bg-purple-500 animate-[awaitingDotPulse_1.4s_ease-in-out_infinite_0.4s]" />
              </div>

              {/* Admin Panel Quick Trigger for Testing */}
              <div className="pt-3 border-t border-purple-900/40 flex flex-col gap-2">
                <button
                  type="button"
                  onClick={() => setAdminModalOpen(true)}
                  className="w-full bg-purple-950 hover:bg-purple-900 text-purple-200 border border-purple-700/60 font-black text-xs py-2.5 rounded-xl uppercase tracking-wider flex items-center justify-center gap-2 cursor-pointer transition shadow-md"
                >
                  <i className="fa-solid fa-crown text-amber-400" />
                  <span>Open Admin Panel (Approve Order)</span>
                </button>

                {currentOrder && (
                  <button
                    type="button"
                    onClick={() => manualApproveOrder(currentOrder.id)}
                    className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold underline cursor-pointer py-1"
                  >
                    ⚡ Quick Admin Verify (Demo Simulation)
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Payment Form Content */}
        {!isSubmitted ? (
          <div className="p-5 sm:p-6 space-y-4 overflow-y-auto flex-1">
            {/* Payment Method Selector */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-purple-400 mb-2">
                Payment Method
              </label>
              <div className="grid grid-cols-2 gap-2">
                {availableMethods.map((m) => (
                  <button
                    key={m.key}
                    type="button"
                    onClick={() => setSelectedMethod(m.key)}
                    className={`flex items-center gap-2.5 p-3 rounded-xl border-2 text-left transition cursor-pointer ${
                      selectedMethod === m.key
                        ? 'border-purple-500 bg-purple-950/60 shadow-[0_0_0_2px_rgba(168,85,247,0.2)]'
                        : 'border-purple-950/80 bg-[#0a0a0f] hover:border-purple-800'
                    }`}
                  >
                    <i className={`fa-solid ${m.icon} text-purple-400`} />
                    <span className="text-xs font-black text-purple-200 truncate">{m.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Receipt Email */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-purple-400 mb-1.5">
                Receipt Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border-2 border-purple-900/60 outline-none focus:border-purple-400 bg-[#0a0a0f] text-white"
              />
            </div>

            {/* Account Details Box */}
            <div className="rounded-2xl border-2 border-purple-900/60 bg-[#0a0a0f] p-4 text-center">
              <p className="text-xs font-black text-white mb-2">{accountLabel}</p>
              <div className="flex items-center gap-2 bg-[#13131a] rounded-xl border border-purple-900/60 p-2 px-3">
                <span className="flex-1 font-mono text-xs sm:text-sm font-black text-purple-300 break-all select-all">
                  {accountNumber}
                </span>
                <button
                  type="button"
                  onClick={handleCopy}
                  className={`w-9 h-9 rounded-lg flex items-center justify-center transition cursor-pointer shrink-0 ${
                    copied ? 'bg-emerald-600 text-white' : 'bg-purple-950 text-purple-300 hover:bg-purple-900'
                  }`}
                  title="Copy account number"
                >
                  <i className={`fa-regular ${copied ? 'fa-circle-check' : 'fa-copy'}`} />
                </button>
              </div>
              <p className="text-[11px] text-purple-400/80 mt-2">
                Transfer <strong className="text-purple-300">{formatPKR(cartTotal)}</strong>, then enter proof below.
              </p>
            </div>

            {/* Sender Mobile / Account */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-purple-400 mb-1.5">
                Sender Mobile / Account ID
              </label>
              <input
                type="text"
                placeholder="03xx xxx xxxx"
                value={senderMobile}
                onChange={(e) => setSenderMobile(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border-2 border-purple-900/60 outline-none focus:border-purple-400 font-mono bg-[#0a0a0f] text-white"
              />
            </div>

            {/* Transaction ID */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-purple-400 mb-1.5">
                Transaction ID
              </label>
              <input
                type="text"
                placeholder="TRX-123456"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border-2 border-purple-900/60 outline-none focus:border-purple-400 font-mono bg-[#0a0a0f] text-white"
              />
            </div>

            {/* Payment Proof URL */}
            <div>
              <label className="block text-xs font-black uppercase tracking-widest text-purple-400 mb-1.5">
                Payment Proof URL <span className="text-red-400">*</span>
              </label>
              <input
                type="url"
                placeholder="https://i.ibb.co/..."
                value={proofUrl}
                onChange={(e) => setProofUrl(e.target.value)}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border-2 border-purple-900/60 outline-none focus:border-purple-400 font-mono bg-[#0a0a0f] text-white"
              />
            </div>

            {/* Submit Button */}
            <button
              type="button"
              onClick={handlePayNow}
              className="w-full bg-gradient-to-r from-purple-700 via-purple-600 to-fuchsia-600 hover:from-purple-600 hover:to-fuchsia-500 text-white font-black py-4 rounded-xl text-xs sm:text-sm uppercase tracking-wider shadow-lg shadow-purple-900/50 transition active:scale-[0.98] cursor-pointer"
            >
              Securely Pay {formatPKR(cartTotal)}
            </button>
          </div>
        ) : (
          /* Live Status Indicators */
          <div className="p-5 sm:p-6 bg-[#0e0a17]">
            <label className="block text-xs font-black uppercase tracking-widest text-purple-400 mb-3 text-center">
              Real-Time Verification State
            </label>
            <div className="grid grid-cols-2 gap-2.5">
              <div className={`status-badge ${orderStatus === 'pending' ? 'pending' : ''}`}>
                <i className="fa-solid fa-clock" />
                <span>Pending</span>
              </div>
              <div className={`status-badge ${orderStatus === 'processing' ? 'processing' : ''}`}>
                <i className="fa-solid fa-spinner" />
                <span>Processing</span>
              </div>
              <div className={`status-badge ${orderStatus === 'verified' ? 'verified' : ''}`}>
                <i className="fa-solid fa-circle-check" />
                <span>Verified</span>
              </div>
              <div className={`status-badge ${orderStatus === 'rejected' ? 'rejected' : ''}`}>
                <i className="fa-solid fa-circle-xmark" />
                <span>Rejected</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
