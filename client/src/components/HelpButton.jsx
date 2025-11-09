// Floating Help Button (always visible, senior-friendly)
export function HelpButton() {
  const HELP_PHONE = '(555) 123-4567';

  return (
    <a
      href={`tel:${HELP_PHONE.replace(/[^0-9]/g, '')}`}
      className="fixed bottom-6 right-6 z-50
        bg-green-600 text-white px-6 py-4 rounded-full shadow-lg
        hover:bg-green-700 active:bg-green-800 transition-colors
        flex items-center gap-3 text-lg font-semibold"
      aria-label="Call for help"
    >
      <span className="text-2xl">📱</span>
      <span className="hidden sm:inline">Need Help? Call {HELP_PHONE}</span>
      <span className="sm:hidden">Help</span>
    </a>
  );
}
