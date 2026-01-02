import Link from 'next/link';

interface BackLinkProps {
  href: string;
  label?: string;
}

export default function BackLink({ href, label = '← 뒤로가기' }: BackLinkProps) {
  return (
    <div className="mb-6">
      <Link
        href={href}
        className="text-red-600 hover:text-red-700 text-sm"
      >
        {label}
      </Link>
    </div>
  );
}

