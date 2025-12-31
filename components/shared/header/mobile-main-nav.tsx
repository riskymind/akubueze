import Link from "next/link";

export default function MainNav({ onNavigate }: { onNavigate: () => void }) {
  return (
    <>
      <Link href="/meetings" onClick={onNavigate}>Meetings</Link>
      <Link href="/constitution" onClick={onNavigate}>Constitution</Link>
    </>
  );
}
