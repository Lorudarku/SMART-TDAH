import * as actionTypes from "./actionTypes";
import { Pool } from "pg";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const pool = new Pool({
    user: 'your_db_user',
    host: 'your_db_host',
    database: 'your_db_name',
    password: 'your_db_password',
    port: 5432,
});

//Esta función maneja el proceso de inicio de sesión de un usuario.
export const login = (email, password, onSuccess, onError) => async (dispatch) => {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        client.release();

        if (res.rows.length > 0) {
            const user = res.rows[0];
            const match = await bcrypt.compare(password, user.password);

            if (match) {
                const token = jwt.sign({ id: user.id }, 'your_jwt_secret', { expiresIn: '1h' });
                dispatch(loginCompleted({ ...user, token }));
                onSuccess({ ...user, token });
            } else {
                onError('Invalid password');
            }
        } else {
            onError('User not found');
        }
    } catch (error) {
        onError(error.message);
    }
};

//Esta función despacha una acción de inicio de sesión completado con los datos del usuario.
const loginCompleted = (user) => ({
    type: actionTypes.LOGIN_COMPLETED,
    user,
});

//Esta función maneja el proceso de cierre de sesión de un usuario. 
//Despacha una acción de cierre de sesión completado con los datos del usuario y llama a la función action.
export const logout = (action) => (dispatch) => {
    dispatch(logoutCompleted(null));
    action();
};

//Esta función despacha una acción de cierre de sesión completado con los datos del usuario.
const logoutCompleted = (user) => ({
    type: actionTypes.LOGOUT_COMPLETED,
    user,
});

//Esta función maneja el proceso de restablecimiento de contraseña de un usuario.
export const resetPassword = (email, onSuccess, onError) => async (dispatch) => {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT * FROM users WHERE email = $1', [email]);
        client.release();

        if (res.rows.length > 0) {
            // Implement your password reset logic here
            dispatch(resetPasswordCompleted(null));
            onSuccess();
        } else {
            onError('User not found');
        }
    } catch (error) {
        onError(error.message);
    }
};

//Esta función despacha una acción de restablecimiento de contraseña completado con los datos del usuario.
const resetPasswordCompleted = (user) => ({
    type: actionTypes.RESET_PASSWORD_COMPLETED,
    user,
});

//Esta función maneja el proceso de creación de un nuevo usuario.
export const createUser = (email, password, onSuccess, onError) => async (dispatch) => {
    try {
        const client = await pool.connect();
        const res = await client.query('SELECT * FROM admins WHERE email = $1', [email]);

        if (res.rows.length > 0) {
            const hashedPassword = await bcrypt.hash(password, 10);
            await client.query('INSERT INTO users (email, password) VALUES ($1, $2)', [email, hashedPassword]);
            client.release();

            dispatch(createUserCompleted(null));
            onSuccess();
        } else {
            client.release();
            onError('Permission denied');
        }
    } catch (error) {
        onError(error.message);
    }
};

//Esta función despacha una acción de creación de usuario completada con los datos del usuario.
const createUserCompleted = (user) => ({
    type: actionTypes.CREATE_USER_COMPLETED,
    user,
});