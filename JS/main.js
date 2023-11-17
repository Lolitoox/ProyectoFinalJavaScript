document.addEventListener('DOMContentLoaded', async () => {
    const listaElementos = document.getElementById('lista-elementos');
    const filtroSelect = document.getElementById('filtro');
    const tipoInput = document.getElementById('tipo');
    const nombreInput = document.getElementById('nombre');
    const agregarButton = document.getElementById('agregar');

    let datos = [];

    // Función para obtener datos desde el archivo JSON usando fetch
    const obtenerDatos = async () => {
        try {
            const response = await fetch('datos.json');
            datos = await response.json();
        } catch (error) {
            console.error('Error al obtener los datos:', error);
        }
    };

    // Función para mostrar la lista de elementos en el DOM
    const renderizarLista = (elementos) => {
        listaElementos.innerHTML = '';
        elementos.forEach((elemento, index) => {
            const li = document.createElement('li');
            li.textContent = `${elemento.nombre} - Tipo: ${elemento.tipo}`;

            // Añadir botón "Quitar" a cada elemento
            const botonQuitar = document.createElement('button');
            botonQuitar.textContent = 'Quitar';
            botonQuitar.addEventListener('click', async () => {
                await quitarElemento(index);
            });
            li.appendChild(botonQuitar);

            listaElementos.appendChild(li);
        });
    };

    // Función para mostrar las opciones del filtro
    const renderizarFiltro = () => {
        const categoriasUnicas = [...new Set(datos.map(elemento => elemento.tipo))];
        filtroSelect.innerHTML = '<option value="todos">Todos</option>';
        categoriasUnicas.forEach(categoria => {
            const opcion = document.createElement('option');
            opcion.value = categoria;
            opcion.textContent = categoria;
            filtroSelect.appendChild(opcion);
        });
    };

    // Función para filtrar elementos según la categoría seleccionada en el filtro
    const filtrarElementos = async () => {
        const filtro = filtroSelect.value;
        const elementosFiltrados = (filtro === 'todos') ? datos : datos.filter(elemento => elemento.tipo === filtro);
        renderizarLista(elementosFiltrados);
    };

    // Función para agregar un nuevo elemento a la lista
    const agregarElemento = async () => {
        try {
            const tipo = tipoInput.value.trim();
            const nombre = nombreInput.value.trim();

            if (tipo !== '' && nombre !== '') {
                const nuevoElemento = { tipo, nombre };
                datos.push(nuevoElemento);
                renderizarFiltro(); // Actualizar las opciones del filtro
                renderizarLista(datos);

                // Limpiar los campos después de agregar el elemento
                tipoInput.value = '';
                nombreInput.value = '';
            } else {
                alert('Por favor, ingrese tanto el tipo como el nombre del elemento.');
            }
        } catch (error) {
            console.error(error);
        }
    };

    // Función para quitar un elemento de la lista
    const quitarElemento = async (index) => {
        try {
            datos.splice(index, 1);
            renderizarFiltro(); // Actualizar las opciones del filtro
            renderizarLista(datos);
        } catch (error) {
            console.error(error);
        }
    };

    // Manejo del cambio en el filtro
    filtroSelect.addEventListener('change', filtrarElementos);

    // Manejo del clic en el botón "Agregar"  
    agregarButton.addEventListener('click', agregarElemento);

    // Obtener datos, mostrar la lista y las opciones del filtro al cargar la página
    try {
        await obtenerDatos();
        renderizarLista(datos);
        renderizarFiltro();
    } catch (error) {
        console.error(error);
    }
});
