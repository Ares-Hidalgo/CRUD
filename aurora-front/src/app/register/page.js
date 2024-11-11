'use client'

import { useState } from 'react';
import Link from 'next/link';

export default function Register() {
    const initialFormData = {
        username: '',
        email: '',
        document: '',
        password: ''
    };

    const [formData, setFormData] = useState(initialFormData);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:3001/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (response.ok) {
                alert('Usuario registrado exitosamente');
                setFormData(initialFormData);
            } else {
                alert('Error al registrar el usuario');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error al registrar el usuario');
        }
    };

    return (
        <div className="flex flex-col w-full md:w-1/2 xl:w-2/5 2xl:w-2/5 3xl:w-1/3 mx-auto mt-6 p-8 md:p-10 2xl:p-12 3xl:p-14 bg-[#2C2F33] rounded-2xl shadow-xl">
            <div className="flex flex-row gap-3 pb-4">
                <h1 className="text-3xl font-bold text-[#ffffff] my-auto">Register</h1>
            </div>
            <div className="text-sm font-light text-[#6B7280] pb-8">Crea una cuenta para usar las funciones de AURORA</div>

            <form className="flex flex-col" onSubmit={handleSubmit}>
                <div className="pb-2">
                    <label htmlFor="username" className="block mb-2 text-sm font-medium text-[#ffffff]">Usuario</label>
                    <div className="relative text-gray-400">
                        <input type="text" name="username" id="username" value={formData.username} onChange={handleChange} className="pl-12 mb-2 bg-[#3B3F45] text-[#E5E7EB] border focus:border-transparent border-gray-600 sm:text-sm rounded-lg focus:ring-1 focus:outline-none focus:ring-gray-500 block w-full p-2.5" placeholder="Tu nombre de usuario" autoComplete="off" />
                    </div>
                </div>

                <div className="pb-2">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-[#ffffff]">Email</label>
                    <div className="relative text-gray-400">
                        <input type="email" name="email" id="email" value={formData.email} onChange={handleChange} className="pl-12 mb-2 bg-[#3B3F45] text-[#E5E7EB] border focus:border-transparent border-gray-600 sm:text-sm rounded-lg focus:ring-1 focus:outline-none focus:ring-gray-500 block w-full p-2.5" placeholder="name@company.com" autoComplete="off" />
                    </div>
                </div>

                <div className="pb-2">
                    <label htmlFor="document" className="block mb-2 text-sm font-medium text-[#ffffff]">Documento</label>
                    <div className="relative text-gray-400">
                        <input type="text" name="document" id="document" value={formData.document} onChange={handleChange} className="pl-12 mb-2 bg-[#3B3F45] text-[#E5E7EB] border focus:border-transparent border-gray-600 sm:text-sm rounded-lg focus:ring-1 focus:outline-none focus:ring-gray-500 block w-full p-2.5" placeholder="Número de documento" autoComplete="off" />
                    </div>
                </div>

                <div className="pb-6">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-[#ffffff]">Contraseña</label>
                    <div className="relative text-gray-400">
                        <input type="password" name="password" id="password" value={formData.password} onChange={handleChange} placeholder="••••••••••" className="pl-12 mb-2 bg-[#3B3F45] text-[#E5E7EB] border focus:border-transparent border-gray-600 sm:text-sm rounded-lg focus:ring-1 focus:outline-none focus:ring-gray-500 block w-full p-2.5" autoComplete="new-password" />
                    </div>
                </div>

                <button type="submit" className="w-full text-[#FFFFFF] bg-[#4F46E5] focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mb-6">Register</button>
                <div className="text-sm font-light text-[#6B7280]">Ya tienes cuenta?
                    <Link href="/login" className="font-medium text-[#4F46E5] hover:underline">Login</Link>
                </div>
            </form>
        </div>
    );
}