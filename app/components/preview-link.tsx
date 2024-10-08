import Link from "next/link";
import { FC, ReactNode } from "react";
import { cn } from "@/app/utils/classname";

type PreviewLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

export const PreviewLink: FC<PreviewLinkProps> = ({
  href,
  className,
  children,
}) => (
  <Link
    className={cn(
      "m-1 bg-yellow-500 hover:bg-yellow-600 text-black block w-[8em] text-center p-4 rounded-[10em]",
      className
    )}
    href={href}
  >
    {children}
  </Link>
);
