import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AuthProvider from "./context/AuthProvider";
import LotsProvider from "./context/LotsProvider";
import BuyerLayout from "./layouts/BuyerLayout";
import FarmerLayout from "./layouts/FarmerLayout";
import StaffLayout from "./layouts/StaffLayout";
import AuthLayout from "./layouts/AuthLayout";
import LoginPage from "./pages/auth/LoginPage";
import BuyerBids from "./pages/buyer/BuyerBids";
import BuyerLotDetail from "./pages/buyer/BuyerLotDetail";
import BuyerMarket from "./pages/buyer/BuyerMarket";
import BuyerMyBids from "./pages/buyer/BuyerMyBids";
import FarmerBids from "./pages/farmer/FarmerBids";
import FarmerDashboard from "./pages/farmer/FarmerDashboard";
import GradeLot from "./pages/spoke/GradeLot";
import HubBidActivity from "./pages/hub/HubBidActivity";
import HubDashboard from "./pages/hub/HubDashboard";
import SpokeBidActivity from "./pages/spoke/SpokeBidActivity";
import SpokeDashboard from "./pages/spoke/SpokeDashboard";
import RoleRoute from "./routes/RoleRoute";
import { roleHome } from "./routes/roleHome";
import { useAuth } from "./hooks/useAuth";
import NotFound from "./pages/NotFound";

function HomeRedirect() {
  const { user } = useAuth();
  return <Navigate replace to={user ? roleHome[user.role] : "/login"} />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LotsProvider>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginPage />} />
            </Route>
            <Route path="/" element={<HomeRedirect />} />

            <Route element={<RoleRoute allowedRoles={["farmer"]} />}>
              <Route path="/farmer" element={<FarmerLayout />}>
                <Route index element={<FarmerDashboard />} />
                <Route path="bids" element={<FarmerBids />} />
              </Route>
            </Route>

            <Route element={<RoleRoute allowedRoles={["spoke"]} />}>
              <Route path="/spoke" element={<StaffLayout />}>
                <Route index element={<SpokeDashboard />} />
                <Route path="lots/:lotId/grade" element={<GradeLot />} />
                <Route path="bid-activity" element={<SpokeBidActivity />} />
              </Route>
            </Route>

            <Route element={<RoleRoute allowedRoles={["hub"]} />}>
              <Route path="/hub" element={<StaffLayout />}>
                <Route index element={<HubDashboard />} />
                <Route path="bid-activity" element={<HubBidActivity />} />
              </Route>
            </Route>

            <Route element={<RoleRoute allowedRoles={["buyer"]} />}>
              <Route path="/buyer" element={<BuyerLayout />}>
                <Route index element={<BuyerMarket />} />
                <Route path="bids" element={<BuyerMyBids />} />
                <Route path="lots/:lotId" element={<BuyerLotDetail />} />
                <Route path="lots/:lotId/bids" element={<BuyerBids />} />
              </Route>
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </LotsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
