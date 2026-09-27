export function formatPKR(amount: number): string {
  return 'Rs. ' + Math.round(amount).toLocaleString('en-PK');
}

export function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const sec = Math.floor(diff / 1000);
  const min = Math.floor(sec / 60);
  const hr = Math.floor(min / 60);
  const day = Math.floor(hr / 24);

  if (sec < 60) return 'Just now';
  if (min < 60) return `${min}m ago`;
  if (hr < 24) return `${hr}h ago`;
  if (day < 7) return `${day}d ago`;
  return new Date(timestamp).toLocaleDateString('en-PK', { day: '2-digit', month: 'short' });
}

export async function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback
    }
  }

  const ta = document.createElement('textarea');
  ta.value = text;
  ta.style.position = 'fixed';
  ta.style.opacity = '0';
  document.body.appendChild(ta);
  ta.select();
  let success = false;
  try {
    success = document.execCommand('copy');
  } catch {
    success = false;
  }
  ta.remove();
  return success;
}
