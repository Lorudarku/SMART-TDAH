import styles from './AlumnoList.module.scss';
import AlumnoLink from '../AlumnoLink/AlumnoLink';

const Alumnos = ["juan", "jose", "diego", "pepe", "pedro", "gerbasio", "pepa", "sabado domingo lunes", "roberto carlo"];

function AlumnoList() {

    return (
        <div className={styles.AlumnoContainer}>
            <h1 className={styles.title}>Lista de alumnos</h1>
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