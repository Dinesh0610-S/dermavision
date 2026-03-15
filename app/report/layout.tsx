// This layout strips out the global app shell (CanvasWrapper, Analytics, etc.)
// so the /report page is a completely clean HTML page for printing.
export default function ReportLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
