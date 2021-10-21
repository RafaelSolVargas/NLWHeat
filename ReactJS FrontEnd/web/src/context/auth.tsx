import { createContext, ReactNode, useEffect, useState } from "react";
import { api } from '../services/api'

type User = {
    id: string,
    name: string,
    login: string,
    avatar_url: string
}
type AuthContextData = {
    user: User | null;
    signInUrl: string,
    signOut: () => void;
}
type AuthResponse = {
    token: string,
    user: {
        id: string,
        avatar_url: string,
        name: string,
        login: string
    }
}
type AuthProvider = {
    // Configura um tipo ReactNode, que pode ser qualquer coisa
    children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextData)
const client_id = 'cf550020b5bc58f9064d'

export function AuthProvider(props: AuthProvider) {
    const [user, setUser] = useState<User | null>(null)

    const signInUrl = `https://github.com/login/oauth/authorize?scope=user&client_id=${client_id}`

    function signOut() {
        setUser(null)
        localStorage.removeItem('@NLWHeat:token')
    }

    async function signIn(githubCode: string) {
        const response = await api.post<AuthResponse>('authenticate', {
            code: githubCode
        })


        const { token, user } = response.data

        api.defaults.headers.common.authorization = `Bearer ${token}`
        localStorage.setItem('@NLWHeat:token', token)
        setUser(user)
    }

    useEffect(() => {
        const token = localStorage.getItem('@NLWHeat:token')

        if (token) {
            api.defaults.headers.common.authorization = `Bearer ${token}`

            api.get<User>('profile').then(response => {
                setUser(response.data)
            })
        }
    }, [])

    useEffect(() => {
        const url = window.location.href
        const hasGithubCode = url.includes('?code=')

        if (hasGithubCode) {
            const [urlWithoutCode, githubCode] = url.split('?code=')

            window.history.pushState({}, '', urlWithoutCode)

            signIn(githubCode)
        }

    }, [])

    return (
        <AuthContext.Provider value={{ signInUrl, user, signOut }}>
            {props.children}
        </AuthContext.Provider>
    )
}