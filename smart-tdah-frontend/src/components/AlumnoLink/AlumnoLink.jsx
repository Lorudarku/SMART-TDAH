import styles from './AlumnoLink.module.scss';

function AlumnoLink({nombre, onClick}) {
    return (
        <div className={styles.AlumnoContainer} onClick={() => onClick(nombre)}>
            <h1>{nombre}</h1>
        </div>
    )
}

export default AlumnoLink