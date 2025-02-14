import SidePanel from "../components/SidePanel/SidePanel";
import styles from "./SidePanelLayout.module.scss";

function SidePanelLayout({ render }) {
  return (
    <div className={styles.flex}>
        <SidePanel />
      <div className={styles.container}>{render}</div>
    </div>
  );
}

export default SidePanelLayout