import React from 'react';
import styles from './AlumnoLink.module.scss';

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
        <div className={styles.AlumnoContainer} onClick={() => onClick(nombre)}>
            <div className={styles.ProfileImage} style={{ backgroundColor }}>
                {initials}
            </div>
            <h1 className={styles.AlumnoName}>{nombre}</h1>
        </div>
    )
}

export default AlumnoLink