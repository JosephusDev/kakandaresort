import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react';
import { Api } from '../services/api/Index';
import { useNavigate } from 'react-router-dom';

// Definição da forma dos dados no contexto
interface AuthContextData {
    isAuthenticated: boolean;
    isCriarConta: boolean;
    contaCriada: boolean;
    terminado: boolean;
    handleLogin: (usuario: string, senha: string) => Promise<void>;
    handleCriarConta: (nome: string, usuario: string, senha: string, telefone: string) => Promise<void>;
    handleLogout: () => void;
    setIdUsuario: React.Dispatch<React.SetStateAction<number>>;
    setIsCriarConta: React.Dispatch<React.SetStateAction<boolean>>;
    setContaCriada: React.Dispatch<React.SetStateAction<boolean>>;
    idUsuario: number;
}

// Criando o contexto com o tipo definido
const AuthContext = createContext<AuthContextData>({} as AuthContextData);

// Hook personalizado para utilizar o contexto
export const useAuthContext = () => {
    return useContext(AuthContext);
}

interface MyAuthProps {
    children: ReactNode;
}

export const Auth: React.FC<MyAuthProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isCriarConta, setIsCriarConta] = useState(false);
    const [contaCriada, setContaCriada] = useState(false);
    const [terminado, setTerminado] = useState(false);
    const [idUsuario, setIdUsuario] = useState(-1)
    const navigate = useNavigate();

    const handleLogin = useCallback(async (usuario: string, senha: string) => {
        setTerminado(true)
        try {
            const response = await Api.post('/usuarios/logar', {
                usuario: usuario,
                senha: senha
            });
            if (response.status === 200 && response.data.length > 0) {
                setIsAuthenticated(true);
                setIdUsuario(response.data[0].id)
            } else {
                setIdUsuario(0)
                console.error('Usuário não encontrado ou erro na resposta do servidor');
            }
            setTerminado(false)
        } catch (error) {
            setIdUsuario(0)
            console.error(error);
        }
    }, []);

    const handleCriarConta = useCallback(async (nome: string, usuario: string, senha: string, telefone: string) => {
        setTerminado(true)
        try {
            await Api.post('/usuarios/criar', {
                nome: nome,
                usuario: usuario,
                senha: senha,
                telefone: telefone
            })
            .then(()=>{
                setIsCriarConta(false)
                setContaCriada(true)
                setTerminado(false)
            })
            .catch(()=>{
                console.error('Erro ao cadastrar')
            });
        } catch (error) {
            setIdUsuario(0)
            console.error(error);
        }
    }, []);

    const handleLogout = useCallback(() => {
        setIsAuthenticated(false);
        setIdUsuario(-1)
        navigate("/")
    }, [navigate]);

    return (
        <AuthContext.Provider value={{ isAuthenticated, isCriarConta, setIsCriarConta, handleLogin, handleLogout, idUsuario, setIdUsuario, handleCriarConta, contaCriada, setContaCriada, terminado }}>
            {children}
        </AuthContext.Provider>
    );
}
