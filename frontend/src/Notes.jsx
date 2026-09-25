import React, { useState, useEffect } from 'react';

function Notes() {
    /* ========================================================================
    VÙNG 1: KHỞI TẠO STATE
    ======================================================================== */
    const [topic, setTopic] = useState('hoc-tap');
    const [notes, setNotes] = useState([]);
    const [searchKeyword, setSearchKeyword] = useState('');

    const [formData, setFormData] = useState({
        id: null,
        title: '',
        content: ''
    });

    /* ========================================================================
    VÙNG 2: XỬ LÝ LOGIC & GỌI API
    ======================================================================== */

    // Lấy toàn bộ ghi chú
    const fetchNotes = () => {
        fetch(`http://localhost:5000/api/notes/${topic}`)
            .then(res => res.json())
            .then(data => setNotes(data))
            .catch(error => console.error('Lỗi lấy ghi chú:', error));
    };

    useEffect(() => {
        fetchNotes();
    }, [topic]);

    // Tìm kiếm ghi chú
    const handleSearch = () => {
        if (searchKeyword.trim() === '') {
            fetchNotes();
            return;
        }

        fetch(
            `http://localhost:5000/api/notes/${topic}/search?q=${encodeURIComponent(searchKeyword)}`
        )
            .then(res => res.json())
            .then(data => setNotes(data))
            .catch(error => console.error('Lỗi tìm kiếm:', error));
    };

    // Thêm hoặc sửa ghi chú
    const handleSave = () => {
        const method = formData.id ? 'PUT' : 'POST';

        const url = formData.id
            ? `http://localhost:5000/api/notes/${topic}/${formData.id}`
            : `http://localhost:5000/api/notes/${topic}`;

        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                title: formData.title,
                content: formData.content
            })
        })
            .then(res => res.json())
            .then(() => {
                fetchNotes();

                setFormData({
                    id: null,
                    title: '',
                    content: ''
                });

                setSearchKeyword('');
            })
            .catch(error => console.error('Lỗi lưu ghi chú:', error));
    };

    // Xóa ghi chú
    const handleDelete = (id) => {
        if (window.confirm('Bạn có chắc muốn xóa ghi chú này?')) {
            fetch(
                `http://localhost:5000/api/notes/${topic}/${id}`,
                {
                    method: 'DELETE'
                }
            )
                .then(() => fetchNotes())
                .catch(error => console.error('Lỗi xóa ghi chú:', error));
        }
    };

    // Sửa ghi chú
    const handleEdit = (note) => {
        setFormData({
            id: note.id,
            title: note.title,
            content: note.content
        });
    };

    /* ========================================================================
    VÙNG 3: RENDER GIAO DIỆN
    ======================================================================== */

    return (
        <div style={{ padding: '20px' }}>

            <h2>Ghi chú Công khai</h2>

            {/* 3.1. Vùng chọn chủ đề */}
            <div style={{ marginBottom: '20px' }}>
                <strong>Chủ đề: </strong>

                <select
                    value={topic}
                    onChange={(e) => {
                        setTopic(e.target.value);
                        setSearchKeyword('');
                    }}
                >
                    <option value="hoc-tap">Học tập</option>
                    <option value="cong-viec">Công việc</option>
                    <option value="ca-nhan">Cá nhân</option>
                </select>
            </div>

            {/* 3.2. Tìm kiếm */}
            <div
                style={{
                    marginBottom: '20px',
                    display: 'flex',
                    gap: '10px'
                }}
            >
                <input
                    type="text"
                    placeholder="Nhập từ khóa cần tìm..."
                    value={searchKeyword}
                    onChange={(e) => setSearchKeyword(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                    style={{
                        flex: 1,
                        padding: '10px',
                        border: '1px solid #ccc',
                        borderRadius: '5px'
                    }}
                />

                <button onClick={handleSearch}>
                    Tìm kiếm
                </button>

                <button
                    onClick={() => {
                        setSearchKeyword('');
                        fetchNotes();
                    }}
                >
                    Xem tất cả
                </button>
            </div>

            {/* 3.3. Form nhập liệu */}
            <div
                style={{
                    border: '1px solid #ccc',
                    padding: '10px',
                    marginBottom: '20px'
                }}
            >
                <h3>
                    {formData.id
                        ? 'Sửa ghi chú'
                        : 'Thêm ghi chú mới'}
                </h3>

                <input
                    placeholder="Tiêu đề"
                    value={formData.title}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            title: e.target.value
                        })
                    }
                    style={{
                        display: 'block',
                        width: '100%',
                        marginBottom: '10px',
                        boxSizing: 'border-box'
                    }}
                />

                <textarea
                    placeholder="Nội dung"
                    value={formData.content}
                    onChange={e =>
                        setFormData({
                            ...formData,
                            content: e.target.value
                        })
                    }
                    style={{
                        display: 'block',
                        width: '100%',
                        height: '80px',
                        marginBottom: '10px',
                        boxSizing: 'border-box'
                    }}
                />

                <button onClick={handleSave}>
                    {formData.id
                        ? 'Cập nhật'
                        : 'Thêm mới'}
                </button>

                {formData.id && (
                    <button
                        onClick={() =>
                            setFormData({
                                id: null,
                                title: '',
                                content: ''
                            })
                        }
                        style={{ marginLeft: '10px' }}
                    >
                        Hủy
                    </button>
                )}
            </div>

            {/* 3.4. Danh sách thẻ ghi chú */}
            <div
                style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '15px'
                }}
            >
                {notes.length === 0 && (
                    <p>Không tìm thấy ghi chú nào.</p>
                )}

                {notes.map(note => (
                    <div
                        key={note.id}
                        style={{
                            border: '1px solid #007bff',
                            padding: '15px',
                            borderRadius: '5px'
                        }}
                    >
                        <h4 style={{ margin: '0 0 10px 0' }}>
                            {note.title}
                        </h4>

                        <p style={{ whiteSpace: 'pre-wrap' }}>
                            {note.content}
                        </p>

                        <div style={{ marginTop: '10px' }}>
                            <button
                                onClick={() => handleEdit(note)}
                                style={{ marginRight: '10px' }}
                            >
                                Sửa
                            </button>

                            <button
                                onClick={() => handleDelete(note.id)}
                                style={{ color: 'red' }}
                            >
                                Xóa
                            </button>
                        </div>
                    </div>
                ))}
            </div>

        </div>
    );
}

export default Notes;