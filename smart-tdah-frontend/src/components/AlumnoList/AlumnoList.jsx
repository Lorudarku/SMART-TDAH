import styles from './AlumnoList.module.scss';
import AlumnoLink from '../AlumnoLink/AlumnoLink';

const Alumnos = ["juan", "jose", "diego", "pepiño", "pedro", "gerbasio", "pepa", "sabado", "pepe viyuela"];

function AlumnoList() {
    const handleAlumnoClick = (nombre) => {
        console.log(`Alumno ${nombre} clicked`);
    };

    return (
        <div className={styles.AlumnoContainer}>
            <h1 className={styles.title}>Lista de alumnos</h1>
            <div className={styles.AlumnoList}>
                {Alumnos.map((alumno) => (
                    <AlumnoLink key={alumno}
                        nombre={alumno}
                        onClick={handleAlumnoClick}
                    />
                ))}
            </div>
        </div>
    )
}

export default AlumnoList