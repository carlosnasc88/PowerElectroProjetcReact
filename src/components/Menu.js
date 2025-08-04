import React, { useRef } from "react";
import { SpeedDial } from "primereact/speeddial";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css";
import "./Menu.css";

export default function Menu() {
  const toast = useRef(null);
  const navigate = useNavigate();

  const items = [
    {
      label: "Cadastro Casa",
      icon: "pi pi-home",
      className: "menu-icon-casa",
      command: () => navigate("/casa"),
    },
    {
      label: "Cadastro Inquilino",
      icon: "pi pi-user",
      className: "menu-icon-inquilino",
      command: () => navigate("/inquilino"),
    },
    {
      label: "Sair",
      icon: "pi pi-power-off",
      className: "menu-icon-sair",
      command: () => {
        toast.current?.show({
          severity: "warn",
          summary: "Sair",
          detail: "Você saiu da aplicação.",
        });
        setTimeout(() => navigate("/"), 1000);
      },
    },
  ];

  return (
    <>
      <div className="floating-menu-wrapper">
        <Toast ref={toast} />
        <Tooltip target=".menu-icon-casa" content="Cadastro Casa" position="bottom" />
        <Tooltip target=".menu-icon-inquilino" content="Cadastro Inquilino" position="bottom" />
        <Tooltip target=".menu-icon-sair" content="Sair" position="bottom" />

        <SpeedDial
          model={items}
          radius={260}
          type="circle"
          direction="up"
          showIcon="pi pi-bolt"
          hideIcon="pi pi-times"
          buttonClassName="custom-main-button"
          style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%, -50%)" }}
        />
      </div>

      <footer className="app-footer">
        <div className="footer-content">
          <span>© {new Date().getFullYear()} Power Electro Project</span>
          <span>Desenvolvido por PWE Tecnologic</span>
        </div>
      </footer>
    </>
  );
}
