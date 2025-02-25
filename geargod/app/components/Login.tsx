"use client";

import Modal from "react-modal";
import { useEffect, useState } from "react";

// แก้ปัญหา Warning: App Element is not defined
if (typeof window !== "undefined") {
    Modal.setAppElement("body");
}

type LoginModalProps = {
    isOpen: boolean;
    onClose: () => void;
};

export default function Login({ isOpen, onClose }: LoginModalProps) {

    const [showAnimation, setShowAnimation] = useState(false);
    const [isVisible, setIsVisible] = useState(isOpen);

    useEffect(() => {
        if (isOpen) {
            setIsVisible(true); // แสดง Modal
            setTimeout(() => setShowAnimation(true), 50); // ดีเลย์เพื่อให้แสดง Animation
        } else {
            setShowAnimation(false); // ทำให้ Modal หดลง
            setTimeout(() => setIsVisible(false), 300); // ซ่อน Modal หลังจาก Animation จบ (300ms)
        }
    }, [isOpen]);

    if (!isVisible) return null; // ถ้า Modal ปิดให้ return null ไปเลย

    return (
        <Modal
            isOpen={isVisible}
            onRequestClose={onClose}
            contentLabel="Login Modal"
            shouldCloseOnOverlayClick={true} // คลิกด้านนอกให้ปิดได้
            className={`transition-all duration-300 transform ${showAnimation ? "scale-100 opacity-100" : "scale-90 opacity-0"
                } bg-white p-6 rounded-lg shadow-lg max-w-sm mx-auto mt-40`}
            overlayClassName={`fixed inset-0 bg-black transition-opacity duration-300 ${showAnimation ? "bg-opacity-50" : "bg-opacity-0"
                } flex justify-center items-center`}
        >
            <h2 className="text-xl font-bold mb-4">เข้าสู่ระบบ</h2>
            <input
                type="text"
                placeholder="ชื่อผู้ใช้"
                className="border p-2 w-full mb-2"
            />
            <input
                type="password"
                placeholder="รหัสผ่าน"
                className="border p-2 w-full mb-4"
            />
            <button className="bg-blue-500 text-white p-2 w-full rounded" onClick={onClose}>
                เข้าสู่ระบบ
            </button>
            <button className="mt-2 text-gray-600" onClick={onClose}>
                ปิด
            </button>
        </Modal>
    );
}
