import Sidebar from "./Sidebar";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section className="flex gap-[1em] p-4 w-[100vw] h-[100vh]">
      <section className="">
        <Sidebar />
      </section>
      <div className="w-[100%]">
        <section></section>
        <section>{children}</section>
      </div>
    </section>
  );
}
