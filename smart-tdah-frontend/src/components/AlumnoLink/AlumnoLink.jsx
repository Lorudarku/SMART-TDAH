import React from 'react';
import styles from './AlumnoLink.module.scss';
import { Link } from "react-router";

function AlumnoLink({nombre, onClick}) {
    const getInitials = (name) => {
        const [firstName, lastName] = name.split(' ');
        return `${firstName[0]}${lastName ? lastName[0] : ''}`.toUpperCase();
    };

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const initials = getInitials(nombre);
    const backgroundColor = getRandomColor();

    return (
        <div className={styles.AlumnoContainer}>
            <Link className={styles.AlumnoLink} 
                to={{
                    pathname: `/alumnos/${nombre}`,
                }}
            >
                <div className={styles.Alumno}>
                    <div className={styles.ProfileImage} style={{ backgroundColor }}>
                        {initials}
                    </div>
                    <h1 className={styles.AlumnoName}>{nombre}</h1>
                </div>
            </Link>
        </div>
    )
}

export default AlumnoLink