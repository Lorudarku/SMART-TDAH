import SidePanel from "../components/SidePanel/SidePanel";
import styles from "./SidePanelLayout.module.scss";

function SidePanelLayout({ render }) {
  return (
    <div className={styles.flex}>
      {/* SidePanel ocupa un ancho fijo */}
      <div className={styles.sidePanel}>
        <SidePanel />
      </div>

      {/* Contenedor principal ajustado al espacio restante */}
      <div className={styles.container}>{render}</div>
    </div>
  );
}

export default SidePanelLayout;