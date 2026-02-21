const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

class ApiError extends Error {
    status: number;
    constructor(message: string, status: number) {
        super(message);
        this.status = status;
    }
}

async function handleResponse(res: Response) {
    if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
            localStorage.removeItem("admin_token");
            if (typeof window !== "undefined") {
                window.location.href = "/admin/login";
            }
        }
        const err = await res.json().catch(() => ({ detail: "Request gagal" }));
        throw new ApiError(err.detail || `Error ${res.status}`, res.status);
    }
    if (res.status === 204) return null;
    return res.json();
}

function getHeaders(token?: string | null): Record<string, string> {
    const h: Record<string, string> = { "Content-Type": "application/json" };
    if (token) h["Authorization"] = `Bearer ${token}`;
    return h;
}

// ============ Public API ============

export async function fetchProjects(category?: string) {
    const params = category ? `?category=${encodeURIComponent(category)}` : "";
    const res = await fetch(`${API_URL}/api/projects${params}`);
    return handleResponse(res);
}

export async function fetchProject(slug: string) {
    const res = await fetch(`${API_URL}/api/projects/${slug}`);
    return handleResponse(res);
}

export async function fetchExperiences() {
    const res = await fetch(`${API_URL}/api/experiences`);
    return handleResponse(res);
}

export async function fetchAchievements() {
    const res = await fetch(`${API_URL}/api/achievements`);
    return handleResponse(res);
}

// ============ Admin API (JWT required) ============

export async function createProject(token: string, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/projects`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export async function updateProject(token: string, id: string, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export async function deleteProject(token: string, id: string) {
    const res = await fetch(`${API_URL}/api/projects/${id}`, {
        method: "DELETE",
        headers: getHeaders(token),
    });
    return handleResponse(res);
}

export async function createExperience(token: string, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/experiences`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export async function updateExperience(token: string, id: string, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/experiences/${id}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export async function deleteExperience(token: string, id: string) {
    const res = await fetch(`${API_URL}/api/experiences/${id}`, {
        method: "DELETE",
        headers: getHeaders(token),
    });
    return handleResponse(res);
}

export async function createAchievement(token: string, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/achievements`, {
        method: "POST",
        headers: getHeaders(token),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export async function updateAchievement(token: string, id: string, data: Record<string, unknown>) {
    const res = await fetch(`${API_URL}/api/achievements/${id}`, {
        method: "PUT",
        headers: getHeaders(token),
        body: JSON.stringify(data),
    });
    return handleResponse(res);
}

export async function deleteAchievement(token: string, id: string) {
    const res = await fetch(`${API_URL}/api/achievements/${id}`, {
        method: "DELETE",
        headers: getHeaders(token),
    });
    return handleResponse(res);
}

// ============ Upload ============

export async function uploadImage(token: string, file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch(`${API_URL}/api/upload`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
    });
    return handleResponse(res);
}

export { API_URL };
