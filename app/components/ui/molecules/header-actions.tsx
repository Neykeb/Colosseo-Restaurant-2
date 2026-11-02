import { Phone } from "@phosphor-icons/react";

import { ActionLabel } from "../atoms/action-label";
import { IconButton } from "../atoms/icon-button";

type Props = {
  callLabel: string;
  menuButtonRef: React.Ref<HTMLButtonElement>;
  menuCloseLabel: string;
  menuOpenLabel: string;
  onMenuToggle: () => void;
  open: boolean;
  reserveLabel: string;
  menuIcon: React.ReactNode;
};

export function HeaderActions({
  callLabel,
  menuButtonRef,
  menuCloseLabel,
  menuIcon,
  menuOpenLabel,
  onMenuToggle,
  open,
  reserveLabel,
}: Props) {
  return (
    <div className="header-actions">
      <a className="phone-link" href="tel:+4900000000000" aria-label={callLabel}>
        <Phone aria-hidden="true" size={19} weight="regular" />
      </a>
      <ActionLabel title="Reservierungs-URL folgt">{reserveLabel}</ActionLabel>
      <IconButton
        ariaExpanded={open}
        ariaLabel={open ? menuCloseLabel : menuOpenLabel}
        buttonRef={menuButtonRef}
        className="menu-toggle"
        onClick={onMenuToggle}
      >
        {menuIcon}
      </IconButton>
    </div>
  );
}