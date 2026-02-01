import { ReactNode } from "react";

type BookingTableSidebarProps = {
  title: string;
  children: ReactNode;
}

function BookingTableSidebar({ title, children }: BookingTableSidebarProps) {
  return (
    <div className="bg-headerBg">
      <div className="py-2 border w-full flex items-center justify-center border-black bg-white">
        <h1 className="text-nowrap px-4">{title}</h1>
      </div>

      {children}

    </div>
  )
}

export default BookingTableSidebar