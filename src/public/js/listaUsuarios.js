let currentPage = 1;
const itemsPerPage = 10;
let users = [];

document.addEventListener('DOMContentLoaded', () => {
    loadUsers();
    setupEventListeners();
});

function setupEventListeners() {
    document.getElementById('searchForm').addEventListener('submit', (e) => {
        e.preventDefault();
        currentPage = 1; // Reset a la primera página al buscar
        loadUsers();
    });

    document.getElementById('prevPage').addEventListener('click', () => {
        if (currentPage > 1) {
            currentPage--;
            renderUsers();
        }
    });

    document.getElementById('nextPage').addEventListener('click', () => {
        const maxPages = Math.ceil(users.length / itemsPerPage);
        if (currentPage < maxPages) {
            currentPage++;
            renderUsers();
        }
    });

    // Modal events
    const modal = document.getElementById('editUserModal');
    const span = document.getElementsByClassName('close')[0];
    span.onclick = () => modal.style.display = "none";
    window.onclick = (event) => {
        if (event.target == modal) modal.style.display = "none";
    }

    document.getElementById('editUserForm').addEventListener('submit', handleUserEdit);
}

async function loadUsers() {
    const searchTerm = document.getElementById('searchTerm').value;
    const rolFilter = document.getElementById('rolFilter').value;

    try {
        const response = await fetch(`/admin/api/users?search=${searchTerm}&rol=${rolFilter}`);
        if (!response.ok) throw new Error('Error al cargar usuarios');
        
        users = await response.json();
        renderUsers();
    } catch (error) {
        console.error('Error loading users:', error);
        alert('Error al cargar los usuarios');
    }
}

function renderUsers() {
    const tbody = document.getElementById('userTableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const paginatedUsers = users.slice(start, end);

    tbody.innerHTML = paginatedUsers.map(user => `
        <tr>
            <td>${user.id || 'N/A'}</td>
            <td>${user.name || 'N/A'}</td>
            <td>${user.email || 'N/A'}</td>
            <td>${user.rol || 'user'}</td>
            <td>
                <button onclick="editUser('${user._id}')" class="edit-btn">
                    <i class="fi fi-ss-edit"></i> Editar
                </button>
                <button onclick="deleteUser('${user._id}')" class="delete-btn">
                    <i class="fi fi-ss-trash"></i> Eliminar
                </button>
            </td>
        </tr>
    `).join('');

    // Actualizar controles de paginación
    const maxPages = Math.ceil(users.length / itemsPerPage);
    document.getElementById('currentPage').textContent = `${currentPage} de ${maxPages}`;
    document.getElementById('prevPage').disabled = currentPage === 1;
    document.getElementById('nextPage').disabled = currentPage === maxPages;
}

async function editUser(userId) {
    try {
        const response = await fetch(`/admin/api/users/${userId}`);
        if (!response.ok) throw new Error('Error al obtener detalles del usuario');
        
        const user = await response.json();
        
        document.getElementById('userId').value = user._id;
        document.getElementById('editName').value = user.name || '';
        document.getElementById('editEmail').value = user.email || '';
        document.getElementById('editRol').value = user.rol || 'user';
        
        document.getElementById('editUserModal').style.display = "block";
    } catch (error) {
        console.error('Error fetching user details:', error);
        alert('Error al obtener detalles del usuario');
    }
}

async function handleUserEdit(e) {
    e.preventDefault();
    const userId = document.getElementById('userId').value;
    const formData = new FormData();
    
    formData.append('name', document.getElementById('editName').value);
    formData.append('email', document.getElementById('editEmail').value);
    formData.append('rol', document.getElementById('editRol').value);
    
    const password = document.getElementById('editPassword').value;
    if (password) formData.append('password', password);
    
    const imageFile = document.getElementById('editImage').files[0];
    if (imageFile) formData.append('profileImage', imageFile);

    try {
        const response = await fetch(`/admin/api/users/${userId}`, {
            method: 'PUT',
            body: formData
        });

        if (!response.ok) throw new Error('Error al actualizar usuario');

        document.getElementById('editUserModal').style.display = "none";
        await loadUsers();
        alert('Usuario actualizado correctamente');
    } catch (error) {
        console.error('Error updating user:', error);
        alert('Error al actualizar el usuario');
    }
}

async function deleteUser(userId) {
    if (confirm('¿Estás seguro de que deseas eliminar este usuario?')) {
        try {
            const response = await fetch(`/admin/api/users/${userId}`, {
                method: 'DELETE'
            });

            if (!response.ok) throw new Error('Error al eliminar usuario');

            await loadUsers();
            alert('Usuario eliminado correctamente');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('Error al eliminar el usuario');
        }
    }
}
