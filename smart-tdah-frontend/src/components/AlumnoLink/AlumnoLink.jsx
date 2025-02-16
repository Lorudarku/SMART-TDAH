import React from 'react';
import styles from './AlumnoLink.module.scss';
import { useNavigate } from "react-router-dom";

function AlumnoLink({nombre, onClick, isLoggedIn}) {
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
    const navigate = useNavigate();
    
    const handleClick = () => {
        console.log(isLoggedIn);
        navigate(`/alumnos/${nombre}`, { state: { isLoggedIn } });
    };

    return (
        <div className={styles.AlumnoContainer} onClick={handleClick}>
            <div className={styles.Alumno}>
                <div className={styles.ProfileImage} style={{ backgroundColor }}>
                    {initials}
                </div>
                <h1 className={styles.AlumnoName}>{nombre}</h1>
            </div>
        </div>
    );
}

export default AlumnoLink