document.addEventListener('DOMContentLoaded', function() {
    const tables = [
        { id: 'data-table', listId: 'data-list' },
        { id: 'data-table2', listId: 'data-list2' },
        { id: 'data-table3', listId: 'data-list3' },
        { id: 'data-table4', listId: 'data-list4' },
        { id: 'data-table5', listId: 'data-list5' },
        { id: 'data-table6', listId: 'data-list6' }
    ];

    const dataTables = tables.map(table => document.getElementById(table.id));
    const tableBodies = tables.map(table => document.getElementById(table.listId));

    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const column1Filter = document.getElementById('column1-filter');
    const column2Filter = document.getElementById('column2-filter');
    const column3Filter = document.getElementById('column3-filter');
    const paginationWrapper = document.getElementById('pagination-wrapper');
    let currentPage = 1;
    const rowsPerPage = 10;
    const totalData = 251;
    let searchTerm = '';
    let allData = [];
    let tempData = [];
    let tagNames = [];

    // Fetch data from the first endpoint
    fetch('http://localhost:3000/signal_info')
        .then(response => response.json())
        .then(data => {
            tagNames = data.map(item => item.Tagname);
            allData = generateAllData(tagNames);
            initializeTables();
        })
        .catch(error => {
            console.error('Error fetching data from signal_info:', error);
        });

    // Fetch data from the second endpoint
    fetch('http://localhost:3000/instant_info')
        .then(response => response.json())
        .then(data => {
            tempData = data;
            console.log('Temp data received:', tempData);
        })
        .catch(error => {
            console.error('Error fetching data from instant_info:', error);
        });

    function initializeTables() {
        tables.forEach((table, index) => {
            table.data = allData.slice(index * rowsPerPage, (index + 1) * rowsPerPage);
            buildTable(index, table.data);
        });

        updatePagination();
    }

    //--------------------------------------------------------------------------------------

    searchInput.addEventListener('input', function() {
        searchTerm = searchInput.value.toLowerCase();
    });

    searchButton.addEventListener('click', function() {
        updateTables(searchTerm, 'TagName');
        currentPage = 1;
        updatePagination();
    });

    column1Filter.addEventListener('keyup', function() {
        const filterTerm = column1Filter.value.toLowerCase();
        updateTables(filterTerm, 'SID');
        currentPage = 1;
        updatePagination();
    });

    column2Filter.addEventListener('keyup', function() {
        const filterTerm = column2Filter.value.toLowerCase();
        updateTables(filterTerm, 'TagName');
        currentPage = 1;
        updatePagination();
    });

    column3Filter.addEventListener('keyup', function() {
        const filterTerm = column3Filter.value.toLowerCase();
        updateTables(filterTerm, 'Value');
        currentPage = 1;
        updatePagination();
    });

    //--------------------------------------------------------------------------------------

    function generateAllData(tagNames) {
        const data = [];
        for (let i = 1; i <= totalData; i++) {
            const tagName = tagNames[i - 1];
            const item = {
                'SID': i.toString(),
                'TagName': tagName,
                'Value': (Math.random() * (50 - 10) + 10).toFixed(2) + '°C'
            };
            data.push(item);
        }
        return data;
    }

    //---------------------------------------------------------------------------------------

    function buildTable(index, data) {
        tableBodies[index].innerHTML = '';
        data.forEach(item => {
            const row = `<tr>
                            <td>${item.SID}</td>
                            <td>${item.TagName}</td>
                            <td>${item.Value}</td>
                        </tr>`;
            tableBodies[index].innerHTML += row;
        });
    }

    function filterData(searchTerm) {
        return allData.filter(item => {
            return item.TagName.toLowerCase().includes(searchTerm);
        });
    }

    function filterDataByColumn(filterTerm, column) {
        return allData.filter(item => {
            return item[column].toLowerCase().includes(filterTerm);
        });
    }

    //--------------------------------------------------------------------------------------

    function updateTables(filterTerm = '', column = '') {
        tables.forEach((table, index) => {
            const startIndex = (index * rowsPerPage) + ((currentPage - 1) * (tables.length * rowsPerPage));
            let filteredData = allData.slice(startIndex, startIndex + rowsPerPage);
            if (filterTerm && column) {
                filteredData = filterDataByColumn(filterTerm, column).slice(index * rowsPerPage, (index + 1) * rowsPerPage);
            }
            buildTable(index, filteredData);
        });
    }

    //--------------------------------------------------------------------------------------

    function updatePagination() {
        paginationWrapper.innerHTML = '';
        const totalPages = Math.ceil(totalData / (tables.length * rowsPerPage));
        for (let i = 1; i <= totalPages; i++) {
            const button = document.createElement('button');
            button.innerText = i;
            button.classList.add('page');
            if (i === currentPage) {
                button.classList.add('active');
            }
            button.addEventListener('click', function() {
                currentPage = i;
                updateTables(searchTerm);
                updatePagination();
            });
            paginationWrapper.appendChild(button);
        }
    }

    updatePagination();
});
