import { useParams } from 'react-router-dom';

function AlumnoData ({}){
    const { alumno } = useParams();

return (
    <div>
        <h1>{alumno}</h1>
    </div>
)
}
export default AlumnoData