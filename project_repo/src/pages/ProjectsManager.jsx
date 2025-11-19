// src/pages/ProjectsManager.jsx
import { useEffect, useState, useRef } from "react";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import ProjectForm from "../components/ProjectForm";

const API = import.meta.env?.VITE_API_URL;

export default function ProjectsManager() {
    const [projects, setProjects] = useState([]);
    const [editing, setEditing] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState("");
    const savingOrderRef = useRef(false); // prevent rapid double-saves

    const idOf = (p) => p.id || p._id;

    const load = async () => {
        setLoading(true);
        setErr("");
        try {
            const res = await fetch(`${API}/api/projects`);
            if (!res.ok) throw new Error(`Failed to load projects (${res.status})`);
            setProjects(await res.json());
        } catch (e) {
            setErr(e.message || "Failed to load projects");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { load(); }, []);

    const handleDelete = async (p) => {
        if (!confirm(`Delete "${p.title}"?`)) return;
        try {
            const res = await fetch(`${API}/api/projects/${idOf(p)}`, { method: "DELETE" });
            if (!res.ok && res.status !== 204) throw new Error(`Failed to delete (${res.status})`);
            if (editing && idOf(editing) === idOf(p)) setEditing(null);
            await load();
        } catch (e) {
            alert(e.message || "Failed to delete");
        }
    };

    // (optional) persist order to backend
    const persistOrder = async (ordered) => {
        if (savingOrderRef.current) return;
        savingOrderRef.current = true;
        try {
            await fetch(`${API}/api/projects/reorder`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(ordered.map((p) => idOf(p))), // send array of ids
            });
        } catch {
            // non-fatal; you could toast an error here
        } finally {
            savingOrderRef.current = false;
        }
    };

    // DnD
    const handleDragEnd = async (result) => {
        if (!result.destination) return;

        const reordered = Array.from(projects);
        const [moved] = reordered.splice(result.source.index, 1);
        reordered.splice(result.destination.index, 0, moved);
        setProjects(reordered);

        // comment out if you don't have the endpoint yet
        // await persistOrder(reordered);

        // send real Mongo ids
        const ids = reordered.map(p => p._id || p.id); // ok; virtual id is the same string
        await fetch(`${API}/api/projects/reorder`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(ids),
        });

    };

    return (
        <>
            <h1>Project Manager</h1>

            <div className="content-container">
                <div className="form-container">
                    <h2 className="form-title">{editing ? "Edit Project" : "Create Project"}</h2>
                    <ProjectForm
                        key={editing?._id || editing?.id || "new"}
                        project={editing}
                        onSuccess={() => { setEditing(null); load(); }}
                        onCancel={() => setEditing(null)}
                    />
                </div>

                <div className="list-container">
                    <h2 className="form-title">All Projects</h2>
                    {loading && <p>Loading…</p>}
                    {err && <p>Error: {err}</p>}
                    {!loading && !err && !projects.length && <p>No projects yet.</p>}

                    {!loading && !err && projects.length > 0 && (
                        <DragDropContext onDragEnd={handleDragEnd}>
                            <Droppable droppableId="projects-droppable">
                                {(dropProvided) => (
                                    <table
                                        id="projects-table"
                                        {...dropProvided.droppableProps}
                                        ref={dropProvided.innerRef}
                                    >

                                        <tbody>
                                            {projects.map((p, index) => (
                                                <Draggable
                                                    key={idOf(p)}
                                                    draggableId={String(idOf(p))}
                                                    index={index}
                                                >
                                                    {(dragProvided, snapshot) => (
                                                        <tr
                                                            ref={dragProvided.innerRef}
                                                            {...dragProvided.draggableProps}
                                                            className={`draggable-row ${snapshot.isDragging ? "dragging" : ""}`}
                                                        >
                                                            {/* drag handle cell (so buttons keep working) */}
                                                            <td className="drag-handle-cell" {...dragProvided.dragHandleProps} title="Drag to reorder">
                                                                ☰
                                                            </td>
                                                            <td className="title-cell" title={p.title}>{p.title}</td>
                                                            <td><button onClick={() => setEditing(p)}>Edit</button></td>
                                                            <td><button onClick={() => handleDelete(p)}>Delete</button></td>
                                                        </tr>
                                                    )}
                                                </Draggable>
                                            ))}
                                            {dropProvided.placeholder}
                                        </tbody>
                                    </table>
                                )}
                            </Droppable>
                        </DragDropContext>
                    )}

                    <button className="r-btn" onClick={load}>Refresh</button>
                </div>
            </div>
        </>
    );
}
