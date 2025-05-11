import React from 'react';
import { useNavigate } from "react-router-dom";
import styles from './AlumnoLink.module.scss';

function AlumnoLink({ alumnoData, backgroundColor, isLoggedIn }) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (alumnoData?.idAlumno) { // Verifica que idAlumno no sea undefined
      navigate(`/alumnos/${alumnoData.idAlumno}`, { state: { isLoggedIn } });
    } else {
      console.error("idAlumno is undefined for alumnoData:", alumnoData);
    }
  };

  const { nombre, apellidos, email, curso } = alumnoData;

  const getInitials = (nombre, apellidos) => {
    const firstName = nombre.split(' ')[0];
    const lastName = apellidos ? apellidos.split(' ')[0] : '';
    return `${firstName[0]}${lastName ? lastName[0] : ''}`.toUpperCase();
  };

  const initials = getInitials(nombre, apellidos);

  return (
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
            ({curso}) - - - {email}
          </p>
        </div>
      </div>
    </div>
  );
}

export default AlumnoLink;