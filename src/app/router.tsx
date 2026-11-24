import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "@/features/auth";
import AppLoading from "@/app/AppLoading";
import AppRoutes from "@/app/AppRoutes";
import {
  ForgotModal,
  LoginModal,
  OTPModal,
  RegisterModal,
  ResetModal,
} from "@/features/auth";
import { CounterOfferModal, NotificationModal } from "@/features/notifications";
import { PrivacyModal, TOSModal } from "@/features/legal";

export default function AppRouter() {
  const navigate = useNavigate();
  const location = useLocation();
  const { loginContext, isLoading, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isForgotOpen, setIsForgotOpen] = useState(false);
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerMode, setRegisterMode] = useState("create");
  const [isOTPOpen, setIsOTPOpen] = useState(false);
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isCounterModalOpen, setIsCounterModalOpen] = useState(false);
  const [counterOfferId, setCounterOfferId] = useState<string | number | null>(
    null
  );
  const [isTOSModalOpen, setIsTOSModalOpen] = useState(false);
  const [isDataModalOpen, setIsDataModalOpen] = useState(false);
  const [authEmail, setAuthEmail] = useState("");
  const [authOTP, setAuthOTP] = useState("");
  const [authPurpose, setAuthPurpose] = useState<"login" | "admin" | "reset">(
    "login"
  );

  const closeAllModals = useCallback(() => {
    setIsLoginOpen(false);
    setIsRegisterOpen(false);
    setIsForgotOpen(false);
    setIsOTPOpen(false);
    setIsResetOpen(false);
    setIsNotificationOpen(false);
    setIsCounterModalOpen(false);
    setIsTOSModalOpen(false);
    setIsDataModalOpen(false);
  }, []);

  const switchToRegister = useCallback(() => {
    closeAllModals();
    setRegisterMode("create");
    setIsRegisterOpen(true);
  }, [closeAllModals]);

  const switchToEditProfile = useCallback(() => {
    closeAllModals();
    setRegisterMode("edit");
    setIsRegisterOpen(true);
  }, [closeAllModals]);

  const closeRegisterModal = () => {
    setIsRegisterOpen(false);
    setRegisterMode("create");
    if (location.pathname === "/profile/edit") {
      navigate(user ? `/profile/${user.id}` : "/profile", { replace: true });
    }
  };

  useEffect(() => {
    if (location.pathname !== "/profile/edit") return;
    if (isLoading) return;
    if (!user) {
      navigate("/", { replace: true });
      return;
    }
    // Opening the edit dialog is the route's intended UI state.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    switchToEditProfile();
  }, [location.pathname, user, isLoading, navigate, switchToEditProfile]);

  useEffect(() => {
    if (location.state?.fromAdmin) {
      // Consume the router state by opening the login dialog.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setAuthPurpose("admin");
      setIsLoginOpen(true);

      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location.pathname, location.state, navigate]);

  const switchToLogin = () => {
    closeAllModals();
    setIsLoginOpen(true);
  };
  const switchToForgot = () => {
    closeAllModals();
    setIsForgotOpen(true);
  };
  const switchToOTP = (
    emailValue = "",
    purposeValue: "login" | "admin" | "reset" = "login"
  ) => {
    closeAllModals();
    setAuthEmail(emailValue);
    setAuthPurpose(purposeValue);
    setIsOTPOpen(true);
  };
  const switchToReset = (emailValue = "", otpValue = "") => {
    closeAllModals();
    setAuthOTP(otpValue);
    if (emailValue) setAuthEmail(emailValue);
    setIsResetOpen(true);
  };

  if (isLoading) {
    return <AppLoading />;
  }

  return (
    <>
      <AppRoutes
        openLogin={() => {
          setAuthPurpose("login");
          setIsLoginOpen(true);
        }}
        switchToLogin={switchToLogin}
        openNotifications={() => setIsNotificationOpen(true)}
        openTOS={() => setIsTOSModalOpen(true)}
        openData={() => setIsDataModalOpen(true)}
        openCounterModal={(id) => {
          setCounterOfferId(id);
          setIsCounterModalOpen(true);
        }}
        isMenuOpen={isMenuOpen}
        setIsMenuOpen={setIsMenuOpen}
      />

      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => {
          setIsLoginOpen(false);
          setAuthPurpose("login");
        }}
        onSwitchToRegister={switchToRegister}
        onSwitchToForgot={switchToForgot}
        onSwitchToOTP={switchToOTP}
        purpose={authPurpose}
        onLoginSuccess={(data) => {
          loginContext(data.user);
          closeAllModals();

          const isAdmin = ["3", "4"].includes(String(data.user.roleId));

          if (isAdmin) {
            navigate("/admin", {
              replace: true,
              state: { standardLogin: true },
            });
          } else {
            navigate("/", { replace: true });
          }
        }}
      />

      <RegisterModal
        isOpen={isRegisterOpen}
        mode={registerMode}
        onClose={closeRegisterModal}
        onSwitchToLogin={switchToLogin}
        onSwitchToTOS={() => setIsTOSModalOpen(true)}
      />

      <ForgotModal
        isOpen={isForgotOpen}
        onClose={() => setIsForgotOpen(false)}
        onSwitchToLogin={switchToLogin}
        onSwitchToOTP={(email) => switchToOTP(email, "reset")}
        onSwitchToReset={switchToReset}
      />

      <OTPModal
        isOpen={isOTPOpen}
        onClose={() => {
          setIsOTPOpen(false);
          navigate(".", { replace: true });
        }}
        email={authEmail}
        purpose={authPurpose}
        onSwitchToForgot={switchToForgot}
        onSwitchToReset={switchToReset}
        onSwitchToLogin={switchToLogin}
        onSwitchToData={() => setIsDataModalOpen(true)}
        onLoginSuccess={(data) => {
          loginContext(data.user);
          closeAllModals();
          const isAdmin = ["3", "4"].includes(String(data.user.roleId));
          navigate(isAdmin ? "/admin" : "/", { replace: true });
        }}
      />

      <ResetModal
        isOpen={isResetOpen}
        onClose={() => setIsResetOpen(false)}
        onSwitchToOTP={() => switchToOTP(authEmail, "reset")}
        onSwitchToLogin={switchToLogin}
        email={authEmail}
        otpCode={authOTP}
      />

      <NotificationModal
        isOpen={isNotificationOpen}
        onClose={() => setIsNotificationOpen(false)}
        onCounterAccept={(id) => {
          closeAllModals();
          navigate(`/whatsapp-ttl/${id}`);
        }}
      />

      <CounterOfferModal
        isOpen={isCounterModalOpen}
        onClose={() => {
          setIsCounterModalOpen(false);
          setCounterOfferId(null);
        }}
        offerId={counterOfferId}
        onSuccess={() => {
          setIsCounterModalOpen(false);
          navigate("/offers");
        }}
      />
      <TOSModal
        isOpen={isTOSModalOpen}
        onClose={() => setIsTOSModalOpen(false)}
      />
      <PrivacyModal
        isOpen={isDataModalOpen}
        onClose={() => setIsDataModalOpen(false)}
      />
    </>
  );
}
