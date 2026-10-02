// Folder icon for the organization scope explorer.
export function FolderIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 40" aria-hidden="true" className={className}>
      <defs>
        <linearGradient id="folder-front" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#38bdf8" />
          <stop offset="1" stopColor="#0ea5e9" />
        </linearGradient>
      </defs>
      <path
        fill="#0284c7"
        d="M2 7a5 5 0 0 1 5-5h10.9a5 5 0 0 1 3.9 1.9L24.6 7H41a5 5 0 0 1 5 5v21a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7Z"
      />
      <path
        fill="url(#folder-front)"
        d="M4 14h40a2 2 0 0 1 2 2v17a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V16a2 2 0 0 1 2-2Z"
      />
    </svg>
  );
}
