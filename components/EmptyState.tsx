export default function EmptyState({ message }: { message: string }) {
  return <div className="text-center py-5 text-muted"><i className="bi bi-inbox" style={{ fontSize: 48 }}></i><p className="mt-2">{message}</p></div>;
}
