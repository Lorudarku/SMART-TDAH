import styles from './AlumnoList.module.scss';
import AlumnoLink from '../AlumnoLink/AlumnoLink';

const Alumnos = ["juan", "jose", "diego", "pepiño", "pedro", "gerbasio", "pepa", "sabado"];

function AlumnoList() {
    return (
        <div className={styles.AlumnoContainer}>
            <h1>Lista de alumnos</h1>
            <div className={styles.AlumnoList}>
                {Alumnos.map((alumno) => (
                    <AlumnoLink key={alumno}
                        nombre={alumno}
                    />
                ))}
            </div>
        </div>
    )
}

export default AlumnoList