import SidePanel from "../components/SidePanel/SidePanel";
import styles from "./SidePanelLayout.module.scss";

function SidePanelLayout({ render }) {
  //Se crea el Layout para encapsular SidePanel y así elegir
  //renderizarlo una vez logeados y NO renderizarlo si aún no
  //se ha hecho login. 
  return (
    <div className={styles.flex}>
        <SidePanel />
      <div className={styles.container}>{render}</div>
    </div>
  );
}

export default SidePanelLayout