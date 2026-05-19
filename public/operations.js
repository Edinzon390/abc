const currentEntity = document.body.dataset.entity;
const operationSelect = document.getElementById('operationSelect');
const formContainer = document.getElementById('formContainer');
const itemList = document.getElementById('itemList');
const messageBox = document.getElementById('message');

const entityConfig = {
    usuarios: {
        label: 'Usuario',
        api: '/api/usuarios',
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'email', label: 'Email', type: 'email', required: true },
            { name: 'contraseña', label: 'Contraseña', type: 'password', required: false }
        ]
    },
    tareas: {
        label: 'Tarea',
        api: '/api/tareas',
        fields: [
            { name: 'título', label: 'Título', type: 'text', required: true },
            { name: 'descripción', label: 'Descripción', type: 'textarea', required: true },
            { name: 'estado', label: 'Estado', type: 'select', options: [
                { value: 'pendiente', label: 'Pendiente' },
                { value: 'en progreso', label: 'En Progreso' },
                { value: 'completada', label: 'Completada' }
            ], required: true },
            { name: 'fechaLímite', label: 'Fecha límite', type: 'date', required: true },
            { name: 'asignadoA', label: 'Asignado a', type: 'select-user', required: false }
        ]
    },
    proyectos: {
        label: 'Proyecto',
        api: '/api/proyectos',
        fields: [
            { name: 'nombre', label: 'Nombre', type: 'text', required: true },
            { name: 'descripcion', label: 'Descripción', type: 'textarea', required: true },
            { name: 'tareas', label: 'Tareas', type: 'select-tasks', required: false }
        ]
    }
};

let selectedItem = null;

async function initOperationPage() {
    if (!operationSelect || !currentEntity) return;
    operationSelect.addEventListener('change', async () => {
        selectedItem = null;
        clearMessage();
        await renderPage();
    });

    await renderPage();
}

async function renderPage() {
    const operation = operationSelect ? operationSelect.value : 'crear';
    if (operation === 'crear') {
        renderCreateForm(currentEntity);
    } else if (operation === 'actualizar') {
        await renderEditPage(currentEntity);
    } else if (operation === 'eliminar') {
        await renderDeletePage(currentEntity);
    }
}

function renderCreateForm(entity) {
    renderForm(entity, async (e) => {
        e.preventDefault();
        const config = entityConfig[entity];
        const body = collectFormValues(config.fields);
        await submitCreate(entity, body);
    }, `Crear ${entityConfig[entity].label}`);
}

function clearMessage() {
    if (messageBox) {
        messageBox.textContent = '';
    }
}

function setMessage(text, error = false) {
    if (!messageBox) return;
    messageBox.textContent = text;
    messageBox.style.color = error ? '#c82333' : '#333';
}

function renderForm(entity, submitHandler, buttonText) {
    if (!formContainer) return;
    formContainer.innerHTML = '';

    const config = entityConfig[entity];
    const form = document.createElement('form');
    form.id = 'entityForm';

    config.fields.forEach(field => {
        form.appendChild(createField(field));
    });

    const submitButton = document.createElement('button');
    submitButton.type = 'submit';
    submitButton.textContent = buttonText;
    form.appendChild(submitButton);

    form.addEventListener('submit', submitHandler);
    formContainer.appendChild(form);
}

async function renderEditPage(entity) {
    await loadItems(entity);
    renderForm(entity, handleUpdateSubmit, `Actualizar ${entityConfig[entity].label}`);
}

function handleUpdateSubmit(e) {
    e.preventDefault();
    const entity = currentEntity;
    if (!selectedItem) {
        setMessage(`Selecciona primero un ${entityConfig[entity].label} para editar.`, true);
        return;
    }
    const config = entityConfig[entity];
    const body = collectFormValues(config.fields);
    submitUpdate(entity, selectedItem._id, body);
}

async function renderDeletePage(entity) {
    if (!itemList) return;
    itemList.innerHTML = '';
    const items = await fetchItems(entity);
    if (!items) return;

    if (!items.length) {
        itemList.textContent = `No hay ${entity} disponibles para eliminar.`;
        return;
    }

    items.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `<div>${renderItemSummary(entity, item)}</div>`;
        const deleteButton = document.createElement('button');
        deleteButton.type = 'button';
        deleteButton.textContent = 'Eliminar';
        deleteButton.addEventListener('click', () => submitDelete(entity, item._id, item));
        itemDiv.appendChild(deleteButton);
        itemList.appendChild(itemDiv);
    });
}

async function loadItems(entity) {
    if (!itemList) return;
    itemList.innerHTML = '';
    const items = await fetchItems(entity);
    if (!items) return;

    if (!items.length) {
        itemList.textContent = `No hay ${entity} disponibles para actualizar.`;
        return;
    }

    const select = document.createElement('select');
    select.id = 'itemSelect';
    select.innerHTML = `<option value="">Selecciona un ${entityConfig[entity].label}</option>`;
    items.forEach(item => {
        const option = document.createElement('option');
        option.value = item._id;
        option.textContent = renderItemSummary(entity, item);
        select.appendChild(option);
    });

    select.addEventListener('change', async () => {
        const id = select.value;
        selectedItem = items.find(i => i._id === id) || null;
        if (selectedItem) {
            fillForm(entity, selectedItem);
            clearMessage();
        }
    });

    itemList.appendChild(select);
}

function renderFieldLabel(label) {
    const fieldLabel = document.createElement('label');
    fieldLabel.textContent = label;
    return fieldLabel;
}

function createField(field, value = '') {
    const wrapper = document.createElement('div');
    wrapper.className = 'form-field';

    wrapper.appendChild(renderFieldLabel(field.label));

    let input;
    if (field.type === 'textarea') {
        input = document.createElement('textarea');
    } else if (field.type === 'select') {
        input = document.createElement('select');
        field.options.forEach(opt => {
            const option = document.createElement('option');
            option.value = opt.value;
            option.textContent = opt.label;
            input.appendChild(option);
        });
    } else if (field.type === 'select-user') {
        input = document.createElement('select');
        input.innerHTML = '<option value="">Seleccionar usuario</option>';
        loadUsersForSelect(input, value);
    } else if (field.type === 'select-tasks') {
        input = document.createElement('select');
        input.multiple = true;
        input.size = 5;
        loadTasksForSelect(input, value);
    } else {
        input = document.createElement('input');
        input.type = field.type;
    }

    input.id = field.name;
    input.name = field.name;
    input.required = Boolean(field.required);
    if (value && field.type !== 'select-tasks') {
        input.value = value || '';
    }

    wrapper.appendChild(input);
    return wrapper;
}

async function loadUsersForSelect(select, selectedId) {
    const response = await fetch('/api/usuarios');
    const data = await response.json();
    if (!data.success) return;
    data.data.forEach(user => {
        const option = document.createElement('option');
        option.value = user._id;
        option.textContent = `${user.nombre} (${user.email})`;
        if (user._id === selectedId) option.selected = true;
        select.appendChild(option);
    });
}

async function loadTasksForSelect(select, selectedIds = []) {
    const response = await fetch('/api/tareas');
    const data = await response.json();
    if (!data.success) return;
    data.data.forEach(task => {
        const option = document.createElement('option');
        option.value = task._id;
        option.textContent = task.título;
        if (selectedIds.includes(task._id)) option.selected = true;
        select.appendChild(option);
    });
}

function collectFormValues(fields) {
    const body = {};
    fields.forEach(field => {
        const element = document.getElementById(field.name);
        if (!element) return;
        if (field.type === 'select-tasks') {
            body[field.name] = Array.from(element.selectedOptions).map(opt => opt.value);
            return;
        }
        body[field.name] = element.value;
    });
    return body;
}

function fillForm(entity, item) {
    const config = entityConfig[entity];
    config.fields.forEach(async field => {
        const element = document.getElementById(field.name);
        if (!element) return;
        if (field.type === 'select-user') {
            await loadUsersForSelect(element, item.asignadoA?._id || item.asignadoA || '');
        } else if (field.type === 'select-tasks') {
            const selectedTaskIds = item.tareas ? item.tareas.map(task => task._id || task) : [];
            await loadTasksForSelect(element, selectedTaskIds);
        } else {
            element.value = item[field.name] || '';
        }
    });
}

function renderItemSummary(entity, item) {
    switch (entity) {
        case 'usuarios':
            return `${item.nombre} — ${item.email}`;
        case 'tareas':
            return `${item.título} — ${item.estado}`;
        case 'proyectos':
            return `${item.nombre} — ${item.descripcion}`;
        default:
            return item._id;
    }
}

async function fetchItems(entity) {
    const response = await fetch(entityConfig[entity].api);
    const data = await response.json();
    if (!data.success) {
        setMessage('Error al cargar datos.', true);
        return null;
    }
    return data.data;
}

async function submitCreate(entity, body) {
    try {
        const response = await fetch(entityConfig[entity].api, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (data.success) {
            setMessage(`${entityConfig[entity].label} creado correctamente.`);
            document.getElementById('entityForm').reset();
        } else {
            setMessage(`Error: ${data.error}`, true);
        }
    } catch (error) {
        setMessage('Error al crear el registro.', true);
        console.error(error);
    }
}

async function submitUpdate(entity, id, body) {
    try {
        const response = await fetch(`${entityConfig[entity].api}/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body)
        });
        const data = await response.json();
        if (data.success) {
            setMessage(`${entityConfig[entity].label} actualizado correctamente.`);
            await renderEditPage(entity);
        } else {
            setMessage(`Error: ${data.error}`, true);
        }
    } catch (error) {
        setMessage('Error al actualizar el registro.', true);
        console.error(error);
    }
}

async function submitDelete(entity, id, item) {
    if (!confirm(`¿Eliminar ${renderItemSummary(entity, item)}?`)) return;
    try {
        const response = await fetch(`${entityConfig[entity].api}/${id}`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            setMessage(`${entityConfig[entity].label} eliminado correctamente.`);
            await renderDeletePage(entity);
        } else {
            setMessage(`Error: ${data.error}`, true);
        }
    } catch (error) {
        setMessage('Error al eliminar el registro.', true);
        console.error(error);
    }
}

initOperationPage();
