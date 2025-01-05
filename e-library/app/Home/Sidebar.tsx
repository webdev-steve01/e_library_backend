import Image from "next/image";
import Logo from "@/public/logo.svg";
import SidebarElements from "./SidebarElements";
import Home from "@/public/home-smile-svgrepo-com.svg";
import BorrowedBooks from "@/public/BorrowedBooks.svg";
import compass from "@/public/Compass.svg";
import Fav from "@/public/Heart.svg";
import history from "@/public/history-svgrepo-com.svg";
import settings from "@/public/settings-svgrepo-com.svg";
import help from "@/public/help.svg";

function Sidebar() {
  return (
    <div className="min-w-[300px] z-50 px-3 py-4 border-[#EDEDED] border-solid border rounded-lg bg-white flex flex-col h-[105%] justify-between ">
      <section>
        <section className="flex gap-4 px-5">
          <Image src={Logo} width={30} height={30} alt="logo" />
          <p className="text-[#23022E] font-semibold text-[1.3em] ">
            CloudShelf
          </p>
        </section>
        <section className="px-2 flex flex-col gap-2 py-10 ">
          <SidebarElements image={Home} text="Home" link="/Home" />
          <SidebarElements
            image={BorrowedBooks}
            text="Explore Resources"
            link="/Home/Resources"
          />
          <SidebarElements
            image={compass}
            text="My Borrowed Books"
            link="/Home/Library"
          />
          <SidebarElements
            image={Fav}
            text="Favorites"
            link="/Home/Favorites"
          />
          <SidebarElements
            image={history}
            text="History"
            link="/Home/History"
          />
        </section>
      </section>
      <section className="flex z-50 flex-col gap-2">
        <SidebarElements image={help} text="Help" link="#" />
        <SidebarElements
          image={settings}
          text="Settings"
          link="./Home/Settings"
        />
      </section>
    </div>
  );
}

export default Sidebar;
