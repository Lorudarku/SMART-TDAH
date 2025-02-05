import styles from './AlumnoLink.module.scss';

function AlumnoLink({nombre}) {
    return (
        <div className={styles.AlumnoContainer}>
            <h1>{nombre}</h1>
        </div>
    )
}

export default AlumnoLink