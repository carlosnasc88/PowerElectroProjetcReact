import React, { useRef } from "react";
import { SpeedDial } from "primereact/speeddial";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { useNavigate } from "react-router-dom";
import "primeicons/primeicons.css";
import "primereact/resources/primereact.min.css";
import "primereact/resources/themes/lara-light-indigo/theme.css"; // ou o tema que estiver usando
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
      id: "tooltip-casa",
    },
    {
      label: "Cadastro Inquilino",
      icon: "pi pi-user",
      className: "menu-icon-inquilino",
      command: () => navigate("/inquilino"),
      id: "tooltip-inquilino",
    },
    {
      label: "Sair",
      icon: "pi pi-power-off",
      className: "menu-icon-sair",
      command: () => {
        toast.current.show({
          severity: "warn",
          summary: "Sair",
          detail: "Você saiu da aplicação.",
        });
        setTimeout(() => navigate("/login"), 1000);
      },
      id: "tooltip-sair",
    },
  ];

  return (
    <div className="floating-menu-wrapper">
      <Toast ref={toast} />
      {/* Tooltips manuais */}
      <Tooltip target=".menu-icon-casa" content="Cadastro Casa" position="bottom" />
      <Tooltip target=".menu-icon-inquilino"content="Cadastro Inquilino"position="bottom"
      />
      <Tooltip target=".menu-icon-sair" content="Sair" position="bottom" />
      ,
      <SpeedDial
        model={items}
        radius={150}
        type="quarter-circle"
        direction="down-right"
        showIcon="pi pi-bars"
        hideIcon="pi pi-times"
        buttonClassName="custom-main-button"
        style={{ position: "absolute", top: "0px", left: "0px" }}
      />
    </div>
  );
}
