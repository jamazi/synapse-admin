import { AppBar, Confirm, Layout, Logout, Menu, useLogout, UserMenu } from "react-admin";
import LiveHelpIcon from "@mui/icons-material/LiveHelp";
import { LoginMethod } from "../pages/LoginPage";
import { useState } from "react";

const DEFAULT_SUPPORT_LINK = "https://github.com/etkecc/synapse-admin/issues";
const supportLink = (): string => {
  try {
    new URL(localStorage.getItem("support_url") || ""); // Check if the URL is valid
    return localStorage.getItem("support_url") || DEFAULT_SUPPORT_LINK;
  } catch (e) {
    return DEFAULT_SUPPORT_LINK;
  }
};

const CustomUserMenu = () => {
  const [open, setOpen] = useState(false);
  const logout = useLogout();
  const checkLoginType = (ev: React.MouseEvent<HTMLDivElement>) => {
    const loginType: LoginMethod = (localStorage.getItem("login_type") || "credentials") as LoginMethod;
    if (loginType === "accessToken") {
      ev.stopPropagation();
      setOpen(true);
    }
  };

  const handleConfirm = () => {
    setOpen(false);
    logout();
  };

  const handleDialogClose = () => {
    setOpen(false);
    localStorage.removeItem("access_token");
    localStorage.removeItem("login_type");
    window.location.reload();
  };

  return (
    <UserMenu>
      <div onClickCapture={checkLoginType}>
        <Logout />
      </div>
      <Confirm
        isOpen={open}
        title={`You are using an access token to login.`}
        content="Do you want to destroy this session completely or just logout from the admin panel?"
        onConfirm={handleConfirm}
        onClose={handleDialogClose}
        confirm="Destroy session"
        cancel="Logout from admin panel"
      />
    </UserMenu>
  );
};

const CustomAppBar = () => <AppBar userMenu={<CustomUserMenu />} />;

const AdminMenu = () => (
  <Menu>
    <Menu.ResourceItems />
    <Menu.Item to={supportLink()} target="_blank" primaryText="Contact support" leftIcon={<LiveHelpIcon />} />
  </Menu>
);

export const AdminLayout = ({ children }) => (
  <Layout appBar={CustomAppBar} menu={AdminMenu}>
    {children}
  </Layout>
);
