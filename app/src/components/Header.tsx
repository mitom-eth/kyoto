import Link from "next/link";

export default function Header() {
  return (
    <div className="flex h-12 items-center justify-around fixed top-0 left-0 right-0">
      <Link
        href={"/end-user"}
        className="left w-full p-4 bg-slate-600 text-white text-center"
      >
        EndUser
      </Link>
      <Link
        href={"/shop"}
        className="right w-full p-4 bg-sky-900 text-white text-center"
      >
        Shop Manager
      </Link>
    </div>
  );
}
