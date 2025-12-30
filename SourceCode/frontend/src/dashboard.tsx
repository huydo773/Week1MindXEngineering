import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import "./styles/dashboard.css";


interface OuterToken {
    id_token: string;
    exp: number;
    iat: number;
}

interface DecodedUser {
    sub?: string;
    aud?: string;
    iss?: string;
    exp?: number;
    iat?: number;
    [key: string]: any;
}

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [token, setToken] = useState<string | null>(null);
    const [decodedUser, setDecodedUser] = useState<DecodedUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const storedToken = localStorage.getItem("token");

        if (!storedToken) {
            navigate("/");
            return;
        }

        setToken(storedToken);

        fetch("/api/dashboard", {
            headers: {
                "Authorization": `Bearer ${storedToken}`,
                "Content-Type": "application/json"
            },
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json().catch(() => ({}));
                    throw new Error(errorData.message || "Unauthorized");
                }
                return res.json();
            })
            .then(() => {
                try {
                    // LỚP 1: Giải mã token từ localStorage để lấy id_token
                    const outer = jwtDecode<OuterToken>(storedToken);

                    if (outer.id_token) {
                        // LỚP 2: Giải mã id_token để lấy sub, aud, iss thực sự
                        const inner = jwtDecode<DecodedUser>(outer.id_token);
                        setDecodedUser(inner);
                    } else {
                        // Nếu không có id_token lồng bên trong, dùng luôn lớp ngoài
                        setDecodedUser(outer as DecodedUser);
                    }
                } catch (decodeErr) {
                    console.error("JWT Decode Error:", decodeErr);
                }
            })
            .catch((err) => {
                console.error("Fetch Error:", err);
                setError("Phiên đăng nhập không hợp lệ.");
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    if (isLoading) return <div className="loading">Đang tải...</div>;

    return (
        <div className="dashboard-page">
            <div className="dashboard-card">
                <h1>Hệ Thống Dashboard</h1>

                {error ? (
                    <div className="error-box">
                        <p className="error">{error}</p>
                        <button onClick={() => navigate("/")}>Đăng nhập lại</button>
                    </div>
                ) : (
                    <>
                        <div className="user-info">
                            <h3>Thông tin người dùng (Lớp lõi)</h3>
                            <div className="info-grid">
                                <p><strong>ID (Sub):</strong> {decodedUser?.sub || "N/A"}</p>
                                <p><strong>Ứng dụng (Aud):</strong> {decodedUser?.aud || "N/A"}</p>
                                <p><strong>Nguồn (Iss):</strong> {decodedUser?.iss || "N/A"}</p>
                                {decodedUser?.exp && (
                                    <p><strong>Hết hạn:</strong> {new Date(decodedUser.exp * 1000).toLocaleString()}</p>
                                )}
                            </div>
                        </div>

                        <div className="token-box">
                            <p className="token-title">Mã truy cập gốc (Raw Token)</p>
                            <div className="token-content">
                                <code>{token}</code>
                            </div>
                        </div>

                        <button className="logout-btn" onClick={handleLogout}>Đăng xuất</button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Dashboard;