import { Navigate } from "react-router-dom";
import { useParams } from 'react-router-dom';

function AlumnoData ({isLoggedIn}){
    const { alumno } = useParams();

return (
    true ? ( // isLoggedIn esta undefined (investigar)
        <div>
            <h1>{alumno}</h1>
        </div>
    ) : (
        <main>
        <Navigate
          to={{
          pathname: "/login",
          }}
        />
      </main>
    )
)
}
export default AlumnoData