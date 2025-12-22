import DashBoardHeader from "./_components/DashBoardHeader";
import Sidebar from "./_components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return( 
  <div>
    <div className="md:w-64 hidden md:block fixed">
        <Sidebar/>
    </div>
    <div className="md:ml-64">
    <DashBoardHeader/>
          <div className="p-10">
          {children}
          </div>
    </div>
    </div>
  )
}
