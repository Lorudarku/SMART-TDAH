import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from './AlumnoLink.module.scss';


// Componente que muestra un enlace a la página de un alumno
function AlumnoLink({ alumnoData, onCLick, isLoggedIn }) {
    //Función que devuelve las iniciales de un nombre para mostrarlas en la imagen de perfil.
    const getInitials = (nombre, apellidos) => { 
        const firstName = nombre.split(' ')[0];
        const lastName = apellidos ? apellidos.split(' ')[0] : '';
        return `${firstName[0]}${lastName ? lastName[0] : ''}`.toUpperCase();
    };

    //Función que devuelve un color aleatorio para mostrarlo en la imagen de perfil.
    const getRandomColor = () => { 
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    };

    const handleClick = () => { //Función que maneja el evento de click la página del alumno.
        navigate(`/alumnos/${id_alumno}`, { state: { isLoggedIn } }); // Navega a la página del alumno y pasa el id del alumno y si el usuario está logueado.
    };

    const id_alumno = alumnoData.idAlumno; //Id del alumno
    const email = alumnoData.email; //Email del alumno
    const nombre = alumnoData.nombre; //Nombre del alumno
    const apellidos = alumnoData.apellidos; //Apellidos del alumno
    const curso = alumnoData.curso; //Curso del alumno

    const initials = getInitials(nombre, apellidos); //Iniciales del nombre del alumno.
    const backgroundColor = getRandomColor(); //Color de fondo de la imagen de perfil.
    const navigate = useNavigate(); //Función de navegación de React Router.

    return ( //Renderiza cada contenedor de alumno de la lista de alumnos.
        <div className={styles.AlumnoContainer} onClick={handleClick}> 
            <div className={styles.Alumno}>
                <div className={styles.ProfileImage} style={{ backgroundColor }}>
                    {initials}
                </div>
                <div>
                    <h1 className={styles.AlumnoName}>
                        {nombre} {apellidos}
                    </h1>
                    <p className={styles.AlumnoCursoEmail}>
                        ({curso}) ······ {email}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default AlumnoLink;