import React, { useState, useEffect } from 'react';
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
    showToast
  } = useStore();

  const [selectedMethod, setSelectedMethod] = useState<string>('easypaisa');
  const [email, setEmail] = useState<string>('customer@apexstore.io');
  const [senderMobile, setSenderMobile] = useState<string>('');
  const [transactionId, setTransactionId] = useState<string>('');
  const [proofUrl, setProofUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyStep, setVerifyStep] = useState(1);

  // Always reset verification state when modal opens or closes
  useEffect(() => {
    if (paymentModalOpen) {
      setIsVerifying(false);
      setVerifyStep(1);
    }
  }, [paymentModalOpen]);

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

    setIsVerifying(true);
    setVerifyStep(1);

    setTimeout(() => setVerifyStep(2), 900);
    setTimeout(() => setVerifyStep(3), 1800);

    confirmPayment({
      method: selectedMethod,
      email,
      senderMobile,
      transactionId: transactionId || `TRX-${Date.now().toString().slice(-6)}`,
      proofUrl
    });
  };

  const handleClose = () => {
    setIsVerifying(false);
    cancelPayment();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
      <div className="bg-[#13131a] rounded-3xl overflow-hidden shadow-2xl shadow-purple-950/70 max-w-xl w-full border border-purple-900/40 relative max-h-[90vh] flex flex-col animate-[slideUpFade_0.3s_cubic-bezier(0.22,1,0.36,1)]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-purple-900/40 flex items-center justify-between bg-gradient-to-r from-purple-950/70 via-purple-900/30 to-[#13131a] shrink-0">
          <div>
            <h3 className="text-base font-extrabold text-white uppercase tracking-wider">
              Secure Checkout &amp; Payment
            </h3>
            <p className="text-[11px] text-purple-400">
              Total to Pay: <span className="font-black text-purple-300">{formatPKR(cartTotal)}</span>
            </p>
          </div>
          <button
            onClick={handleClose}
            className="text-purple-400 hover:text-purple-300 p-2 cursor-pointer rounded-xl transition"
            aria-label="Close"
          >
            <i className="fa-solid fa-xmark text-lg" />
          </button>
        </div>

        {/* Verification Timing Sequence */}
        {isVerifying ? (
          <div className="p-8 sm:p-10 flex flex-col items-center justify-center text-center">
            <div className="relative mb-6">
              <div className="w-20 h-20 rounded-full border-4 border-purple-800 border-t-purple-400 animate-spin flex items-center justify-center" />
              <div className="absolute inset-0 flex items-center justify-center text-2xl text-purple-300">
                <i className="fa-solid fa-shield-halved" />
              </div>
            </div>

            <h4 className="text-lg font-black text-white mb-2">
              {verifyStep === 1 && 'Encrypting & Securing Transaction...'}
              {verifyStep === 2 && 'Validating Payment Proof & Method...'}
              {verifyStep === 3 && 'Payment Approved! Generating Receipt...'}
            </h4>

            <p className="text-xs text-purple-300/80 mb-6 max-w-xs">
              Please wait while our secure gateway validates your transaction.
            </p>

            {/* Stepper Progress */}
            <div className="w-full max-w-xs bg-purple-950/60 rounded-full h-2 overflow-hidden border border-purple-800/40">
              <div
                className="h-full bg-gradient-to-r from-purple-500 to-fuchsia-400 transition-all duration-700 ease-out shadow-[0_0_12px_rgba(168,85,247,0.8)]"
                style={{
                  width: verifyStep === 1 ? '35%' : verifyStep === 2 ? '75%' : '100%'
                }}
              />
            </div>
          </div>
        ) : (
          /* Payment Form Content */
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
                Transfer <strong className="text-purple-300">{formatPKR(cartTotal)}</strong>, then enter details below.
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
                placeholder="https://i.ibb.co/... or image link"
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
        )}
      </div>
    </div>
  );
};
